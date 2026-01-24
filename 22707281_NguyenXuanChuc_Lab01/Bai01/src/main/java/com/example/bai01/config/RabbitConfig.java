package com.example.bai01.config;

import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Value("${mail.queue.name}")
    private String queueName;

    @Bean
    public Queue mailQueue() {
        return new Queue(queueName, true);
    }
}
