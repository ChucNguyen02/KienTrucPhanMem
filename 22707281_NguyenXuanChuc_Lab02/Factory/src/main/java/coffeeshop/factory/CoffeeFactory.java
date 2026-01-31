package coffeeshop.factory;

import coffeeshop.drink.Drink;
import coffeeshop.drink.Coffee.Espresso;
import coffeeshop.drink.Coffee.Latte;

public class CoffeeFactory extends DrinkFactory {
    @Override
    public Drink createDrink(String type) {
        return switch (type.toLowerCase()) {
            case "espresso" -> new Espresso();
            case "latte" -> new Latte();
            default -> {
                System.out.println("Không có loại coffee: " + type);
                yield null;
            }
        };
    }
}