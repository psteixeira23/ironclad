# Architecture

Apply these principles in every codebase this content is installed into, regardless of language or framework.

## Layered architecture

Ironclad assumes a layered architecture, close to what Clean Architecture and hexagonal architecture describe, adapted to be practical rather than dogmatic. The goal is separation of concerns: business rules should not know or care how they are triggered (HTTP, a queue message, a CLI) or how their data is persisted (Postgres, a cache, a third-party API).

### Layers

- **Domain**: entities and business rules that do not depend on any framework, database driver, or transport mechanism. Pure logic, testable without mocks for anything external.
- **Use cases / application services**: orchestrate domain logic to fulfill a specific operation (for example, "enroll a student" or "reset a password"). This is where transactions, authorization checks, and coordination between multiple domain objects live.
- **Interface / HTTP layer**: controllers, route handlers, request and response models. Thin by design, see `backend.md`. Its job is translating a transport-specific request into a call to a use case, and translating the result back into a transport-specific response.
- **Infrastructure**: database access, external API clients, file storage, email or SMS senders. Implements interfaces defined by the layers above, not the other way around.

### Dependency rule

Dependencies point inward. Domain code never imports from infrastructure or the HTTP layer. Infrastructure and the HTTP layer depend on domain and use case abstractions (interfaces, ports), not the reverse. A use case that needs to send an email depends on an interface like `NotificationSender`, not directly on whichever SMTP or third-party SDK client implements it.

Example of a layer violation to avoid:

```python
# Bad: use case importing a web framework type and running raw SQL itself
from fastapi import Request

def create_order_use_case(request: Request):
    db.execute("INSERT INTO orders ...")  # SQL and framework mixed into the use case

# Good: use case depends on an abstraction, framework and database stay at the edge
def create_order_use_case(order_repo: OrderRepository, data: OrderData):
    return order_repo.save(data)
```

### Practical implications

- A change to the database schema or ORM should not require touching domain logic.
- A change to how an operation is triggered, such as adding a CLI command that does what an HTTP endpoint already does, should reuse the same use case, not duplicate its logic.
- Business rules are testable without a database, a network connection, or an HTTP server, see `testing.md`.
- Do not over-apply this: a small script or a genuinely trivial CRUD endpoint does not need four layers of indirection invented for its own sake. Apply the structure where it earns its cost.

## SOLID

- **Single responsibility**: each class, module, or function has one reason to change. If a file validates input, persists data, and runs business logic all at once, split it.
- **Open/closed**: prefer extension (new implementations, new strategies) over modifying existing, working code paths.
- **Liskov substitution**: a subclass or implementation must be substitutable for its base type without breaking a caller's expectations.
- **Interface segregation**: prefer small, specific interfaces over large ones that force unrelated methods on implementers.
- **Dependency inversion**: depend on abstractions at architectural boundaries, not concrete implementations. Inject dependencies rather than instantiating them inside business logic. This is the same principle behind the dependency rule above, applied at the class and module level rather than the layer level.

## Simplicity is part of the standard

SOLID and Clean Architecture are not a license for unnecessary abstraction. The simplest design that correctly satisfies the actual requirement is the right one. Over-engineering a small, stable problem is itself a violation of maintainability, the very thing these principles exist to protect.

Before building new feature work, state what is explicitly out of scope alongside what is being built: which modes, configuration options, extensibility points, or polish are being omitted because the current requirement does not need them. Add a mode, a config surface, or a dependency later, when something concrete needs it, not in advance of that need.

## Related

- `backend.md` for how these principles apply to service and API implementation.
- `database.md` for how the dependency rule applies to data access.
- `testing.md` for why this structure makes business logic testable in isolation.
- `review-checklist.md` for what to check when reviewing architecture in a pull request, including the SOLID and layering criteria referenced in its review priorities.
