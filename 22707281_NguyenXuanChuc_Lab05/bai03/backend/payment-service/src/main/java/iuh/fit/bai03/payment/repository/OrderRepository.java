package iuh.fit.bai03.payment.repository;

import iuh.fit.bai03.payment.domain.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
}

