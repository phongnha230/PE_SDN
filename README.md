# 🚀 UNIVERSAL PE SDN302 REUSABLE BOILERPLATE

Dự án Boilerplate Next.js 16 (App Router + Turbopack) + Prisma 6 + Supabase PostgreSQL + Tailwind CSS + Next.js Proxy/Auth tối ưu 0ms, sẵn sàng tái tạo 100% cho mọi đề thi Practical Exam (SDN302) trong 15-20 phút.

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx       # Bố cục 2 cột: Form (35%) & Filters + List (65%)
│   │   ├── items/page.tsx           # Route tương ứng cho entity
│   │   └── layout.tsx               # Provider Scope (<ItemProvider>) & Header Navbar
│   ├── api/
│   │   ├── auth/                    # Module Authentication cố định (100% mọi đề)
│   │   │   ├── register/route.ts    # POST: Đăng ký & hash password (bcryptjs)
│   │   │   ├── login/route.ts       # POST: Đăng nhập & set cookie JWT
│   │   │   ├── logout/route.ts      # POST: Xóa cookie JWT
│   │   │   └── me/route.ts          # GET: Lấy thông tin user hiện tại
│   │   └── items/                   # CRUD RESTful APIs chuẩn đề thi
│   │       ├── route.ts             # GET (Filter/Search) & POST (Validation + 409 Conflict)
│   │       ├── summary/route.ts     # GET: Thống kê số lượng, tổng tiền, breakdown
│   │       └── [id]/
│   │           ├── route.ts         # GET, PUT, DELETE
│   │           └── star/route.ts    # PATCH: Toggle Star/Status (0ms)
│   ├── login/page.tsx               # Giao diện Đăng nhập chuẩn hóa
│   ├── register/page.tsx            # Giao diện Đăng ký chuẩn hóa
│   ├── globals.css                  # Tailwind directives
│   ├── layout.tsx                   # Root HTML layout
│   └── page.tsx                     # Redirect root -> /dashboard
├── components/
│   └── Navbar.tsx                   # Thanh điều hướng: Logo, Email User, Logout
├── features/
│   └── items/                       # Generic Entity Engine (Cắm và chạy)
│       ├── components/
│       │   ├── ItemForm.tsx         # Form thêm mới (Title, Amount, Category, Date, Note)
│       │   ├── ItemFilters.tsx      # Bộ lọc Search (q), Category dropdown, Star status
│       │   ├── ItemSummary.tsx      # Thống kê Cards & Category breakdown chips
│       │   ├── ItemRow.tsx          # Card/Row hiển thị từng item (Star & Delete)
│       │   └── ItemList.tsx         # Container danh sách & Empty state
│       ├── context/
│       │   └── ItemContext.tsx      # Quản lý State & Optimistic UI (0ms Toggle/Delete)
│       ├── server/
│       │   ├── item.repository.ts   # Prisma Query Layer (Find, Duplicate Check, Delete...)
│       │   └── item.service.ts      # Business Layer (Validation, 409 Conflict check)
│       ├── validations/
│       │   └── item.schema.ts       # Chống Timezone Bug (00:00 - 07:00 VN)
│       ├── types.ts                 # Interfaces & DTOs
│       └── index.ts                 # Barrel exports
├── lib/
│   ├── auth.ts                      # JWT Verify/Sign tối ưu 0ms từ Cookie
│   ├── prisma.ts                    # Prisma Client Singleton
│   └── utils.ts                     # cn() helper, formatCurrency, formatDate
├── prisma/
│   └── schema.prisma                # Model User & Item (Quan hệ 1-N)
├── proxy.ts                         # Route Protection Proxy chuẩn Next.js 16
├── .env                             # Chuỗi kết nối Supabase Pooler + Direct
└── package.json                     # Next.js 16 + React 19 + Prisma 6 + Tailwind 3
```

---

## ⚡ Các Tính Năng Đạt Chuẩn 100% Đề Thi PE

1. **Authentication (JWT Cookie + Proxy)**:
   - Đăng ký mật khẩu được băm an toàn với `bcryptjs`.
   - Token JWT lưu trữ trong Cookie `httpOnly`, kiểm tra 0ms không gọi Database ở middleware.
   - File bảo vệ route `proxy.ts` chuẩn Next.js 16 chuyển hướng tự động người dùng chưa đăng nhập về `/login`.

2. **Chống Timezone Bug (`validations/item.schema.ts`)**:
   - Tự động bù trừ chênh lệch múi giờ UTC vs Local (GMT+7) khi thi/chấm lúc rạng sáng (00:00 - 07:00), không bị lỗi `Date cannot be in the future`.

3. **Chống Trùng Lặp Chuẩn 409 Conflict**:
   - API POST kiểm tra trùng lặp: Cùng `userId`, cùng `title` (không phân biệt hoa thường), cùng `amount`, và cùng trong 1 ngày `spentAt`.
   - Trả về mã lỗi HTTP `409 Conflict` đúng tiêu chuẩn chấm điểm tự động.

4. **Optimistic UI (0ms)**:
   - Hành động Star (Yêu thích/Hoàn thành) và Xóa bản ghi phản hồi tức thì 0ms trên giao diện, đồng bộ ngầm với backend.

5. **Bộ Lọc Đa Chiều & Thống Kê**:
   - Tìm kiếm từ khóa `q` (trong title hoặc note).
   - Lọc theo phân loại `category`.
   - Lọc theo trạng thái `starred`.
   - Bảng thẻ thống kê số lượng bản ghi, tổng số tiền, trung bình, và breakdown từng danh mục.

---

## 🎯 Speedrun 15 Phút Tái Tạo Khi Gặp Đề Thi Mới

| Bước | Hành Động Cần Làm |
| :--- | :--- |
| **Bước 1** | Điền chuỗi kết nối Supabase (vùng Singapore) vào `.env` (`DATABASE_URL`, `DIRECT_URL`). |
| **Bước 2** | Sửa tên `Item` trong `prisma/schema.prisma` thành tên thực thể đề bài (ví dụ `Expense`, `Product`, `Task`) và chạy `npx prisma db push`. |
| **Bước 3** | Đổi tên các trường trong `features/<entity>/` (nếu đề bài dùng `price` thay cho `amount`, `name` thay cho `title`). |
| **Bước 4** | Chạy `npm run build` để kiểm tra 0 lỗi biên dịch. |
| **Bước 5** | Mở trình duyệt ẩn danh (`Ctrl + Shift + N`) tại `http://localhost:3000` và hoàn thành bài thi! |
