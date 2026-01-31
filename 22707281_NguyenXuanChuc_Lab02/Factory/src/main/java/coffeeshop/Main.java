// src/main/java/coffeeshop/Main.java
package coffeeshop;

import coffeeshop.factory.CoffeeFactory;
import coffeeshop.factory.TeaFactory;
import coffeeshop.factory.JuiceFactory;
import coffeeshop.service.OrderService;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Đơn hàng Coffee ===");
        OrderService coffeeOrder = new OrderService(new CoffeeFactory());
        coffeeOrder.addDrink("espresso");
        coffeeOrder.addDrink("latte");
        coffeeOrder.printBill();

        System.out.println("\n=== Đơn hàng Tea ===");
        OrderService teaOrder = new OrderService(new TeaFactory());
        teaOrder.addDrink("green");
        teaOrder.addDrink("blacktea");
        teaOrder.printBill();

        System.out.println("\n=== Đơn hàng Juice ===");
        OrderService juiceOrder = new OrderService(new JuiceFactory());
        juiceOrder.addDrink("orange");
        juiceOrder.addDrink("applejuice");
        juiceOrder.printBill();


        juiceOrder.addDrink("mango");
    }
}