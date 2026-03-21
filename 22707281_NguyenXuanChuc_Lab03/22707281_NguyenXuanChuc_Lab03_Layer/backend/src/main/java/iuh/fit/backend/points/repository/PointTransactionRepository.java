package iuh.fit.backend.points.repository;

import iuh.fit.backend.points.entity.PointTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointTransactionRepository extends JpaRepository<PointTransaction, Long> {
    List<PointTransaction> findByStudentCodeOrderByCreatedAtDesc(String studentCode);

    List<PointTransaction> findAllByOrderByCreatedAtDesc();
}

