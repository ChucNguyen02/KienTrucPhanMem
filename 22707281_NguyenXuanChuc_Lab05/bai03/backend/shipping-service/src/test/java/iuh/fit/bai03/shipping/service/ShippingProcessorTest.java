package iuh.fit.bai03.shipping.service;

import iuh.fit.bai03.shared.event.OrderStatus;
import iuh.fit.bai03.shared.event.PaymentSuccessEvent;
import iuh.fit.bai03.shipping.domain.OrderEntity;
import iuh.fit.bai03.shipping.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShippingProcessorTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private ShippingProcessor shippingProcessor;

    @Test
    void processPaymentSuccess_shouldSetShippingStateAndTrackingCode() {
        OrderEntity order = new OrderEntity();
        order.setStatus(OrderStatus.PAID);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        shippingProcessor.processPaymentSuccess(new PaymentSuccessEvent(1L));

        assertNotNull(order.getTrackingCode());
        verify(orderRepository).save(any(OrderEntity.class));
    }

    @Test
    void processPaymentSuccess_shouldSkipIfAlreadyShipping() {
        OrderEntity order = new OrderEntity();
        order.setStatus(OrderStatus.SHIPPING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        shippingProcessor.processPaymentSuccess(new PaymentSuccessEvent(1L));

        verify(orderRepository, never()).save(any(OrderEntity.class));
    }
}

