package coffeeshop.order;

import coffeeshop.order.drink.Espresso;
import coffeeshop.order.drink.Latte;
import coffeeshop.order.drink.decorator.MilkDecorator;
import coffeeshop.order.drink.decorator.SugarDecorator;
import coffeeshop.order.payment.CreditCardPayment;
import coffeeshop.order.payment.DigitalWalletPayment;

public class Main {
    public static void main(String[] args) {
        Order order = new Order();

        // Decorator: thêm topping
        order.addDrink(new MilkDecorator(new Espresso()));
        order.addDrink(new SugarDecorator(new MilkDecorator(new Latte())));

        order.printOrder();

        // Strategy: chọn thanh toán
        order.setPaymentStrategy(new CreditCardPayment());

        // State: xử lý đơn hàng
        order.process();     // New -> Processing
        order.pay();         // Thanh toán
        order.deliver();     // Processing -> Delivered

        System.out.println("\n--- Thử hủy sau khi đã giao ---");
        order.cancel();      // Không cho phép

        // Demo đơn hàng khác bị hủy
        System.out.println("\n=== Đơn hàng thứ 2 (bị hủy) ===");
        Order order2 = new Order();
        order2.addDrink(new Espresso());
        order2.setPaymentStrategy(new DigitalWalletPayment());
        order2.cancel();     // Hủy ngay từ New
        order2.process();    // Không cho phép
    }
}