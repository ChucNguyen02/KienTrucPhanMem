package com.example.bai01.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MailProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${mail.queue.name}")
    private String queueName;

    public void pushMail(String email) {
        rabbitTemplate.convertAndSend(queueName, email);
        System.out.println("📩 Đã đưa vào MQ: " + email);
    }
}

