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




Bonnes pratiques – Gestion des exceptions SwapExException
🎯 Objectif

Standardiser la gestion des erreurs dans nos services Java pour :

    Centraliser les codes d’erreur

    Garantir une traçabilité cohérente

    Simplifier l’exploitation et le traitement côté client

    Fournir une base propre pour les messages d’erreur personnalisés

✅ 1. Centraliser les erreurs dans une enum dédiée

Créer une énumération BusinessErrorMessage qui contient :

    Un code d’erreur unique

    Un message d’erreur lisible

    Un code HTTP standardisé



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


Avantages :

    Code d’erreur unique facilement traçable (ERR_SWA_001, etc.)

    Réutilisation dans tous les services sans duplication

    Support des messages paramétrables via String.format

✅ 2. Créer une exception métier personnalisée : SwapExException

Cette classe permet d'encapsuler un message, un code et un statut HTTP dans une exception métier claire.

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

vantages :

    Simplifie le lien entre l'erreur levée et l’enum

    Permet un mapping propre vers une réponse HTTP (dans un @ControllerAdvice par exemple)

    Message d’erreur uniformisé dans les logs et réponses JSON

🔄 Exemple d'utilisation dans un service

public User getUser(String id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new SwapExException(BusinessErrorMessage.USER_NOT_FOUND));
}


Un @RestControllerAdvice global

Une structure standardisée de réponse JSON en cas d’erreur

Quelques bonnes pratiques supplémentaires liées au logging, fallback, etc.

Gérer les exceptions globalement avec @RestControllerAdvice

Créer un gestionnaire global pour capturer les exceptions SwapExException et retourner une réponse HTTP propre et lisible par le front.

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
Définir une réponse d’erreur standard (ErrorResponse)

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private String errorCode;
    private String message;
    private int httpStatus;
    private LocalDateTime timestamp;
}

{
  "errorCode": "ERR_SWA_001",
  "message": "User Not Found",
  "httpStatus": 404,
  "timestamp": "2025-08-07T15:24:10.205"
}

