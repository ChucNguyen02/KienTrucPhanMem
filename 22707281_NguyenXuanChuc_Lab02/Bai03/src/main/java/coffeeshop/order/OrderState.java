package coffeeshop.order;

public interface OrderState {
    void process(Order order);
    void deliver(Order order);
    void cancel(Order order);
}