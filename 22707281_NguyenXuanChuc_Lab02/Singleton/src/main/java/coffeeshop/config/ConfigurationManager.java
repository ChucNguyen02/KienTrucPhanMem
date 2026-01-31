// src/main/java/coffeeshop/config/ConfigurationManager.java
package coffeeshop.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigurationManager {
    private static class Holder {
        private static final ConfigurationManager INSTANCE = new ConfigurationManager();
    }

    private final Properties properties = new Properties();

    private ConfigurationManager() {
        loadConfig();
    }

    public static ConfigurationManager getInstance() {
        return Holder.INSTANCE;
    }

    private void loadConfig() {
        // Load từ classpath (src/main/resources)
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("config.properties")) {
            if (is == null) {
                throw new IOException("File config.properties không tồn tại trong resources");
            }
            properties.load(is);
            System.out.println("Đã load config thành công từ resources!");
        } catch (IOException e) {
            System.out.println("Lỗi load config.properties: " + e.getMessage());
            System.out.println("Sử dụng giá trị mặc định.");
            properties.setProperty("store.address", "Chưa cấu hình");
            properties.setProperty("open.hour", "08:00");
            properties.setProperty("close.hour", "22:00");
            properties.setProperty("tax.rate", "0.1");
        }
    }

    public String getStoreAddress() {
        return properties.getProperty("store.address");
    }

    public String getOpenHour() {
        return properties.getProperty("open.hour");
    }

    public String getCloseHour() {
        return properties.getProperty("close.hour");
    }

    public double getTaxRate() {
        try {
            return Double.parseDouble(properties.getProperty("tax.rate", "0.1"));
        } catch (NumberFormatException e) {
            return 0.1;
        }
    }

    public void reloadConfig() {
        loadConfig();
        System.out.println("Config đã được reload!");
    }

    public void printConfig() {
        System.out.println("=== Cấu hình cửa hàng ===");
        System.out.println("Địa chỉ: " + getStoreAddress());
        System.out.println("Giờ mở cửa: " + getOpenHour());
        System.out.println("Giờ đóng cửa: " + getCloseHour());
        System.out.println("Thuế VAT: " + (getTaxRate() * 100) + "%");
        System.out.println("=========================");
    }
}