
package coffeeshop.payment.decorator;

import coffeeshop.payment.Payment;
import coffeeshop.payment.PaymentDecorator;

public class DiscountDecorator extends PaymentDecorator {
    private final double discountRate = 0.10; // 10%

    public DiscountDecorator(Payment wrappedPayment) {
        super(wrappedPayment);
    }

    @Override
    public double getAmount() {
        return super.getAmount() * (1 - discountRate);
    }

    @Override
    public String getDescription() {
        double discount = wrappedPayment.getAmount() * discountRate;
        return wrappedPayment.getDescription() + " - Giảm giá 10% (" + discount + " VNĐ)";
    }
}