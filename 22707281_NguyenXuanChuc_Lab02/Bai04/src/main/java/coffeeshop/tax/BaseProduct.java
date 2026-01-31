
package coffeeshop.tax;

public class BaseProduct implements PricedItem {
    private final String name;
    private final double basePrice;

    public BaseProduct(String name, double basePrice) {
        this.name = name;
        this.basePrice = basePrice;
    }

    @Override
    public double getPrice() {
        return basePrice;
    }

    @Override
    public String getDescription() {
        return name + " (giá gốc: " + basePrice + " VNĐ)";
    }

    public String getName() {
        return name;
    }

    public double getBasePrice() {
        return basePrice;
    }
}