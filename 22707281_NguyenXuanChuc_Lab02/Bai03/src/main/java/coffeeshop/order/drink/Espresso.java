package coffeeshop.order.drink;

public class Espresso extends Drink {
    @Override
    public String getDescription() {
        return "Espresso";
    }

    @Override
    public double getCost() {
        return 45000;
    }
}