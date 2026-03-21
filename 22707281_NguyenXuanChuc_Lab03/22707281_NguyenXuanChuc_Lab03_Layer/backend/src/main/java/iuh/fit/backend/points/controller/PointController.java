package iuh.fit.backend.points.controller;

import iuh.fit.backend.common.ApiResponse;
import iuh.fit.backend.points.dto.LeaderboardItemResponse;
import iuh.fit.backend.points.dto.PointBalanceResponse;
import iuh.fit.backend.points.dto.PointRequest;
import iuh.fit.backend.points.dto.PointTransactionResponse;
import iuh.fit.backend.points.service.PointService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
public class PointController {

    private final PointService pointService;

    public PointController(PointService pointService) {
        this.pointService = pointService;
    }

    @PostMapping("/earn")
    public ResponseEntity<ApiResponse<PointTransactionResponse>> earn(@Valid @RequestBody PointRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Points earned", pointService.earn(request)));
    }

    @PostMapping("/deduct")
    public ResponseEntity<ApiResponse<PointTransactionResponse>> deduct(@Valid @RequestBody PointRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Points deducted", pointService.deduct(request)));
    }

    @GetMapping("/balance/{studentCode}")
    public ResponseEntity<ApiResponse<PointBalanceResponse>> getBalance(@PathVariable String studentCode) {
        return ResponseEntity.ok(new ApiResponse<>("Point balance", pointService.getBalance(studentCode)));
    }

    @GetMapping("/history/{studentCode}")
    public ResponseEntity<ApiResponse<List<PointTransactionResponse>>> getHistory(@PathVariable String studentCode) {
        return ResponseEntity.ok(new ApiResponse<>("Point transaction history", pointService.getHistory(studentCode)));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<ApiResponse<List<LeaderboardItemResponse>>> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(new ApiResponse<>("Leaderboard", pointService.getLeaderboard(limit)));
    }
}

