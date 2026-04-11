package iuh.fit.demo.service.impl;

import iuh.fit.demo.dto.request.FoodRequest;
import iuh.fit.demo.dto.response.FoodResponse;
import iuh.fit.demo.entity.Food;
import iuh.fit.demo.exception.ResourceNotFoundException;
import iuh.fit.demo.repository.FoodRepository;
import iuh.fit.demo.service.FoodService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;

    @Override
    public List<FoodResponse> getAllFoods() {
        log.info("📋 [Food Service] Yêu cầu lấy danh sách tất cả món ăn");
        List<FoodResponse> foods = foodRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();

        log.info("✅ [Food Service] Trả về {} món ăn thành công", foods.size());
        return foods;
    }

    @Override
    public FoodResponse getFoodById(String id) {
        log.info("🔍 [Food Service] Yêu cầu lấy chi tiết món ăn với ID: {}", id);

        Food food = foodRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("❌ [Food Service] Không tìm thấy món ăn với ID: {}", id);
                    return new ResourceNotFoundException("Không tìm thấy món ăn có ID: " + id);
                });

        FoodResponse response = mapToResponse(food);
        log.info("✅ [Food Service] Trả về món ăn: {} (ID: {})", response.name(), id);
        return response;
    }

    @Transactional
    @Override
    public FoodResponse createFood(FoodRequest request) {
        log.info("➕ [Food Service] Yêu cầu tạo mới món ăn: {}", request.name());

        Food food = Food.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .imageUrl(request.imageUrl())
                .build();

        Food saved = foodRepository.save(food);
        FoodResponse response = mapToResponse(saved);

        log.info("✅ [Food Service] Tạo món ăn thành công - ID: {}, Tên: {}", saved.getId(), saved.getName());
        return response;
    }

    @Transactional
    @Override
    public FoodResponse updateFood(String id, FoodRequest request) {
        log.info("✏️ [Food Service] Yêu cầu cập nhật món ăn ID: {}", id);

        Food food = foodRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("❌ [Food Service] Không tìm thấy món ăn để cập nhật - ID: {}", id);
                    return new ResourceNotFoundException("Không tìm thấy món ăn có ID: " + id);
                });

        food.setName(request.name());
        food.setDescription(request.description());
        food.setPrice(request.price());
        food.setImageUrl(request.imageUrl());

        Food updated = foodRepository.save(food);
        FoodResponse response = mapToResponse(updated);

        log.info("✅ [Food Service] Cập nhật món ăn thành công - ID: {}, Tên mới: {}", id, updated.getName());
        return response;
    }

    @Transactional
    @Override
    public void deleteFood(String id) {
        log.info("🗑️ [Food Service] Yêu cầu xóa món ăn ID: {}", id);

        if (!foodRepository.existsById(id)) {
            log.error("❌ [Food Service] Không tìm thấy món ăn để xóa - ID: {}", id);
            throw new ResourceNotFoundException("Không tìm thấy món ăn có ID: " + id);
        }

        foodRepository.deleteById(id);
        log.info("✅ [Food Service] Xóa món ăn thành công - ID: {}", id);
    }

    private FoodResponse mapToResponse(Food food) {
        return new FoodResponse(
                food.getId(),
                food.getName(),
                food.getDescription(),
                food.getPrice(),
                food.getImageUrl()
        );
    }
}