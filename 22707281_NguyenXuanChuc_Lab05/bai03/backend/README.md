# Mini E-commerce - Service-Based + Event-Driven

Du an duoc tach thanh 3 Spring Boot services chay doc lap theo Service-Based Architecture va giao tiep bat dong bo qua ActiveMQ.
Tat ca services cung su dung chung PostgreSQL (shared database).

## Kien truc

- `order-service` (port `8081`): nhan don hang, luu `PENDING`, phat event `order.created.queue`
- `payment-service` (port `8082`): lang nghe `order.created.queue`, xu ly thanh toan, cap nhat `PAID`, phat event `payment.success.queue`
- `shipping-service` (port `8083`): lang nghe `payment.success.queue`, tao ma van don, cap nhat `SHIPPING`
- `shared-contract`: chua event contract va `OrderStatus`

## Event flow

1. `POST /api/orders` vao `order-service`
2. `order-service` publish `OrderCreatedEvent`
3. `payment-service` consume, cap nhat DB, publish `PaymentSuccessEvent`
4. `shipping-service` consume, tao tracking code, cap nhat DB

## Chay local bang Maven

```bash
mvn clean test
mvn -pl order-service spring-boot:run
mvn -pl payment-service spring-boot:run
mvn -pl shipping-service spring-boot:run
```

## Chay bang Docker Compose (1 lenh)

```bash
docker compose up -d --build
```

## Kiem tra nhanh API

Tao don:

```bash
curl -X POST http://localhost:8081/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Nguyen Van A","productName":"Laptop","amount":1500.50}'
```

Lay thong tin don (doi `id` theo ket qua tao don):

```bash
curl http://localhost:8081/api/orders/1
```

Ban co the mo giao dien ActiveMQ tai `http://localhost:8161` (user/pass: `admin/admin`) de xem queue.

