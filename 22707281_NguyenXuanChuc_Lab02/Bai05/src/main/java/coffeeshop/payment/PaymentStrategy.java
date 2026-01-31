
package coffeeshop.payment;

public interface PaymentStrategy {
    void pay(double amount);
    String getMethodName();
}