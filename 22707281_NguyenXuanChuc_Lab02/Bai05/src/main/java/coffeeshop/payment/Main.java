
package coffeeshop.payment;

import coffeeshop.payment.decorator.DiscountDecorator;
import coffeeshop.payment.decorator.ProcessingFeeDecorator;

public class Main {
    public static void main(String[] args) {
        double orderAmount = 500000;

        // Thanh toán 1: Thẻ tín dụng + giảm giá + phí xử lý
        System.out.println("=== Thanh toán 1: Thẻ tín dụng (có phí + giảm giá) ===");
        Payment payment1 = new DiscountDecorator(
                new ProcessingFeeDecorator(
                        new PaymentContext(orderAmount, new CreditCardStrategy())
                )
        );
        payment1.execute();
        payment1.printReceipt();
        payment1.refund();

        // Thanh toán 2: PayPal đơn giản
        System.out.println("=== Thanh toán 2: PayPal (không bổ sung) ===");
        Payment payment2 = new PaymentContext(orderAmount, new PayPalStrategy());
        payment2.execute();
        payment2.printReceipt();

        // Thanh toán 3: Thẻ tín dụng chỉ có phí xử lý
        System.out.println("=== Thanh toán 3: Thẻ tín dụng (chỉ phí xử lý) ===");
        Payment payment3 = new ProcessingFeeDecorator(
                new PaymentContext(orderAmount, new CreditCardStrategy())
        );
        payment3.execute();
        payment3.printReceipt();
    }
}