
package coffeeshop.order.drink.decorator;

import coffeeshop.order.drink.Drink;

public class SugarDecorator extends DrinkDecorator {
    public SugarDecorator(Drink drink) {
        super(drink);
    }

    @Override
    public String getDescription() {
        return drink.getDescription() + " + Đường";
    }

    @Override
    public double getCost() {
        return drink.getCost() + 5000;
    }
}