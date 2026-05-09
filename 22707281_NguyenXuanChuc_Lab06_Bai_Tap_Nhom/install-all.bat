@echo off
echo === Cai dat dependencies cho tat ca services ===

echo.
echo [1/5] User Service...
cd user-service
call npm install
cd ..

echo.
echo [2/5] Food Service...
cd food-service
call npm install
cd ..

echo.
echo [3/5] Order Service...
cd order-service
call npm install
cd ..

echo.
echo [4/5] Payment Service...
cd payment-service
call npm install
cd ..

echo.
echo [5/5] Frontend...
cd frontend
call npm install
cd ..

echo.
echo === Hoan tat! Sua file .env roi chay npm run dev trong tung folder ===
pause
