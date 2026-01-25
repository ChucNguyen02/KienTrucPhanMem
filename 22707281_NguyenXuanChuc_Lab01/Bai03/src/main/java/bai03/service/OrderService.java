package bai03.service;

import bai03.dto.request.OrderCreationRequest;
import bai03.dto.response.OrderResponse;
import bai03.entity.Order;
import bai03.entity.User;
import bai03.entity.enums.OrderStatus;
import bai03.exception.AppException;
import bai03.exception.ErrorCode;
import bai03.mapper.OrderMapper;
import bai03.repository.OrderRepository;
import bai03.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final EmailService emailService;

    @Transactional
    public OrderResponse createOrderSync(OrderCreationRequest request) {
        Order order = createOrderEntity(request);
        Order savedOrder = orderRepository.save(order);

        log.info("📦 [SYNC] Order created: {}", savedOrder.getOrderCode());

        // ✅ Gửi email ĐỒNG BỘ (chờ gửi xong mới return)
        emailService.sendOrderConfirmationSync(savedOrder);

        return orderMapper.toOrderResponse(savedOrder);
    }

    @Transactional
    public OrderResponse createOrderAsync(OrderCreationRequest request) {
        Order order = createOrderEntity(request);
        Order savedOrder = orderRepository.save(order);
        log.info("📦 [ASYNC] Order created: {}", savedOrder.getOrderCode());

        // ✅ TỐI ƯU: Chỉ gửi message khi DB đã commit thành công
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                try {
                    emailService.sendOrderConfirmationAsync(savedOrder);
                } catch (Exception e) {
                    log.error("❌ Lỗi gửi queue sau khi commit", e);
                    // Có thể lưu log để retry sau
                }
            }
        });

        return orderMapper.toOrderResponse(savedOrder);
    }

    @Transactional
    public List<OrderResponse> createMultipleOrdersSync(List<OrderCreationRequest> requests) {
        log.info("📦 [SYNC] Creating {} orders", requests.size());
        return requests.stream()
                .map(this::createOrderSync)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<OrderResponse> createMultipleOrdersAsync(List<OrderCreationRequest> requests) {
        log.info("📦 [ASYNC] Creating {} orders", requests.size());
        return requests.stream()
                .map(this::createOrderAsync)
                .collect(Collectors.toList());
    }

    private Order createOrderEntity(OrderCreationRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Order order = orderMapper.toOrder(request);
        order.setUser(user);
        order.setOrderCode(generateOrderCode());
        order.setStatus(OrderStatus.PENDING);

        return order;
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getMyOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return orderRepository.findByUserId(user.getId()).stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        return orderMapper.toOrderResponse(order);
    }

    public OrderResponse getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        return orderMapper.toOrderResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        log.info("📝 Order {} status updated to: {}", order.getOrderCode(), status);

        return orderMapper.toOrderResponse(updatedOrder);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new AppException(ErrorCode.ORDER_NOT_EXISTED);
        }
        orderRepository.deleteById(orderId);
        log.info("🗑️ Order deleted: {}", orderId);
    }

    private String generateOrderCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return "ORD-" + timestamp + "-" + random;
    }
}
