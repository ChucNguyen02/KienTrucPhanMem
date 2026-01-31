
package coffeeshop.tax.state;

import coffeeshop.tax.*;

public class LuxuryTaxState implements ProductTaxState {
    @Override
    public PricedItem applyTaxes(BaseProduct baseProduct) {
        PricedItem withVAT = new TaxDecorator(baseProduct, new VATStrategy());
        return new TaxDecorator(withVAT, new LuxuryTaxStrategy());
    }
}