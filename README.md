# EqcProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

#############################################################

Best Practices – Exception Handling with SwapExException

🎯 Objective
Standardize error handling in our Java services in order to:

    Centralize error codes

    Ensure consistent traceability

    Simplify client-side processing

    Provide a clean foundation for custom error messages

✅ 1. Centralize errors in a dedicated enum

Create an enumeration BusinessErrorMessage containing:

    A unique error code

    A human-readable error message

    A standardized HTTP status code

    @AllArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum BusinessErrorMessage {
    USER_NOT_FOUND("ERR_SWA_001", "User Not Found", HttpStatus.SC_NOT_FOUND),
    ITEM_NOT_FOUND("ERR_SWA_002", "Item Not Found", HttpStatus.SC_NOT_FOUND);

    String code;
    String message;
    int httpCode;

    public String getMessage(String... args) {
        return String.format(message, (Object[]) args);
    }
}


Benefits:

    Easily traceable unique error codes (ERR_SWA_001, etc.)

    Reusable across services without duplication

    Supports parameterized messages via String.format

2. Create a custom business exception: SwapExException

This class allows you to encapsulate a message, an error code, and an HTTP status in a clear business exception.

@Data
@EqualsAndHashCode(callSuper = true)
public class SwapExException extends RuntimeException {

    private String errorID;
    private int httpStatus;
    private String message;

    public SwapExException(String errorID, String message, int httpStatus) {
        super(message);
        this.errorID = errorID;
        this.httpStatus = httpStatus;
        this.message = message;
    }

    public SwapExException(BusinessErrorMessage beMessage) {
        this(beMessage.getCode(), beMessage.getMessage(), beMessage.getHttpCode());
    }
}

Advantages:

    Simplifies the link between the thrown error and the enum

    Allows clean mapping to an HTTP response (e.g. via @ControllerAdvice)

    Provides uniform error messages in logs and JSON responses

Example usage in a service


public User getUser(String id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new SwapExException(BusinessErrorMessage.USER_NOT_FOUND));
}


Global exception handling with @RestControllerAdvice

Create a global handler to catch SwapExException and return a clean, frontend-readable HTTP response.

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SwapExException.class)
    public ResponseEntity<ErrorResponse> handleSwapExException(SwapExException ex) {
        ErrorResponse error = new ErrorResponse(
            ex.getErrorID(),
            ex.getMessage(),
            ex.getHttpStatus(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(ex.getHttpStatus()).body(error);
    }
}

✅ Define a standardized error response (ErrorResponse)

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private String errorCode;
    private String message;
    private int httpStatus;
    private LocalDateTime timestamp;
}

Sample JSON response:

{
  "errorCode": "ERR_SWA_001",
  "message": "User Not Found",
  "httpStatus": 404,
  "timestamp": "2025-08-07T15:24:10.205"
}


    

✅ Best Practices – Constructor Injection with Lombok in Spring Boot

Why Constructor Injection?

    Immutability: Dependencies are final and cannot be reassigned.

    Testability: Easy to test with mock objects.

    Null Safety: Ensures all required dependencies are set at creation time.

    No magic: No reliance on field injection or reflection.


✅ Recommended Lombok Setup

Use the following combination:

@Service
@RequiredArgsConstructor
public class MyService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    // Lombok auto-generates a constructor like:
    // public MyService(UserRepository userRepository, EmailService emailService)
}


| Annotation                                        | Description                                                   |
| ------------------------------------------------- | ------------------------------------------------------------- |
| `@RequiredArgsConstructor`                        | Generates a constructor for all `final` and `@NonNull` fields |
| `@Service`, `@Component`, `@RestController`, etc. | Standard Spring annotations for injection                     |
| `@NonNull` (optional)                             | Triggers null checks in the generated constructor             |


Best Practices

    Always inject via final fields to enforce immutability:

private final SomeDependency dependency;


Avoid @Autowired on fields — prefer Lombok with constructor injection.

Don’t mix @RequiredArgsConstructor with @AllArgsConstructor unnecessarily
Use @AllArgsConstructor only if you have non-final fields that also need injection (rare and discouraged for services).

Use @NonNull for additional safety (optional):

private final @NonNull EmailService emailService;


Do not initialize injected fields manually:

// ❌ Bad
private final EmailService emailService = new EmailServiceImpl();


Example: Good Practice

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentGateway paymentGateway;

    public void processOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        paymentGateway.charge(order);
    }
}


 Anti-pattern: Field Injection

 // ❌ Avoid this
@Service
public class BadService {

    @Autowired
    private UserService userService;
}


Best Practice – Mutating Fields in DDD (Without Using Setters in Services)
🎯 Objective:

    Keep domain logic inside the domain model (aggregate root or entity)

    Ensure invariants are respected

    Prevent anemic domain models

    Avoid exposing internal state via setXXX() from services


    ❌ Anti-pattern (What to Avoid)

Setting fields directly from the service:

public void activateUser(User user) {
    user.setStatus(UserStatus.ACTIVE); // ❌ not ideal in DDD
}


This turns your entity into a data bag and the service into a procedural controller, which breaks the DDD principles.

✅ Recommended DDD Approach

Let the domain model manage its own state via meaningful methods:

public class User {

    private final UUID id;
    private String email;
    private UserStatus status;

    public User(UUID id, String email) {
        this.id = id;
        this.email = email;
        this.status = UserStatus.PENDING;
    }

    public void activate() {
        if (this.status == UserStatus.ACTIVE) {
            throw new IllegalStateException("User is already active.");
        }
        this.status = UserStatus.ACTIVE;
    }

    // Getters only, no setters
}

Then in your service layer:

public void activateUser(UUID userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));

    user.activate(); // ✅ Domain logic encapsulated

    userRepository.save(user);
}


| Benefit                              | Description                                                   |
| ------------------------------------ | ------------------------------------------------------------- |
| ✅ Encapsulation                      | Only the entity knows how to modify itself safely             |
| ✅ Business logic lives in the domain | Service becomes coordination layer, not business logic holder |
| ✅ Testability                        | Domain logic is unit-testable without Spring context          |
| ✅ Respect of invariants              | Impossible to bypass validation or inconsistent state         |


| What you want to do  | Name the method like                               |
| -------------------- | -------------------------------------------------- |
| Change status        | `activate()`, `cancel()`, `complete()`             |
| Update a field       | `changeEmail(String newEmail)`                     |
| Add/remove something | `addItem(OrderItem item)`, `removeLine(LineId id)` |


🛑 Avoid

    public void setStatus(UserStatus status)

    public void setEmail(String email)

    Making domain objects dumb data holders







    &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    <dependency>
  <groupId>com.flipkart.zjsonpatch</groupId>
  <artifactId>zjsonpatch</artifactId>
  <version>0.4.14</version>
</dependency>


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flipkart.zjsonpatch.JsonDiff;

public class JsonDiffExample {
    public static void main(String[] args) throws Exception {
        String expectedJson = """
        {
          "id": 1,
          "name": "Lampe A",
          "price": 9.9,
          "available": true
        }
        """;

        String actualJson = """
        {
          "id": 1,
          "name": "Lampe B",
          "price": 19.99,
          "available": false
        }
        """;

        ObjectMapper mapper = new ObjectMapper();
        JsonNode expected = mapper.readTree(expectedJson);
        JsonNode actual = mapper.readTree(actualJson);

        // 🔹 Calcule le diff
        JsonNode diff = JsonDiff.asJson(expected, actual);

        // 🔹 Parcourt le diff et affiche les différences
        diff.forEach(change -> {
            String op = change.get("op").asText();   // ex: "replace"
            String path = change.get("path").asText(); // ex: "/name"

            // Supprimer le "/" initial
            String field = path.startsWith("/") ? path.substring(1) : path;

            if ("replace".equals(op)) {
                JsonNode oldValue = expected.at(path);
                JsonNode newValue = actual.at(path);
                System.out.printf("Champ modifié: %s | Avant: %s | Après: %s%n",
                        field, oldValue, newValue);
            }
        });
    }
}

