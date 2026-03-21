package iuh.fit.backend.points.service;

import iuh.fit.backend.points.dto.LeaderboardItemResponse;
import iuh.fit.backend.points.dto.PointBalanceResponse;
import iuh.fit.backend.points.dto.PointRequest;
import iuh.fit.backend.points.dto.PointTransactionResponse;

import java.util.List;

public interface PointService {
    PointTransactionResponse earn(PointRequest request);

    PointTransactionResponse deduct(PointRequest request);

    PointBalanceResponse getBalance(String studentCode);

    List<PointTransactionResponse> getHistory(String studentCode);

    List<LeaderboardItemResponse> getLeaderboard(int limit);
}

