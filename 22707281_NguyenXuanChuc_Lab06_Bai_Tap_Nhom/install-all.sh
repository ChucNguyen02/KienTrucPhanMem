#!/bin/bash
echo "=== Cài đặt dependencies cho tất cả services ==="

for dir in user-service food-service order-service payment-service frontend; do
  echo ""
  echo "📦 Installing $dir..."
  cd $dir && npm install && cd ..
done

echo ""
echo "✅ Hoàn tất! Sửa file .env rồi chạy 'npm run dev' trong từng folder"
