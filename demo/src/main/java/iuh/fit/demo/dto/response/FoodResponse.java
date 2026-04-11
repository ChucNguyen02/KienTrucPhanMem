package iuh.fit.demo.dto.response;

import java.math.BigDecimal;

public record FoodResponse(
        String id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl
) {}