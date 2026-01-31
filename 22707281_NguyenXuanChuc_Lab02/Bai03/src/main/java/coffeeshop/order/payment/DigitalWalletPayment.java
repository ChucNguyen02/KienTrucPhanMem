package coffeeshop.order.payment;

public class DigitalWalletPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán ví điện tử: " + amount + " VNĐ");
    }
}