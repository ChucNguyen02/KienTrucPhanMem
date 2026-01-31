
package coffeeshop.tax;

public class VATStrategy implements TaxStrategy {
    private final double rate = 0.10; // 10%

    @Override
    public double calculateTax(double price) {
        return price * rate;
    }

    @Override
    public String getTaxName() {
        return "Thuế VAT 10%";
    }
}