
package coffeeshop.payment.state;

import coffeeshop.payment.PaymentContext;

public class RefundedState implements PaymentState {
    @Override
    public void execute(PaymentContext context) {
        System.out.println("Thanh toán đã được hoàn tiền, không thể thực hiện lại!");
    }

    @Override
    public void refund(PaymentContext context) {
        System.out.println("Đã hoàn tiền rồi!");
    }

    @Override
    public String getStatus() {
        return "Đã hoàn tiền (Refunded)";
    }
}