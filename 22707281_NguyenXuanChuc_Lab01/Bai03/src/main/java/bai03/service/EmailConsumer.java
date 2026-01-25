package bai03.service;

import bai03.dto.EmailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @RabbitListener(queues = "${order.email.queue.name}")
    public void receiveEmailMessage(EmailMessage emailMessage) {
        log.info("📬 Received email message from queue: {}", emailMessage.getOrderCode());

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailMessage.getCustomerEmail());
            message.setSubject("Order Confirmation - " + emailMessage.getOrderCode());
            message.setText(buildOrderConfirmationEmail(emailMessage));

            mailSender.send(message);
            log.info("✅ Email sent successfully to: {}", emailMessage.getCustomerEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send email to: {}", emailMessage.getCustomerEmail(), e);
            // TODO: Implement retry mechanism or DLQ (Dead Letter Queue)
        }
    }

    private String buildOrderConfirmationEmail(EmailMessage emailMessage) {
        return String.format("""
                Dear %s,
                
                Thank you for your order!
                
                Order Details:
                ──────────────────────────────────
                Order Code: %s
                Product: %s
                Quantity: %d
                Unit Price: %s VND
                Total Amount: %s VND
                Status: %s
                ──────────────────────────────────
                
                Your order has been received and is being processed.
                You will receive another email when your order is shipped.
                
                Thank you for shopping with us!
                
                Best regards,
                The Shop Team
                """,
                emailMessage.getUsername(),
                emailMessage.getOrderCode(),
                emailMessage.getProductName(),
                emailMessage.getQuantity(),
                emailMessage.getPrice(),
                emailMessage.getTotalAmount(),
                emailMessage.getStatus()
        );
    }
}
