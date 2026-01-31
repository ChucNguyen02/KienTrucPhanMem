package coffeeshop.drink.Juice;

import coffeeshop.drink.Drink;

public class OrangeJuice implements Drink {
    @Override
    public void prepare() {
        System.out.println("Ép nước cam tươi nguyên chất");
    }

    @Override
    public double getPrice() {
        return 50000;
    }

    @Override
    public String getName() {
        return "Nước Cam Ép";
    }
}