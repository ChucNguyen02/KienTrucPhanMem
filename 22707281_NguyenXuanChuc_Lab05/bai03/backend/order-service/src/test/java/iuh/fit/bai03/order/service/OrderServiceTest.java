package iuh.fit.bai03.order.service;

import iuh.fit.bai03.order.domain.OrderEntity;
import iuh.fit.bai03.order.dto.CreateOrderRequest;
import iuh.fit.bai03.order.dto.OrderResponse;
import iuh.fit.bai03.order.repository.OrderRepository;
import iuh.fit.bai03.shared.event.OrderStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderEventPublisher orderEventPublisher;

    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrder_shouldSavePendingOrderAndPublishEvent() {
        CreateOrderRequest request = new CreateOrderRequest("Chuc", "Laptop", BigDecimal.valueOf(1999.99));

        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.createOrder(request);

        assertNull(response.id());
        assertEquals(OrderStatus.PENDING, response.status());
        verify(orderEventPublisher).publish(any());
    }
}
