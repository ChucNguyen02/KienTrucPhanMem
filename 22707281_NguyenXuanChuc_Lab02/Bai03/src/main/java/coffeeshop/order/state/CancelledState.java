package coffeeshop.order.state;

import coffeeshop.order.Order;
import coffeeshop.order.OrderState;

public class CancelledState implements OrderState {
    @Override
    public void process(Order order) {
        System.out.println("Đơn hàng đã hủy, không thể xử lý!");
    }

    @Override
    public void deliver(Order order) {
        System.out.println("Đơn hàng đã hủy, không thể giao!");
    }

    @Override
    public void cancel(Order order) {
        System.out.println("Đơn hàng đã hủy rồi!");
    }
}