package iuh.fit.bai03.order.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateOrderRequest(
        @NotBlank String customerName,
        @NotBlank String productName,
        @NotNull @DecimalMin("0.01") BigDecimal amount
) {
}

