package iuh.fit.bai03.shipping.repository;

import iuh.fit.bai03.shipping.domain.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
}

