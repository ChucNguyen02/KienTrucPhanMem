package bai03.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${order.email.queue.name}")
    private String queueName;

    @Value("${order.email.exchange.name}")
    private String exchangeName;

    @Value("${order.email.routing.key}")
    private String routingKey;

    @Bean
    public Queue orderEmailQueue() {
        return new Queue(queueName, true); // durable = true
    }

    @Bean
    public TopicExchange orderEmailExchange() {
        return new TopicExchange(exchangeName);
    }

    @Bean
    public Binding binding(Queue orderEmailQueue, TopicExchange orderEmailExchange) {
        return BindingBuilder
                .bind(orderEmailQueue)
                .to(orderEmailExchange)
                .with(routingKey);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
