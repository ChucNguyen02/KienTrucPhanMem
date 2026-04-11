package iuh.fit.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record FoodRequest(
        @NotBlank(message = "Tên món ăn không được để trống")
        String name,

        String description,

        @NotNull(message = "Giá không được để trống")
        @Positive(message = "Giá phải lớn hơn 0")
        BigDecimal price,

        String imageUrl
) {}