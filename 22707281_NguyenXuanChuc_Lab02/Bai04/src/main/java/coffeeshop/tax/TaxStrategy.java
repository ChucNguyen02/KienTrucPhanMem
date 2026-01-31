
package coffeeshop.tax;

public interface TaxStrategy {
    double calculateTax(double price);
    String getTaxName();
}