package iuh.fit.demo.service;

import iuh.fit.demo.dto.request.FoodRequest;
import iuh.fit.demo.dto.response.FoodResponse;

import java.util.List;

public interface FoodService {
    List<FoodResponse> getAllFoods();
    FoodResponse getFoodById(String id);
    FoodResponse createFood(FoodRequest request);
    FoodResponse updateFood(String id, FoodRequest request);
    void deleteFood(String id);
}