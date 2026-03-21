# Backend Microkernel - Lab03

## Kien truc

Du an backend theo mo hinh microkernel voi 1 kernel va 3 plugin:

- `campaign-manager`: Quan ly chien dich
- `registration-attendance`: Cong dang ky va diem danh
- `points-reporting`: Bao cao diem ren luyen

Cau truc source chinh:

- `iuh.fit.backend.kernel`: hop dong plugin va API danh sach plugin
- `iuh.fit.backend.plugins.campaign`: `controller/service/repository/entity`
- `iuh.fit.backend.plugins.registration`: `controller/service/repository/entity`
- `iuh.fit.backend.plugins.points`: `controller/service/repository/entity`
- `iuh.fit.backend.common`: xu ly exception dung chung

## Cau hinh MariaDB

Da cau hinh truc tiep trong `src/main/resources/application.properties`:

- URL: `jdbc:mariadb://localhost:3306/microkernel_lab03`
- Username: `root`
- Password: `123456`

Ban co the doi lai theo may cua ban, khong can file `.env`.

## API nhanh

- `GET /api/plugins`
- `POST /api/campaigns`
- `GET /api/campaigns`
- `PUT /api/campaigns/{campaignId}/status`
- `POST /api/registrations`
- `GET /api/registrations?campaignId={id}`
- `PATCH /api/registrations/{registrationId}/attendance`
- `GET /api/registrations/{registrationId}/attendance`
- `GET /api/reports/student-points?campaignId={id}`
- `GET /api/reports/campaign-points`

## Chay du an

```bash
./mvnw spring-boot:run
```

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

## Test

```bash
./mvnw test
```

Windows:

```powershell
.\mvnw.cmd test
```

