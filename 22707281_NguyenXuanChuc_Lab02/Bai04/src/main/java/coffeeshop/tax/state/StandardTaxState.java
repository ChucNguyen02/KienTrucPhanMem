
package coffeeshop.tax.state;

import coffeeshop.tax.*;

public class StandardTaxState implements ProductTaxState {
    @Override
    public PricedItem applyTaxes(BaseProduct baseProduct) {
        return new TaxDecorator(baseProduct, new VATStrategy());
    }
}