package coffeeshop.drink.Coffee;

import coffeeshop.drink.Drink;

public class Latte implements Drink {
    @Override
    public void prepare() {
        System.out.println("Pha Latte: cà phê + sữa nóng + bọt sữa");
    }

    @Override
    public double getPrice() {
        return 55000;
    }

    @Override
    public String getName() {
        return "Latte";
    }
}