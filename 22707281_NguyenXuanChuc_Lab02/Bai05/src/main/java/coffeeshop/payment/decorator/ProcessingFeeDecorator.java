
package coffeeshop.payment.decorator;

import coffeeshop.payment.Payment;
import coffeeshop.payment.PaymentDecorator;

public class ProcessingFeeDecorator extends PaymentDecorator {
    private final double feeRate = 0.02; // 2%

    public ProcessingFeeDecorator(Payment wrappedPayment) {
        super(wrappedPayment);
    }

    @Override
    public double getAmount() {
        return super.getAmount() + (super.getAmount() * feeRate);
    }

    @Override
    public String getDescription() {
        double fee = wrappedPayment.getAmount() * feeRate;
        return wrappedPayment.getDescription() + " + Phí xử lý 2% (" + fee + " VNĐ)";
    }
}