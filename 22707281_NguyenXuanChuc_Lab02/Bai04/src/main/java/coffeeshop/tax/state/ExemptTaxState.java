
package coffeeshop.tax.state;

import coffeeshop.tax.*;

public class ExemptTaxState implements ProductTaxState {
    @Override
    public PricedItem applyTaxes(BaseProduct baseProduct) {
        return new TaxDecorator(baseProduct, new NoTaxStrategy());
    }
}