package coffeeshop.service;

import coffeeshop.drink.Drink;
import coffeeshop.factory.DrinkFactory;

import java.util.ArrayList;
import java.util.List;

public class OrderService {
    private final DrinkFactory factory;
    private final List<Drink> drinks = new ArrayList<>();

    public OrderService(DrinkFactory factory) {
        this.factory = factory;
    }

    public void addDrink(String type) {
        Drink drink = factory.orderDrink(type);
        if (drink != null) {
            drinks.add(drink);
        }
    }

    public double calculateTotal() {
        return drinks.stream().mapToDouble(Drink::getPrice).sum();
    }

    public void printBill() {
        System.out.println("\n=== Hóa đơn ===");
        drinks.forEach(d -> System.out.println(d.getName() + ": " + d.getPrice() + " VNĐ"));
        System.out.println("Tổng cộng: " + calculateTotal() + " VNĐ");
    }
}