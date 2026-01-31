package coffeeshop.factory;

import coffeeshop.drink.Drink;
import coffeeshop.drink.Juice.OrangeJuice;
import coffeeshop.drink.Juice.AppleJuice;

public class JuiceFactory extends DrinkFactory {
    @Override
    public Drink createDrink(String type) {
        return switch (type.toLowerCase()) {
            case "orange", "orangejuice" -> new OrangeJuice();
            case "apple", "applejuice" -> new AppleJuice();
            default -> {
                System.out.println("Không có loại nước ép: " + type);
                yield null;
            }
        };
    }
}