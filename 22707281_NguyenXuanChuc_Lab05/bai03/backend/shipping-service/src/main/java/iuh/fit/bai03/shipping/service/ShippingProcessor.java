package iuh.fit.bai03.shipping.service;

import iuh.fit.bai03.shared.event.OrderStatus;
import iuh.fit.bai03.shared.event.PaymentSuccessEvent;
import iuh.fit.bai03.shipping.domain.OrderEntity;
import iuh.fit.bai03.shipping.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ShippingProcessor {

    private final OrderRepository orderRepository;

    public ShippingProcessor(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    @JmsListener(destination = "${app.queues.payment-success}")
    public void processPaymentSuccess(PaymentSuccessEvent event) {
        OrderEntity order = orderRepository.findById(event.orderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + event.orderId()));

        if (order.getStatus() == OrderStatus.SHIPPING || order.getStatus() == OrderStatus.DELIVERED) {
            return;
        }

        order.setStatus(OrderStatus.SHIPPING);
        order.setTrackingCode(generateTrackingCode(order.getId()));
        orderRepository.save(order);
    }

    private String generateTrackingCode(Long orderId) {
        return "TRK-" + orderId + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}

