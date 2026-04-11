package iuh.fit.bai03.order.service;

import iuh.fit.bai03.order.domain.OrderEntity;
import iuh.fit.bai03.order.dto.CreateOrderRequest;
import iuh.fit.bai03.order.dto.OrderResponse;
import iuh.fit.bai03.order.repository.OrderRepository;
import iuh.fit.bai03.shared.event.OrderCreatedEvent;
import iuh.fit.bai03.shared.event.OrderStatus;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventPublisher eventPublisher;

    public OrderService(OrderRepository orderRepository, OrderEventPublisher eventPublisher) {
        this.orderRepository = orderRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        OrderEntity order = new OrderEntity();
        order.setCustomerName(request.customerName());
        order.setProductName(request.productName());
        order.setAmount(request.amount());
        order.setStatus(OrderStatus.PENDING);

        OrderEntity savedOrder = orderRepository.save(order);
        eventPublisher.publish(new OrderCreatedEvent(savedOrder.getId(), savedOrder.getAmount()));

        return map(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));
        return map(order);
    }

    private OrderResponse map(OrderEntity order) {
        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getProductName(),
                order.getAmount(),
                order.getStatus(),
                order.getTrackingCode()
        );
    }
}

