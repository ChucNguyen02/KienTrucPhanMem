package iuh.fit.bai03.shared.event;

import java.io.Serializable;
import java.math.BigDecimal;

public record OrderCreatedEvent(Long orderId, BigDecimal amount) implements Serializable {
}

