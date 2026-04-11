package iuh.fit.bai03.shared.event;

import java.io.Serializable;

public record PaymentSuccessEvent(Long orderId) implements Serializable {
}

