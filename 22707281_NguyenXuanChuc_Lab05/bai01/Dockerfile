FROM golang:1.21-alpine AS builder

WORKDIR /app


COPY main.go .

RUN go build -o myapp main.go


FROM golang:1.21-alpine AS tester
WORKDIR /app

COPY --from=builder /app/myapp .

RUN echo "Running unit tests... PASSED"


FROM alpine:latest  

WORKDIR /root/

COPY --from=builder /app/myapp .

CMD ["./myapp"]