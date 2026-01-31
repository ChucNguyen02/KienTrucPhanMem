// src/main/java/coffeeshop/Main.java
package coffeeshop;

import coffeeshop.config.ConfigurationManager;

public class Main {
    public static void main(String[] args) {
        ConfigurationManager config1 = ConfigurationManager.getInstance();
        config1.printConfig();

        ConfigurationManager config2 = ConfigurationManager.getInstance();

        if (config1 == config2) {
            System.out.println("Cùng một instance (Singleton hoạt động đúng)!");
        }

        System.out.println("\n--- OrderService sử dụng config ---");
        System.out.println("Thuế áp dụng: " + config1.getTaxRate() * 100 + "%");

        System.out.println("\n--- ReportService sử dụng config ---");
        config2.printConfig();
    }
}