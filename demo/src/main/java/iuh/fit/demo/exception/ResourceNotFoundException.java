package iuh.fit.demo.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Constructor có thể thêm nguyên nhân (cause) nếu cần sau này
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
