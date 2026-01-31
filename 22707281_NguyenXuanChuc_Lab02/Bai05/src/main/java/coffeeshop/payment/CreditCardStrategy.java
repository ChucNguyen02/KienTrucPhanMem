
package coffeeshop.payment;

public class CreditCardStrategy implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán bằng Thẻ tín dụng: " + amount + " VNĐ");
    }

    @Override
    public String getMethodName() {
        return "Thẻ tín dụng";
    }
}