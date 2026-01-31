package coffeeshop.drink.Tea;

import coffeeshop.drink.Drink;

public class GreenTea implements Drink {
    @Override
    public void prepare() {
        System.out.println("Pha trà xanh: lá trà xanh tươi + nước nóng");
    }

    @Override
    public double getPrice() {
        return 40000;
    }

    @Override
    public String getName() {
        return "Trà Xanh";
    }
}