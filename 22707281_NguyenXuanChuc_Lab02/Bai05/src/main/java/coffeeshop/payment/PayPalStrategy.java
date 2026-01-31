
package coffeeshop.payment;

public class PayPalStrategy implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán bằng PayPal: " + amount + " VNĐ");
    }

    @Override
    public String getMethodName() {
        return "PayPal";
    }
}