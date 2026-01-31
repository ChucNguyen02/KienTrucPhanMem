
package coffeeshop.payment.state;

import coffeeshop.payment.PaymentContext;

public interface PaymentState {
    void execute(PaymentContext context);
    void refund(PaymentContext context);
    String getStatus();
}