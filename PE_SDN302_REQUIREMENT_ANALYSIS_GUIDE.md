# 📋 CẨM NANG BÓC TÁCH ĐỀ THI & MA TRẬN TEST HOOKS CHUẨN HOÁ
> **Mục tiêu:** Bản hướng dẫn bóc tách nhanh bất kỳ đề thi PE SDN302 nào dựa trên form chuẩn của trường (FPT University / SDN302 Examination Format).
> **Nguyên tắc sống còn:** Đề thi được chấm bằng bot tự động (Playwright/Cypress gọi trực tiếp API & quét `data-testid`). Khớp đúng 100% tên testid, chuỗi thông báo lỗi và mã HTTP status = **10/10 điểm tuyệt đối**.

---

## 🧭 1. QUY TRÌNH 4 BƯỚC BÓC TÁCH ĐỀ THI THẬT

Khi nhận đề thi (Word / PDF / Text), hãy quét nhanh qua đề theo đúng 4 bước:

```
┌────────────────────────────────────────────────────────┐
│ BƯỚC 1: XÁC ĐỊNH THỰC THỂ (ENTITY) & 5 CATEGORIES      │
│ - Tên thực thể: Product / Task / Booking / Expense ... │
│ - 5 danh mục hợp lệ trong thẻ select                   │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 2: TRÍCH XUẤT CÁC TRƯỜNG DỮ LIỆU (FIELDS)         │
│ - Tên (title/name), Giá trị (amount/price),            │
│   Danh mục (category), Ngày (spentAt/date/dueDate)     │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 3: COPY NGUYÊN VĂN CHUỖI LỖI (EXACT ERROR STRINGS)│
│ - Lỗi rỗng (required), số âm, ngày tương lai,          │
│   chuỗi lỗi trùng lặp (409 Conflict)                   │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 4: ÁNH XẠ MA TRẬN DATA-TESTID THEO CÔNG THỨC      │
│ - Áp dụng tiền tố btn-, input-, error- cho <Entity>    │
└────────────────────────────────────────────────────────┘
```

---

## 🏷️ 2. MA TRẬN DATA-TESTID CHUẨN KHUÔN ĐỀ THI CỦA TRƯỜNG

Mọi đề thi đều tuân theo chuẩn đặt tên test hooks cố định sau. Khi đề thi đổi thực thể, chỉ cần thay thế biến `<entity>` (dạng số ít, chữ thường) và `<entities>` (dạng số nhiều):

### A. Phân Hệ Xác Thực (Authentication: `/login` & `/register`)
> [!IMPORTANT]
> **Tên Cookie Phiên Đăng Nhập:** Đọc chính xác tên cookie từ Mục 2.3 của đề bài (Ví dụ: `session_token`, `token`, hoặc `auth_token`). Nếu đề không ghi rõ thì mặc định dùng `session_token`. Tuyệt đối dùng đúng tên cookie mà đề bài chỉ định.

| Phần tử UI | `data-testid` bắt buộc | Hành vi & Lưu ý |
| :--- | :--- | :--- |
| Nút Login / Register (Header) | `btn-login`, `btn-register` | Khi chưa đăng nhập |
| Header (Đã đăng nhập) | `user-email`, `btn-logout`, `link-expenses` (hoặc `link-<entities>`) | Hiển thị email và nút logout |
| Tiêu đề trang chủ | `home-title` | Tiêu đề tên ứng dụng |
| Form Đăng nhập | `data-testid="login-form"` | Thẻ `<form noValidate>` |
| Input Đăng nhập | `data-testid="login-email"`, `data-testid="login-password"` | Thẻ `<input>` |
| Nút Submit Đăng nhập | `data-testid="login-submit"` | Thẻ `<button type="submit">` |
| Form Đăng ký | `data-testid="register-form"` | Thẻ `<form noValidate>` |
| Input Đăng ký | `data-testid="register-email"`, `data-testid="register-password"`, `data-testid="register-confirm-password"` | Thẻ `<input>` |
| Nút Submit Đăng ký | `data-testid="register-submit"` | Thẻ `<button type="submit">` |
| Thông báo lỗi Form Auth | `data-testid="error-email"`, `data-testid="error-password"`, `data-testid="error-confirm-password"`, `data-testid="error-auth"` | **Chỉ render khi có lỗi** |
| Thông báo Đăng ký thành công | `data-testid="form-success"` | Hiển thị chữ `"Registration successful"` |

---

### B. Phân Hệ Quản Lý Thực Thể (`/<entities>` - Dashboard)

| Khối Chức Năng | Phần tử UI | `data-testid` chuẩn khuôn đề |
| :--- | :--- | :--- |
| **Container Trang** | Toàn bộ trang Dashboard | `data-testid="<entities>-page"` *(VD: expenses-page, products-page)* |
| **Form Thêm Mới** | Thẻ `<form noValidate>` | `data-testid="<entity>-form"` *(VD: expense-form, product-form)* |
| | Input Tiêu đề / Tên | `data-testid="input-title"` *(hoặc input-name)* |
| | Input Giá trị / Số tiền | `data-testid="input-amount"` *(hoặc input-price)* |
| | Select Danh mục | `data-testid="input-category"` *(Option đầu: `<option value="">Choose category</option>`)* |
| | Input Ngày tháng | `data-testid="input-date"` *(type="date")* |
| | Input Ghi chú | `data-testid="input-note"` *(optional)* |
| | Nút Submit Thêm Mới | `data-testid="btn-add-<entity>"` *(VD: btn-add-expense, btn-add-product)* |
| | Thông báo lỗi từng ô | `data-testid="error-title"`, `data-testid="error-amount"`, `data-testid="error-category"`, `data-testid="error-date"` |
| | Thông báo lỗi API (409) | `data-testid="error-<entity>"` *(VD: error-expense, error-product)* |
| | Thông báo thêm thành công| `data-testid="<entity>-success"` *(Hiển thị: "<Entity> added")* |
| **Danh Sách (List)**| Container danh sách | `data-testid="<entity>-list"` *(VD: expense-list, product-list)* |
| | Trạng thái rỗng | `data-testid="<entities>-empty"` *(Hiển thị: "No <entities> found")* |
| | Từng dòng / Thẻ Card | `data-testid="<entity>-item"` *(Không gắn ID vào testid này)* |
| | Bên trong từng Card | `data-testid="<entity>-title"`, `data-testid="<entity>-amount"`, `data-testid="<entity>-category"`, `data-testid="<entity>-date"` |
| | Nút Yêu thích / Star | `data-testid="btn-toggle-star"` *(BẮT BUỘC: aria-pressed="true" / "false")* |
| | Nút Xóa bản ghi | `data-testid="btn-delete-<entity>"` *(VD: btn-delete-expense, btn-delete-product)* |
| **Bộ Lọc (Filters)**| Dropdown chọn danh mục | `data-testid="filter-category"` *(Option đầu tiên value="" hiển thị "All")* |
| | Checkbox Starred | `data-testid="filter-starred"` *(Checkbox type="checkbox")* |
| | Ô tìm kiếm từ khóa | `data-testid="search-input"` *(Tìm theo title OR note, case-insensitive)* |
| | Nút Xóa bộ lọc | `data-testid="btn-clear-filters"` *(Reset toàn bộ filter về rỗng)* |
| **Thống Kê (Summary)**| Tổng số lượng bản ghi | `data-testid="<entity>-count"` *(Số nguyên, VD: 5)* |
| | Số lượng đã gắn Star | `data-testid="starred-count"` *(Số nguyên, VD: 2)* |
| | Tổng giá trị / tiền | `data-testid="total-amount"` *(Format 2 chữ số thập phân)* |
| | Khung Breakdown | `data-testid="category-breakdown"` |
| | Từng dòng Breakdown | `data-testid="breakdown-row"` chứa `breakdown-name`, `breakdown-count`, `breakdown-total` |

---

## 📑 3. TIÊU CHUẨN API CONTRACTS & MÃ HTTP STATUS

| Endpoint Chuẩn | Method | Chức Năng | Mã HTTP & Response Body Chuẩn |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Đăng ký tài khoản | `201 Created`: `{ id, email }` *(Không tự động đăng nhập)* |
| `/api/auth/login` | `POST` | Đăng nhập hệ thống | `200 OK`: `{ id, email }` + Set-Cookie: `session_token` |
| `/api/auth/logout` | `POST` | Đăng xuất | `200 OK`: Clear cookie `session_token` |
| `/api/auth/me` | `GET` | Kiểm tra phiên đăng nhập | `200 OK`: `{ id, email }` hoặc `401 Unauthorized` |
| `/api/<entities>` | `GET` | Lấy danh sách kèm lọc | `200 OK`: Mảng JSON các bản ghi (sắp xếp spentAt giảm dần) |
| `/api/<entities>` | `POST` | Thêm mới bản ghi | `201 Created`: Bản ghi vừa tạo<br>`400 Bad Request`: `{ "error": "..." }`<br>`409 Conflict`: `{ "error": "Duplicate <entity>: ..." }` |
| `/api/<entities>/summary`| `GET` | Thống kê theo bộ lọc | `200 OK`: `{ count, starredCount, totalAmount, breakdown: [...] }` |
| `/api/<entities>/:id` | `PATCH` | Cập nhật / Đổi Star | `200 OK`: Bản ghi cập nhật<br>`404 Not Found`: `{ "error": "<Entity> not found" }` |
| `/api/<entities>/:id` | `DELETE`| Xóa bản ghi | `200 OK`: `{ "success": true }`<br>`404 Not Found`: `{ "error": "<Entity> not found" }` |
