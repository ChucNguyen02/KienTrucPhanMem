package bai03.controller;

import bai03.dto.request.OrderCreationRequest;
import bai03.dto.response.ApiResponse;
import bai03.dto.response.OrderResponse;
import bai03.entity.enums.OrderStatus;
import bai03.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    // ✅ Tạo đơn hàng ĐỒNG BỘ (gửi email ngay, chờ xong mới return)
    @PostMapping("/sync")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUEST')")
    public ApiResponse<OrderResponse> createOrderSync(@Valid @RequestBody OrderCreationRequest request) {
        log.info("📦 [SYNC] Creating new order for product: {}", request.getProductName());
        long startTime = System.currentTimeMillis();

        OrderResponse response = orderService.createOrderSync(request);

        long duration = System.currentTimeMillis() - startTime;
        log.info("⏱️ [SYNC] Order created in {}ms", duration);

        return ApiResponse.<OrderResponse>builder()
                .result(response)
                .build();
    }

    // ✅ Tạo đơn hàng BẤT ĐỒNG BỘ (đẩy vào queue và return ngay)
    @PostMapping("/async")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUEST')")
    public ApiResponse<OrderResponse> createOrderAsync(@Valid @RequestBody OrderCreationRequest request) {
        log.info("📦 [ASYNC] Creating new order for product: {}", request.getProductName());
        long startTime = System.currentTimeMillis();

        OrderResponse response = orderService.createOrderAsync(request);

        long duration = System.currentTimeMillis() - startTime;
        log.info("⏱️ [ASYNC] Order created in {}ms", duration);

        return ApiResponse.<OrderResponse>builder()
                .result(response)
                .build();
    }

    // ✅ Tạo nhiều đơn hàng ĐỒNG BỘ
    @PostMapping("/bulk/sync")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUEST')")
    public ApiResponse<List<OrderResponse>> createMultipleOrdersSync(
            @Valid @RequestBody List<OrderCreationRequest> requests) {
        log.info("📦 [SYNC] Creating {} orders", requests.size());
        long startTime = System.currentTimeMillis();

        List<OrderResponse> responses = orderService.createMultipleOrdersSync(requests);

        long duration = System.currentTimeMillis() - startTime;
        log.info("⏱️ [SYNC] {} orders created in {}ms", requests.size(), duration);

        return ApiResponse.<List<OrderResponse>>builder()
                .result(responses)
                .build();
    }

    // ✅ Tạo nhiều đơn hàng BẤT ĐỒNG BỘ
    @PostMapping("/bulk/async")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUEST')")
    public ApiResponse<List<OrderResponse>> createMultipleOrdersAsync(
            @Valid @RequestBody List<OrderCreationRequest> requests) {
        log.info("📦 [ASYNC] Creating {} orders", requests.size());
        long startTime = System.currentTimeMillis();

        List<OrderResponse> responses = orderService.createMultipleOrdersAsync(requests);

        long duration = System.currentTimeMillis() - startTime;
        log.info("⏱️ [ASYNC] {} orders created in {}ms (emails queued)", requests.size(), duration);

        return ApiResponse.<List<OrderResponse>>builder()
                .result(responses)
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<OrderResponse>> getAllOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getAllOrders())
                .build();
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUEST')")
    public ApiResponse<List<OrderResponse>> getMyOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getMyOrders())
                .build();
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUEST')")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Long orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrderById(orderId))
                .build();
    }

    @GetMapping("/code/{orderCode}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUEST')")
    public ApiResponse<OrderResponse> getOrderByCode(@PathVariable String orderCode) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrderByCode(orderCode))
                .build();
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.updateOrderStatus(orderId, status))
                .build();
    }

    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ApiResponse.<String>builder()
                .result("Order has been deleted")
                .build();
    }
}

