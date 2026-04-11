package iuh.fit.bai03.payment.service;

import iuh.fit.bai03.shared.event.PaymentSuccessEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventPublisher {

    private final JmsTemplate jmsTemplate;
    private final String paymentSuccessQueue;

    public PaymentEventPublisher(JmsTemplate jmsTemplate,
                                 @Value("${app.queues.payment-success}") String paymentSuccessQueue) {
        this.jmsTemplate = jmsTemplate;
        this.paymentSuccessQueue = paymentSuccessQueue;
    }

    public void publish(PaymentSuccessEvent event) {
        jmsTemplate.convertAndSend(paymentSuccessQueue, event);
    }
}

