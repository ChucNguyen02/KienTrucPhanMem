package bai03.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailMessage implements Serializable {
    private Long orderId;
    private String orderCode;
    private String customerEmail;
    private String username;
    private String productName;
    private Integer quantity;
    private String price;
    private String totalAmount;
    private String status;
}
