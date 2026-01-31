package coffeeshop.drink.Tea;

import coffeeshop.drink.Drink;

public class BlackTea implements Drink {
    @Override
    public void prepare() {
        System.out.println("Pha trà đen: lá trà đen + nước nóng + chút chanh");
    }

    @Override
    public double getPrice() {
        return 35000;
    }

    @Override
    public String getName() {
        return "Trà Đen";
    }
}