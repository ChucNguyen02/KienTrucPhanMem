package com.example.bai01.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendHelloMail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("RabbitMQ Demo");
        message.setText("Hello World");

        mailSender.send(message);
        System.out.println("✅ Đã gửi mail tới: " + to);
    }
}

