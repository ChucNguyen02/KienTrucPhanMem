
package coffeeshop.payment;

import coffeeshop.payment.state.PendingState;
import coffeeshop.payment.state.PaymentState;

public class PaymentContext implements Payment {  // implements Payment
    private final double baseAmount;
    private final PaymentStrategy strategy;
    private PaymentState state;
    private String description;

    public PaymentContext(double baseAmount, PaymentStrategy strategy) {
        this.baseAmount = baseAmount;
        this.strategy = strategy;
        this.state = new PendingState();
        this.description = strategy.getMethodName() + " (số tiền gốc: " + baseAmount + " VNĐ)";
    }

    // Các getter/setter như cũ...

    @Override
    public double getAmount() {
        return baseAmount;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public void execute() {
        state.execute(this);
        if ("Thành công (Success)".equals(state.getStatus())) {
            strategy.pay(getAmount());
        }
    }

    @Override
    public void refund() {
        state.refund(this);
    }

    @Override
    public String getStatus() {
        return state.getStatus();
    }

    @Override
    public void printReceipt() {
        System.out.println("\n=== BIÊN NHẬN THANH TOÁN ===");
        System.out.println(getDescription());
        System.out.println("Số tiền thanh toán: " + getAmount() + " VNĐ");
        System.out.println("Trạng thái: " + getStatus());
        System.out.println("============================\n");
    }

    // setState và các method khác giữ nguyên
    public void setState(PaymentState state) {
        this.state = state;
    }
}