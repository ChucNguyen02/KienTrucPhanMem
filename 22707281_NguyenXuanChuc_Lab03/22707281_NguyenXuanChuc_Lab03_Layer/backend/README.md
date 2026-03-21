# Student Activity Backend (Monolith)

Backend monolith theo layered architecture cho 3 plugin:

1. Campaign Manager
2. Registration & Attendance
3. Points & Reporting

## Tech stack

- Java 17
- Spring Boot
- Spring Web + Spring Data JPA + Validation
- MariaDB (runtime)
- H2 (test)

## Cau hinh MariaDB

Da cau hinh truc tiep trong `src/main/resources/application.properties` (khong dung `.env`).

Mac dinh:

- DB URL: `jdbc:mariadb://localhost:3306/student_activity_db?createDatabaseIfNotExist=true`
- Username: `root`
- Password: `123456`

Ban co the doi thong so nay trong file properties neu can.

## Chay project

```powershell
.\mvnw.cmd spring-boot:run
```

## Chay test

```powershell
.\mvnw.cmd test
```

## API chinh

- Campaign: `/api/campaigns`
- Event: `/api/events`
- Registration: `/api/registrations`
- Points: `/api/points`
- Reports: `/api/reports`

