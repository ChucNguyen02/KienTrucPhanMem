package coffeeshop.order.state;

import coffeeshop.order.Order;
import coffeeshop.order.OrderState;

public class DeliveredState implements OrderState {
    @Override
    public void process(Order order) {
        System.out.println("Đơn hàng đã giao, không thể xử lý lại!");
    }

    @Override
    public void deliver(Order order) {
        System.out.println("Đơn hàng đã được giao rồi!");
    }

    @Override
    public void cancel(Order order) {
        System.out.println("Không thể hủy đơn hàng đã giao!");
    }
}