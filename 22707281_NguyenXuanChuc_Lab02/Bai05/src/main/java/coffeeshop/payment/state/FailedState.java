
package coffeeshop.payment.state;

import coffeeshop.payment.PaymentContext;

public class FailedState implements PaymentState {
    @Override
    public void execute(PaymentContext context) {
        System.out.println("Thanh toán đã thất bại, không thể thử lại ở trạng thái này!");
    }

    @Override
    public void refund(PaymentContext context) {
        System.out.println("Không có gì để hoàn tiền khi thanh toán thất bại!");
    }

    @Override
    public String getStatus() {
        return "Thất bại (Failed)";
    }
}