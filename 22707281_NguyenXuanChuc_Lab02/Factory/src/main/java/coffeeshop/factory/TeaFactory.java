package coffeeshop.factory;

import coffeeshop.drink.Drink;
import coffeeshop.drink.Tea.GreenTea;
import coffeeshop.drink.Tea.BlackTea;

public class TeaFactory extends DrinkFactory {
    @Override
    public Drink createDrink(String type) {
        return switch (type.toLowerCase()) {
            case "green", "greentea" -> new GreenTea();
            case "black", "blacktea" -> new BlackTea();
            default -> {
                System.out.println("Không có loại trà: " + type);
                yield null;
            }
        };
    }
}