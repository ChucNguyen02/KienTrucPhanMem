
package coffeeshop.tax;

public class SpecialConsumptionStrategy implements TaxStrategy {
    private final double rate = 0.50; // 50% (giả định cho rượu)

    @Override
    public double calculateTax(double price) {
        return price * rate;
    }

    @Override
    public String getTaxName() {
        return "Thuế tiêu thụ đặc biệt 50%";
    }
}