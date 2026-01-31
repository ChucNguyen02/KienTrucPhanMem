// src/main/java/coffeeshop/payment/Payment.java
package coffeeshop.payment;

public interface Payment {
    double getAmount();
    String getDescription();
    void execute();
    void refund();
    String getStatus();
    void printReceipt();
}