package iuh.fit.bai03.payment.service;

import iuh.fit.bai03.payment.domain.OrderEntity;
import iuh.fit.bai03.payment.repository.OrderRepository;
import iuh.fit.bai03.payment.repository.PaymentTransactionRepository;
import iuh.fit.bai03.shared.event.OrderCreatedEvent;
import iuh.fit.bai03.shared.event.OrderStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentProcessorTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentTransactionRepository paymentTransactionRepository;

    @Mock
    private PaymentEventPublisher paymentEventPublisher;

    @InjectMocks
    private PaymentProcessor paymentProcessor;

    @Test
    void processOrderCreated_shouldUpdateOrderAndPublishPaymentEvent() {
        OrderCreatedEvent event = new OrderCreatedEvent(1L, BigDecimal.valueOf(100));
        OrderEntity order = new OrderEntity();
        order.setStatus(OrderStatus.PENDING);

        when(paymentTransactionRepository.existsByOrderId(1L)).thenReturn(false);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        paymentProcessor.processOrderCreated(event);

        verify(paymentTransactionRepository).save(any());
        verify(orderRepository).save(any(OrderEntity.class));
        verify(paymentEventPublisher).publish(any());
    }

    @Test
    void processOrderCreated_shouldSkipWhenAlreadyProcessed() {
        OrderCreatedEvent event = new OrderCreatedEvent(1L, BigDecimal.valueOf(100));
        when(paymentTransactionRepository.existsByOrderId(1L)).thenReturn(true);

        paymentProcessor.processOrderCreated(event);

        verify(orderRepository, never()).findById(any());
        verify(paymentEventPublisher, never()).publish(any());
    }
}

