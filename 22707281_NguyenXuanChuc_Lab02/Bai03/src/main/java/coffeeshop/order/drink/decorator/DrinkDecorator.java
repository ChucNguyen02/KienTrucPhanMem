
package coffeeshop.order.drink.decorator;

import coffeeshop.order.drink.Drink;

public abstract class DrinkDecorator extends Drink {
    protected Drink drink;

    public DrinkDecorator(Drink drink) {
        this.drink = drink;
    }
}