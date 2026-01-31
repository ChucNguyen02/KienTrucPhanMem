package coffeeshop.order.state;

import coffeeshop.order.Order;
import coffeeshop.order.OrderState;

public class ProcessingState implements OrderState {
    @Override
    public void process(Order order) {
        System.out.println("Đơn hàng đã đang được xử lý, không thể xử lý lại!");
    }

    @Override
    public void deliver(Order order) {
        System.out.println("Đóng gói và vận chuyển đơn hàng...");
        order.setState(new DeliveredState());
        System.out.println("Đơn hàng đã giao thành công!");
    }

    @Override
    public void cancel(Order order) {
        System.out.println("Hủy đơn hàng đang xử lý...");
        order.setState(new CancelledState());
        System.out.println("Đơn hàng đã hủy, hoàn tiền.");
    }
}