# Concurrency

Concurrency defects are the ones that pass every test and fail in
production, because a test suite usually runs one request at a time and
production does not.

## The two shapes of check-then-act

A check-then-act race is any sequence that reads state, decides based on
what it read, then writes, with no guarantee that nothing changed in
between. It appears in two shapes, and they do not have the same remedy.

**The insert race.** Two requests both check that a record does not
exist, both find nothing, and both insert. Closed with a `UNIQUE`
constraint and an atomic upsert, see `database.md`.

**The lost update.** Two requests both read an existing row, both decide
based on the value they read, and both write. The second write was
computed from a value that is already stale, so the first update is
silently lost.

```java
// Lost update: two concurrent calls both read saldo = 50,
// both pass the check, and both subtract from 50.
Conta conta = contaRepo.findById(id).orElseThrow();
if (conta.getSaldo().compareTo(valor) >= 0) {
    conta.setSaldo(conta.getSaldo().subtract(valor));
    contaRepo.save(conta);
}
```

A transaction alone does not fix this. A transaction gives atomicity, all
of the writes or none of them, not mutual exclusion. At the default
isolation level of most databases, two transactions can read the same row
and both write it.

## Closing a lost update

Three options, in the order to prefer them.

**Atomic conditional update.** Move the check and the write into one
statement and let the database evaluate the condition at write time.
Nothing can change between the check and the act because there is no gap.

```sql
UPDATE conta SET saldo = saldo - :valor
 WHERE id = :id AND saldo >= :valor;
```

Zero rows affected means the condition failed, and the caller must treat
that as a business failure, not as success. Prefer this whenever the rule
can be expressed as a predicate on the row being written.

**Pessimistic lock.** `SELECT ... FOR UPDATE` on the row, inside the
transaction, before reading the value the decision depends on. The second
request waits for the first to commit and then reads the updated value.
Prefer this when the decision needs several reads, or spans more than one
row, and cannot be collapsed into a single statement. It serializes
access to the row, so it costs throughput under contention, and it
deadlocks when different code paths lock the same rows in different
orders.

**Optimistic lock.** A version column checked and incremented on write; a
write whose version no longer matches fails, and the operation is
retried. Prefer this when conflicts are rare and the retry is cheap and
safe to repeat. It only works if the caller actually handles the
conflict instead of swallowing it.

## Concurrency is not reprocessing

A lock or a conditional update protects against two requests racing at
the same instant. It does nothing about the same logical operation
arriving twice, seconds apart, because a client retried or a queue
redelivered it. That is idempotency, closed with an idempotency key under
a unique constraint, see `database.md`.

Both can be true of the same endpoint, so ask them separately: what
happens if two of these run at the same time, and what happens if this
same operation arrives twice.

## Testing concurrency

- A sequential test cannot catch a race. One thread never interleaves
  with itself, so a green suite proves nothing about concurrent
  behavior. This is a structural limit, not a gap in coverage.
- Write the test that runs the operation concurrently against real
  infrastructure, and assert the invariant afterwards (exactly one
  record, a balance that never goes negative, a total that is
  conserved), not the sequence of calls.
- A passing concurrency test is weak evidence, not proof. Races are
  non-deterministic and a given interleaving may simply not occur in a
  given run. Read a green run as "did not reproduce," and prefer a
  design where the race cannot happen over a test that hopes to catch
  it.
- Where the language has a dedicated harness, use it for shared-state
  code rather than hand-rolled thread spawning: jcstress on the JVM, the
  race detector in Go, ThreadSanitizer in C and C++.

Related: `database.md`, `backend.md`, `testing.md`, `resilience.md`,
`review-checklist.md`.
