-- 1. Tạo Database mới để test
CREATE DATABASE Partition_Demo_DB;
GO
USE Partition_Demo_DB;
GO

-- 2. Tạo Partition Function (Hàm định nghĩa ranh giới chia)
-- Ranh giới là số 1.
-- Phân vùng 1: <= 1 (Dành cho Nam)
-- Phân vùng 2: > 1 (Dành cho Nữ)
CREATE PARTITION FUNCTION PF_Gender (INT)
AS RANGE LEFT FOR VALUES (1);
GO

-- 3. Tạo Partition Scheme (Ánh xạ hàm chia vào ổ cứng/filegroup)
-- (Để dễ test trên máy cá nhân, ta gom tất cả vào filegroup [PRIMARY] mặc định)
CREATE PARTITION SCHEME PS_Gender
AS PARTITION PF_Gender ALL TO ([PRIMARY]);
GO

-- 4. Tạo Bảng và ÁP DỤNG Partition Scheme vào cột GenderID
CREATE TABLE Users (
    UserID INT IDENTITY(1,1),
    FullName NVARCHAR(100),
    GenderID INT -- 1: Nam, 2: Nữ
) ON PS_Gender(GenderID); -- <--- Điểm mấu chốt ở đây
GO

-- 5. Insert dữ liệu mẫu (2 Nam, 2 Nữ)
INSERT INTO Users (FullName, GenderID) VALUES 
('Nguyen Van A', 1),  -- Rơi vào Phân vùng 1
('Tran Van B', 1),    -- Rơi vào Phân vùng 1
('Le Thi C', 2),      -- Rơi vào Phân vùng 2
('Pham Thi D', 2);    -- Rơi vào Phân vùng 2
GO
SELECT 
    p.partition_number AS [Số thứ tự Phân vùng],
    p.rows AS [Số lượng dòng dữ liệu (Rows)]
FROM sys.partitions p
JOIN sys.tables t ON p.object_id = t.object_id
WHERE t.name = 'Users' AND p.index_id IN (0,1);

----------------------------------------------------------

-- Bảng 1: Lưu thông tin cốt lõi (Core) - Truy vấn cực nhanh
CREATE TABLE User_Core (
    UserID INT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL
);

-- Bảng 2: Lưu thông tin cồng kềnh (Profile) - Chỉ truy vấn khi cần thiết
CREATE TABLE User_Profile (
    UserID INT PRIMARY KEY,
    AvatarData VARBINARY(MAX), -- Cột lưu trữ ảnh rất nặng
    Biography NVARCHAR(MAX),   -- Cột lưu trữ text dài
    CONSTRAINT FK_UserProfile_UserCore FOREIGN KEY (UserID) REFERENCES User_Core(UserID)
);

-- Insert dữ liệu
INSERT INTO User_Core VALUES (1, 'admin_test', 'hash123');
INSERT INTO User_Profile VALUES (1, 0x0123456789ABCDEF, N'Đây là đoạn tiểu sử rất dài...');

-----------------------------------------------------------------------------

-- 1. Database chuyên xử lý Tài khoản (Identity)
CREATE DATABASE DB_Identity;
GO
USE DB_Identity;
GO
CREATE TABLE Accounts (AccountID INT, Username VARCHAR(50));
GO

-- 2. Database chuyên xử lý Bán hàng (Sales)
CREATE DATABASE DB_Sales;
GO
USE DB_Sales;
GO
CREATE TABLE Orders (OrderID INT, TotalAmount DECIMAL(18,2));
GO