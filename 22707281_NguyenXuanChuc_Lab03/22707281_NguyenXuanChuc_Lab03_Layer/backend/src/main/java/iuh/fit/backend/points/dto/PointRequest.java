package iuh.fit.backend.points.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class PointRequest {

    @NotBlank(message = "Student code is required")
    private String studentCode;

    @Min(value = 1, message = "Points must be greater than 0")
    private int points;

    @NotBlank(message = "Source is required")
    private String source;

    private Long registrationId;

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
    }
}

