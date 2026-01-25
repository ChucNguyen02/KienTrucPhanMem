package bai03.mapper;

import bai03.dto.request.OrderCreationRequest;
import bai03.dto.response.OrderResponse;
import bai03.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public Order toOrder(OrderCreationRequest request) {
        Order order = new Order();
        order.setProductName(request.getProductName());
        order.setQuantity(request.getQuantity());
        order.setPrice(request.getPrice());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setTotalAmount(request.getPrice().multiply(java.math.BigDecimal.valueOf(request.getQuantity())));
        return order;
    }

    public OrderResponse toOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .username(order.getUser().getUsername())
                .productName(order.getProductName())
                .quantity(order.getQuantity())
                .price(order.getPrice())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .customerEmail(order.getCustomerEmail())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
