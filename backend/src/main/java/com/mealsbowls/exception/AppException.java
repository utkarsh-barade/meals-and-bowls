package com.mealsbowls.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

/**
 * Application-level exception that carries an HTTP status code.
 */
@Getter
public class AppException extends RuntimeException {

    private final HttpStatus status;

    public AppException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public AppException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }
}
