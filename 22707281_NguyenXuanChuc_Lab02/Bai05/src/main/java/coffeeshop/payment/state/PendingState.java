
package coffeeshop.payment.state;

import coffeeshop.payment.PaymentContext;

public class PendingState implements PaymentState {
    @Override
    public void execute(PaymentContext context) {
        System.out.println("Đang xử lý thanh toán...");
        // Giả lập thành công
        context.setState(new SuccessState());
        System.out.println("Thanh toán thành công!");
    }

    @Override
    public void refund(PaymentContext context) {
        System.out.println("Không thể hoàn tiền khi thanh toán chưa thực hiện!");
    }

    @Override
    public String getStatus() {
        return "Đang chờ xử lý (Pending)";
    }
}