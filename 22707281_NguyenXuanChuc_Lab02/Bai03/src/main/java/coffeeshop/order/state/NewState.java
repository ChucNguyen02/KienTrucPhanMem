package coffeeshop.order.state;

import coffeeshop.order.Order;
import coffeeshop.order.OrderState;

public class NewState implements OrderState {
    @Override
    public void process(Order order) {
        System.out.println("Kiểm tra thông tin đơn hàng... Đơn hàng hợp lệ!");
        order.setState(new ProcessingState());
        System.out.println("Đơn hàng chuyển sang trạng thái: Đang xử lý");
    }

    @Override
    public void deliver(Order order) {
        System.out.println("Không thể giao hàng khi đơn hàng còn mới!");
    }

    @Override
    public void cancel(Order order) {
        System.out.println("Hủy đơn hàng mới tạo...");
        order.setState(new CancelledState());
        System.out.println("Đơn hàng đã hủy, hoàn tiền nếu cần.");
    }
}