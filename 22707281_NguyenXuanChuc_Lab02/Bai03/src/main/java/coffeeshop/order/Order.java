package coffeeshop.order;

import coffeeshop.order.drink.Drink;
import coffeeshop.order.payment.PaymentStrategy;
import coffeeshop.order.state.NewState;

import java.util.ArrayList;
import java.util.List;

public class Order {
    private List<Drink> drinks = new ArrayList<>();
    private OrderState state;
    private PaymentStrategy paymentStrategy;

    public Order() {
        this.state = new NewState(); // Trạng thái mặc định
    }

    public void addDrink(Drink drink) {
        drinks.add(drink);
    }

    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public void setState(OrderState state) {
        this.state = state;
    }

    public void process() {
        this.state.process(this);
    }

    public void deliver() {
        state.deliver(this);
    }

    public void cancel() {
        state.cancel(this);
    }

    public double calculateTotal() {
        return drinks.stream().mapToDouble(Drink::getCost).sum();
    }

    public void pay() {
        if (paymentStrategy != null) {
            paymentStrategy.pay(calculateTotal());
        } else {
            System.out.println("Chưa chọn phương thức thanh toán!");
        }
    }

    public void printOrder() {
        System.out.println("\n=== Chi tiết đơn hàng ===");
        drinks.forEach(d -> System.out.println(d.getDescription() + ": " + d.getCost() + " VNĐ"));
        System.out.println("Tổng tiền: " + calculateTotal() + " VNĐ");
    }
}