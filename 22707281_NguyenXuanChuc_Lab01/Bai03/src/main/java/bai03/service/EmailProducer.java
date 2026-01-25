package bai03.service;

import bai03.dto.EmailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailProducer {

    private final RabbitTemplate rabbitTemplate;

    @Value("${order.email.exchange.name}")
    private String exchangeName;

    @Value("${order.email.routing.key}")
    private String routingKey;

    public void sendEmailMessage(EmailMessage emailMessage) {
        log.info("📨 Sending email message to queue: {}", emailMessage.getOrderCode());
        rabbitTemplate.convertAndSend(exchangeName, routingKey, emailMessage);
        log.info("✅ Email message sent to queue successfully");
    }
}
