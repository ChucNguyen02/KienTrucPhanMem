package coffeeshop.order.payment;

public class CashPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán tiền mặt: " + amount + " VNĐ");
    }
}