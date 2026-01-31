package coffeeshop.factory;

import coffeeshop.drink.Drink;

public abstract class DrinkFactory {
    public abstract Drink createDrink(String type);

    public Drink orderDrink(String type) {
        Drink drink = createDrink(type);
        if (drink != null) {
            drink.prepare();
        }
        return drink;
    }
}