package iuh.fit.backend.points.service.impl;

import iuh.fit.backend.common.ResourceNotFoundException;
import iuh.fit.backend.points.dto.LeaderboardItemResponse;
import iuh.fit.backend.points.dto.PointBalanceResponse;
import iuh.fit.backend.points.dto.PointRequest;
import iuh.fit.backend.points.dto.PointTransactionResponse;
import iuh.fit.backend.points.entity.PointTransaction;
import iuh.fit.backend.points.entity.PointTransactionType;
import iuh.fit.backend.points.repository.PointTransactionRepository;
import iuh.fit.backend.points.service.PointService;
import iuh.fit.backend.registration.entity.Registration;
import iuh.fit.backend.registration.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PointServiceImpl implements PointService {

    private final PointTransactionRepository pointTransactionRepository;
    private final RegistrationRepository registrationRepository;

    public PointServiceImpl(PointTransactionRepository pointTransactionRepository,
                            RegistrationRepository registrationRepository) {
        this.pointTransactionRepository = pointTransactionRepository;
        this.registrationRepository = registrationRepository;
    }

    @Override
    public PointTransactionResponse earn(PointRequest request) {
        return saveTransaction(request, PointTransactionType.EARN);
    }

    @Override
    public PointTransactionResponse deduct(PointRequest request) {
        int currentBalance = calculateBalance(request.getStudentCode());
        if (currentBalance < request.getPoints()) {
            throw new IllegalArgumentException("Insufficient points to deduct");
        }
        return saveTransaction(request, PointTransactionType.DEDUCT);
    }

    @Override
    public PointBalanceResponse getBalance(String studentCode) {
        return new PointBalanceResponse(studentCode, calculateBalance(studentCode));
    }

    @Override
    public List<PointTransactionResponse> getHistory(String studentCode) {
        return pointTransactionRepository.findByStudentCodeOrderByCreatedAtDesc(studentCode)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<LeaderboardItemResponse> getLeaderboard(int limit) {
        int safeLimit = Math.max(1, limit);
        Map<String, Integer> balances = new HashMap<>();
        for (PointTransaction transaction : pointTransactionRepository.findAllByOrderByCreatedAtDesc()) {
            int delta = transaction.getType() == PointTransactionType.EARN
                    ? transaction.getPoints()
                    : -transaction.getPoints();
            balances.merge(transaction.getStudentCode(), delta, Integer::sum);
        }

        return balances.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(safeLimit)
                .map(entry -> new LeaderboardItemResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private PointTransactionResponse saveTransaction(PointRequest request, PointTransactionType type) {
        PointTransaction transaction = new PointTransaction();
        transaction.setStudentCode(request.getStudentCode());
        transaction.setPoints(request.getPoints());
        transaction.setType(type);
        transaction.setSource(request.getSource());
        transaction.setCreatedAt(LocalDateTime.now());

        if (request.getRegistrationId() != null) {
            Registration registration = registrationRepository.findById(request.getRegistrationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + request.getRegistrationId()));
            transaction.setRegistration(registration);
        }

        return toResponse(pointTransactionRepository.save(transaction));
    }

    private int calculateBalance(String studentCode) {
        int balance = 0;
        for (PointTransaction transaction : pointTransactionRepository.findByStudentCodeOrderByCreatedAtDesc(studentCode)) {
            if (transaction.getType() == PointTransactionType.EARN) {
                balance += transaction.getPoints();
            } else {
                balance -= transaction.getPoints();
            }
        }
        return balance;
    }

    private PointTransactionResponse toResponse(PointTransaction transaction) {
        Long registrationId = transaction.getRegistration() == null ? null : transaction.getRegistration().getId();
        return new PointTransactionResponse(
                transaction.getId(),
                transaction.getStudentCode(),
                transaction.getPoints(),
                transaction.getType(),
                transaction.getSource(),
                registrationId,
                transaction.getCreatedAt()
        );
    }
}

