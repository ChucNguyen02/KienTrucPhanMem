
package coffeeshop.order.drink.decorator;

import coffeeshop.order.drink.Drink;

public class MilkDecorator extends DrinkDecorator {
    public MilkDecorator(Drink drink) {
        super(drink);
    }

    @Override
    public String getDescription() {
        return drink.getDescription() + " + Sữa";
    }

    @Override
    public double getCost() {
        return drink.getCost() + 10000;
    }
}