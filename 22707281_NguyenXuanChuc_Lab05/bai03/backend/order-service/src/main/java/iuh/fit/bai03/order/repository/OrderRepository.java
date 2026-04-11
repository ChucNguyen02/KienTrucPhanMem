package iuh.fit.bai03.order.repository;

import iuh.fit.bai03.order.domain.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
}

