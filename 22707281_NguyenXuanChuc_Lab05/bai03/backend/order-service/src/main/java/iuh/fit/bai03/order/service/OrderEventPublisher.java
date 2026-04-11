package iuh.fit.bai03.order.service;

import iuh.fit.bai03.shared.event.OrderCreatedEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderEventPublisher {

    private final JmsTemplate jmsTemplate;
    private final String orderCreatedQueue;

    public OrderEventPublisher(JmsTemplate jmsTemplate,
                               @Value("${app.queues.order-created}") String orderCreatedQueue) {
        this.jmsTemplate = jmsTemplate;
        this.orderCreatedQueue = orderCreatedQueue;
    }

    public void publish(OrderCreatedEvent event) {
        jmsTemplate.convertAndSend(orderCreatedQueue, event);
    }
}

