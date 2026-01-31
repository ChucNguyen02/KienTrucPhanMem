
package coffeeshop.tax.state;

import coffeeshop.tax.*;

public class SpecialConsumptionTaxState implements ProductTaxState {
    @Override
    public PricedItem applyTaxes(BaseProduct baseProduct) {
        // Áp VAT trước, sau đó áp thuế tiêu thụ đặc biệt lên giá đã có VAT
        PricedItem withVAT = new TaxDecorator(baseProduct, new VATStrategy());
        return new TaxDecorator(withVAT, new SpecialConsumptionStrategy());
    }
}