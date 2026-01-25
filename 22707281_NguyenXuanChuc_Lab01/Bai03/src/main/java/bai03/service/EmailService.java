package bai03.service;

import bai03.dto.EmailMessage;
import bai03.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailProducer emailProducer;

    public void sendOrderConfirmationSync(Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getCustomerEmail());
            message.setSubject("Order Confirmation - " + order.getOrderCode());
            message.setText(buildOrderConfirmationEmail(order));

            mailSender.send(message);
            log.info("✅ [SYNC] Email sent successfully to: {}", order.getCustomerEmail());
        } catch (Exception e) {
            log.error("❌ [SYNC] Failed to send email to: {}", order.getCustomerEmail(), e);
            throw new RuntimeException("Failed to send confirmation email", e);
        }
    }

    // ✅ Gửi email BẤT ĐỒNG BỘ (Asynchronous) qua RabbitMQ
    public void sendOrderConfirmationAsync(Order order) {
        EmailMessage emailMessage = EmailMessage.builder()
                .orderId(order.getId())
                .orderCode(order.getOrderCode())
                .customerEmail(order.getCustomerEmail())
                .username(order.getUser().getUsername())
                .productName(order.getProductName())
                .quantity(order.getQuantity())
                .price(formatCurrency(order.getPrice()))
                .totalAmount(formatCurrency(order.getTotalAmount()))
                .status(order.getStatus().toString())
                .build();

        emailProducer.sendEmailMessage(emailMessage);
        log.info("📨 [ASYNC] Email message queued for: {}", order.getCustomerEmail());
    }

    private String buildOrderConfirmationEmail(Order order) {
        return String.format("""
                Dear %s,
                
                Thank you for your order!
                
                Order Details:
                ──────────────────────────────────
                Order Code: %s
                Product: %s
                Quantity: %d
                Unit Price: %s
                Total Amount: %s
                Status: %s
                ──────────────────────────────────
                
                Your order has been received and is being processed.
                You will receive another email when your order is shipped.
                
                Thank you for shopping with us!
                
                Best regards,
                The Shop Team
                """,
                order.getUser().getUsername(),
                order.getOrderCode(),
                order.getProductName(),
                order.getQuantity(),
                formatCurrency(order.getPrice()),
                formatCurrency(order.getTotalAmount()),
                order.getStatus()
        );
    }

    private String formatCurrency(java.math.BigDecimal amount) {
        NumberFormat currencyFormat = NumberFormat.getNumberInstance(new Locale("vi", "VN"));
        return currencyFormat.format(amount);
    }
}