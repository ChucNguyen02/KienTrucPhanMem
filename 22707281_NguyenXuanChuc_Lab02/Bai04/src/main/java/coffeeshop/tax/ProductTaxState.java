
package coffeeshop.tax;

public interface ProductTaxState {
    PricedItem applyTaxes(BaseProduct baseProduct);
}