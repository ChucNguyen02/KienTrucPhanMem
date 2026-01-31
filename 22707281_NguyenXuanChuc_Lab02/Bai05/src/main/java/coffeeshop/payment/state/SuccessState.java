
package coffeeshop.payment.state;

import coffeeshop.payment.PaymentContext;

public class SuccessState implements PaymentState {
    @Override
    public void execute(PaymentContext context) {
        System.out.println("Thanh toán đã hoàn tất, không thể thực hiện lại!");
    }

    @Override
    public void refund(PaymentContext context) {
        System.out.println("Đang xử lý hoàn tiền...");
        context.setState(new RefundedState());
        System.out.println("Hoàn tiền thành công!");
    }

    @Override
    public String getStatus() {
        return "Thành công (Success)";
    }
}