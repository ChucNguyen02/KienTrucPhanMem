package coffeeshop.tax;

import coffeeshop.tax.state.*;

public class Main {
    public static void main(String[] args) {
        // Sản phẩm thông thường (cà phê)
        Product coffee = new Product("Cà phê sữa đá", 35000, new StandardTaxState());
        coffee.printInvoice();

        // Sản phẩm chịu thuế tiêu thụ đặc biệt (rượu)
        Product wine = new Product("Rượu vang đỏ", 500000, new SpecialConsumptionTaxState());
        wine.printInvoice();

        // Sản phẩm xa xỉ (đồng hồ cao cấp)
        Product watch = new Product("Đồng hồ Rolex", 500000000, new LuxuryTaxState());
        watch.printInvoice();

        // Sản phẩm miễn thuế (sách giáo khoa)
        Product book = new Product("Sách giáo khoa", 100000, new ExemptTaxState());
        book.printInvoice();

        System.out.println("--- Thay đổi trạng thái sản phẩm ---");
        Product dynamicProduct = new Product("Xe hơi", 2000000000, new StandardTaxState());
        dynamicProduct.printInvoice(); // Ban đầu chỉ VAT

        dynamicProduct.setTaxState(new LuxuryTaxState()); // Phân loại lại là xa xỉ
        dynamicProduct.printInvoice();
    }
}