# Database

Assume PostgreSQL unless the project states otherwise.

## Schema design

- Normalization by default. Denormalization is allowed only with a stated
  reason (a specific, observed performance need), not as a default
  convenience.
- Primary keys, foreign keys, and constraints (`NOT NULL`, `UNIQUE`,
  `CHECK`) are enforced at the database level, not only in application
  code. Application-level validation can duplicate a constraint for a
  better error message, but the database is the last line of defense.

## Indexing and query performance

- Indexes, including composite indexes, are added based on actual
  observed access patterns, not speculative optimization. An index has a
  write-time cost; do not add one "just in case."
- Use `EXPLAIN` and `EXPLAIN ANALYZE` to verify a query's actual plan
  before assuming an index or a rewrite improved anything. Do not guess.
- Select columns explicitly. `SELECT *` requires a stated reason, for
  example an ORM model that genuinely needs every column for the object
  it hydrates.
- Paginate or batch any query that could return an unbounded result set.
  An endpoint or job that runs `SELECT * FROM table` with no limit will
  eventually be handed a table too large for that to work.

## N+1 queries

A loop that issues one query per iteration where a single batched or
joined query would do is a defect, not an acceptable trade-off for
readability.

```python
# N+1: one query per booking to fetch its client
for booking in bookings:
    client = session.query(Client).get(booking.client_id)

# Fixed: single batched query
client_ids = [b.client_id for b in bookings]
clients = session.query(Client).filter(Client.id.in_(client_ids)).all()
```

## Preventing duplicate records under concurrency

Two concurrent requests can both pass a "does this exist yet" check before either one has written anything, and both proceed to insert. This is the same check-then-act race condition described in `review-checklist.md`, and the database is where it is actually closed, not the application layer, an application-level check can never be atomic against another process doing the same check at the same time.

- Enforce the real constraint in the schema: a `UNIQUE` constraint (or a unique index, including a partial or composite one when uniqueness only applies under certain conditions) on whatever combination of columns must not repeat. This is the only way concurrent inserts have somewhere authoritative to conflict.
- Prefer an atomic upsert over "check, then insert." In Postgres, `INSERT ... ON CONFLICT (columns) DO NOTHING` (or `DO UPDATE` when the second attempt should update instead of being silently dropped) resolves the race in the database itself, in a single statement, instead of a read followed by a write with a gap in between.

  ```python
  # Race-prone: check then act, two concurrent calls can both pass the check
  existing = session.query(Payment).filter_by(idempotency_key=key).first()
  if not existing:
      session.add(Payment(idempotency_key=key, ...))

  # Race-free: the constraint and the database resolve it atomically
  stmt = insert(payments).values(idempotency_key=key, ...)
  stmt = stmt.on_conflict_do_nothing(index_elements=["idempotency_key"])
  session.execute(stmt)
  ```

- When the operation is triggered by an external event that might be delivered more than once (a retried request, a webhook, a message redelivered by a queue), require an idempotency key as part of the unique constraint, not an incidental column. The key identifies the operation being attempted, not the row's own generated ID.
- A `SERIALIZABLE` (or, where the workload allows it, `REPEATABLE READ`) transaction isolation level is the right tool when a unique constraint alone cannot express the invariant, for example when the rule spans more than one row or table. This costs throughput; reach for it when the constraint-based approach genuinely cannot express the rule, not as a default.
- This is worth the same kind of test as the Row Level Security section below: fire the operation concurrently against a real database and assert exactly one record was written, not a unit test against a mock that cannot race against itself.

## Migrations

- Migrations must be reversible where practical. Prefer a
  rename-and-transition-period pattern (add the new column, backfill,
  switch reads, then drop the old column in a later migration) over an
  immediate destructive `DROP COLUMN` in production.
- Any destructive migration (dropping a column, dropping a table,
  irreversibly transforming data) requires the confirmation protocol in
  `ai-usage-policy.md` before it is written, not only before it is run.

## Connection pooling

Connection pooling changes the rules for anything that depends on
connection-scoped state, because a pooled connection is reused across
different requests, and potentially different users, over its lifetime.
See the Row Level Security section below for the concrete failure mode
this causes.

## Row Level Security (Postgres)

- Enable RLS on every table reachable by the application:
  `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`, with policies that
  scope rows to the authenticated owner. Never write a permissive
  `USING (true)` policy, that disables RLS in practice while leaving it
  nominally "on."
- The application's database role must not have the `BYPASSRLS`
  attribute, and must not be the table owner. Table owners bypass RLS by
  default regardless of that attribute, independent of any grant. Verify
  with `\du` in `psql`: the application role should show no `Bypass RLS`.
- Connection pooling (SQLAlchemy's default `QueuePool`, or any equivalent
  pool in another language or framework) reuses physical connections
  across different users' requests. Setting a user-context session
  variable with a plain `SET` persists on that connection until something
  resets it, which can leak one user's row-scoping context into a
  different user's request once the connection is handed back to the
  pool and reused.
- Use `SET LOCAL app.current_user_id = :user_id` (or the equivalent for
  the ORM in use) inside the same transaction that runs the request's
  queries. `SET LOCAL` automatically reverts at `COMMIT` or `ROLLBACK`,
  so it cannot leak across a pooled connection the way a plain `SET`
  does. Wire this so it runs on every request automatically, for example
  a session or transaction-start hook, not something each new endpoint
  has to remember to do by hand.
- RLS policies read that value back with
  `current_setting('app.current_user_id')::uuid` (or the matching type)
  to scope rows to the current user.
- This is worth an integration test, not just a manual check: two
  concurrent simulated users hitting the application should never see
  each other's rows. A unit test with a mocked database cannot catch a
  regression here; the test needs a real pooled connection under real
  concurrent load.

Related: `architecture.md`, `backend.md`, `security.md`, `review-checklist.md`.
