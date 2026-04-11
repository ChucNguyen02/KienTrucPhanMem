package iuh.fit.bai03.payment.repository;

import iuh.fit.bai03.payment.domain.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    boolean existsByOrderId(Long orderId);
}

