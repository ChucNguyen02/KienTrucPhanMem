package iuh.fit.demo;

import iuh.fit.demo.entity.Food;
import iuh.fit.demo.repository.FoodRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.util.List;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(FoodRepository foodRepository) {
        return args -> {
            if (foodRepository.count() == 0) {   // Chỉ seed nếu chưa có dữ liệu
                List<Food> foods = List.of(
                        Food.builder().name("Phở Bò").description("Phở bò Hà Nội truyền thống").price(new BigDecimal("65000")).imageUrl("https://example.com/pho.jpg").build(),
                        Food.builder().name("Bánh Mì Thịt").description("Bánh mì kẹp thịt nướng").price(new BigDecimal("35000")).imageUrl("https://example.com/banhmi.jpg").build(),
                        Food.builder().name("Cơm Tấm Sườn Nướng").description("Cơm tấm sườn nướng").price(new BigDecimal("55000")).imageUrl("https://example.com/comtam.jpg").build(),
                        Food.builder().name("Gỏi Cuốn Tôm Thịt").description("Gỏi cuốn tươi ngon").price(new BigDecimal("45000")).imageUrl("https://example.com/goicuon.jpg").build(),
                        Food.builder().name("Bún Chả Hà Nội").description("Bún chả thơm lừng").price(new BigDecimal("60000")).imageUrl("https://example.com/buncha.jpg").build(),
                        Food.builder().name("Mì Quảng Gà").description("Mì Quảng Đà Nẵng").price(new BigDecimal("50000")).imageUrl("https://example.com/miquang.jpg").build(),
                        Food.builder().name("Cà Phê Sữa Đá").description("Cà phê sữa đá").price(new BigDecimal("25000")).imageUrl("https://example.com/caphe.jpg").build(),
                        Food.builder().name("Trà Đào").description("Trà đào tươi mát").price(new BigDecimal("30000")).imageUrl("https://example.com/tradao.jpg").build()
                );
                foodRepository.saveAll(foods);
                System.out.println("✅ Đã seed 8 món ăn vào MongoDB!");
            }
        };
    }

}
