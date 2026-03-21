package iuh.fit.backend.points.dto;

import iuh.fit.backend.points.entity.PointTransactionType;

import java.time.LocalDateTime;

public record PointTransactionResponse(
        Long id,
        String studentCode,
        int points,
        PointTransactionType type,
        String source,
        Long registrationId,
        LocalDateTime createdAt
) {
}

