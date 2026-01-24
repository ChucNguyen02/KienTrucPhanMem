package com.example.bai01.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MailConsumer {

    @Autowired
    private MailService mailService;

    private volatile boolean enableConsume = false;

    @Autowired
    private RabbitListenerEndpointRegistry registry;

    public void startSending() {
        registry.getListenerContainer("mailListener").start();
        System.out.println("🚀 Bắt đầu gửi mail");
    }

    @RabbitListener(
            id = "mailListener",
            queues = "${mail.queue.name}",
            autoStartup = "false"
    )
    public void receive(String email) {
        mailService.sendHelloMail(email);
    }

}