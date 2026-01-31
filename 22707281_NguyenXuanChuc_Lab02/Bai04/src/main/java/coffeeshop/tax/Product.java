
package coffeeshop.tax;

import coffeeshop.tax.state.*;

public class Product {
    private final BaseProduct baseProduct;
    private ProductTaxState taxState;

    public Product(String name, double basePrice, ProductTaxState initialState) {
        this.baseProduct = new BaseProduct(name, basePrice);
        this.taxState = initialState;
    }

    public void setTaxState(ProductTaxState taxState) {
        this.taxState = taxState;
    }

    public PricedItem getTaxedItem() {
        return taxState.applyTaxes(baseProduct);
    }

    public void printInvoice() {
        PricedItem taxed = getTaxedItem();
        System.out.println("=== Hóa đơn sản phẩm: " + baseProduct.getName() + " ===");
        System.out.println(taxed.getDescription());
        System.out.println("Giá cuối cùng (sau thuế): " + taxed.getPrice() + " VNĐ");
        System.out.println("========================================\n");
    }
}