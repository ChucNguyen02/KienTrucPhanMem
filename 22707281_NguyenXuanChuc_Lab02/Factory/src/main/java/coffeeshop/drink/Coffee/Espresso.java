package coffeeshop.drink.Coffee;

import coffeeshop.drink.Drink;

public class Espresso implements Drink {
    @Override
    public void prepare() {
        System.out.println("Pha Espresso: cà phê đậm đặc");
    }

    @Override
    public double getPrice() {
        return 45000;
    }

    @Override
    public String getName() {
        return "Espresso";
    }
}