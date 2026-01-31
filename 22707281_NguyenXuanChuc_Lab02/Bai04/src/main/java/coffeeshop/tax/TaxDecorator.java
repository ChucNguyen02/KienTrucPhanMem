
package coffeeshop.tax;

public class TaxDecorator implements PricedItem {
    protected final PricedItem wrappedItem;
    protected final TaxStrategy taxStrategy;

    public TaxDecorator(PricedItem wrappedItem, TaxStrategy taxStrategy) {
        this.wrappedItem = wrappedItem;
        this.taxStrategy = taxStrategy;
    }

    @Override
    public double getPrice() {
        // Thuế tính trên giá đã có thuế trước đó (chồng lên)
        double previousPrice = wrappedItem.getPrice();
        return previousPrice + taxStrategy.calculateTax(previousPrice);
    }

    @Override
    public String getDescription() {
        return wrappedItem.getDescription() + " + " + taxStrategy.getTaxName() +
                " (" + taxStrategy.calculateTax(wrappedItem.getPrice()) + " VNĐ)";
    }
}