package bai03.service;

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

    public void sendOrderConfirmation(Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getCustomerEmail());
            message.setSubject("Order Confirmation - " + order.getOrderCode());
            message.setText(buildOrderConfirmationEmail(order));

            mailSender.send(message);
            log.info("✅ Email sent successfully to: {}", order.getCustomerEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send email to: {}", order.getCustomerEmail(), e);
            throw new RuntimeException("Failed to send confirmation email", e);
        }
    }

    private String buildOrderConfirmationEmail(Order order) {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

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
                currencyFormat.format(order.getPrice()),
                currencyFormat.format(order.getTotalAmount()),
                order.getStatus()
        );
    }
}
