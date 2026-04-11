package iuh.fit.demo.controller;

import iuh.fit.demo.dto.request.FoodRequest;
import iuh.fit.demo.dto.response.FoodResponse;
import iuh.fit.demo.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/foods")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<List<FoodResponse>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse> getFoodById(@PathVariable String id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }

    @PostMapping
    public ResponseEntity<FoodResponse> createFood(@RequestBody @Valid FoodRequest request) {
        FoodResponse response = foodService.createFood(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodResponse> updateFood(@PathVariable String id,
                                                   @RequestBody @Valid FoodRequest request) {
        FoodResponse response = foodService.updateFood(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable String id) {
        foodService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}