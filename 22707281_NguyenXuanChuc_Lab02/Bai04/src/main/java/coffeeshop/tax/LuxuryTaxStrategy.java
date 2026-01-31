
package coffeeshop.tax;

public class LuxuryTaxStrategy implements TaxStrategy {
    private final double rate = 0.20; // 20%

    @Override
    public double calculateTax(double price) {
        return price * rate;
    }

    @Override
    public String getTaxName() {
        return "Thuế hàng xa xỉ 20%";
    }
}