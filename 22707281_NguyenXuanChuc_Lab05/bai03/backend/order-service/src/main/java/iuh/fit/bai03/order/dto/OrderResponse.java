package iuh.fit.bai03.order.dto;

import iuh.fit.bai03.shared.event.OrderStatus;

import java.math.BigDecimal;

public record OrderResponse(
        Long id,
        String customerName,
        String productName,
        BigDecimal amount,
        OrderStatus status,
        String trackingCode
) {
}

