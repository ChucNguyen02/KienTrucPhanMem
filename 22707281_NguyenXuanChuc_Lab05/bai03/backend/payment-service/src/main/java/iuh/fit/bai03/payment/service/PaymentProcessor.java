package iuh.fit.bai03.payment.service;

import iuh.fit.bai03.payment.domain.OrderEntity;
import iuh.fit.bai03.payment.domain.PaymentTransaction;
import iuh.fit.bai03.payment.repository.OrderRepository;
import iuh.fit.bai03.payment.repository.PaymentTransactionRepository;
import iuh.fit.bai03.shared.event.OrderCreatedEvent;
import iuh.fit.bai03.shared.event.OrderStatus;
import iuh.fit.bai03.shared.event.PaymentSuccessEvent;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentProcessor {

    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentEventPublisher paymentEventPublisher;

    public PaymentProcessor(OrderRepository orderRepository,
                            PaymentTransactionRepository paymentTransactionRepository,
                            PaymentEventPublisher paymentEventPublisher) {
        this.orderRepository = orderRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.paymentEventPublisher = paymentEventPublisher;
    }

    @Transactional
    @JmsListener(destination = "${app.queues.order-created}")
    public void processOrderCreated(OrderCreatedEvent event) {
        if (paymentTransactionRepository.existsByOrderId(event.orderId())) {
            return;
        }

        OrderEntity order = orderRepository.findById(event.orderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + event.orderId()));

        if (order.getStatus() != OrderStatus.PENDING) {
            return;
        }

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setOrderId(order.getId());
        transaction.setAmount(order.getAmount());
        paymentTransactionRepository.save(transaction);

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        paymentEventPublisher.publish(new PaymentSuccessEvent(order.getId()));
    }
}

