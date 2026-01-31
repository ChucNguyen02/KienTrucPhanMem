package coffeeshop.drink.Juice;

import coffeeshop.drink.Drink;

public class AppleJuice implements Drink {
    @Override
    public void prepare() {
        System.out.println("Ép nước táo tươi, thêm chút đá");
    }

    @Override
    public double getPrice() {
        return 48000;
    }

    @Override
    public String getName() {
        return "Nước Táo Ép";
    }
}