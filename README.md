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


