package iuh.fit.backend.common;

public record ApiResponse<T>(
        String message,
        T data
) {
}

