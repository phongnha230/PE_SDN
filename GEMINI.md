# 🤖 SDN302 AGENT SYSTEM INSTRUCTIONS (`GEMINI.md`)
> **Workspace Entrypoint:** Tệp này được Antigravity tự động nạp ở **mọi phiên làm việc**. 
> Bất cứ khi nào User cung cấp đề bài thi PE (yêu cầu thực thể, ảnh chụp đề, file Word/PDF, prompt), Agent **BẮT BUỘC** áp dụng ngay bộ 3 cẩm nang cốt lõi bên dưới.

---

## 📚 BỘ 3 TÀI LIỆU CHỈ ĐẠO CỐT LÕI (CORE PLAYBOOKS)

Agent phải tham chiếu và tuân thủ tuyệt đối quy trình trong 3 tệp sau:

1. **[PE_SDN302_REQUIREMENT_ANALYSIS_GUIDE.md](file:///c:/Users/HPPAVILION/Documents/IT/Demo/PE-SDN/PE_SDN302_REQUIREMENT_ANALYSIS_GUIDE.md)**:
   - **Mục đích:** Đọc và bóc tách đề thi PE, trích xuất chính xác 100% các thuộc tính `data-testid`, chuỗi thông báo lỗi (Exact Error Strings), quy cách trả về Date (`YYYY-MM-DD`), và thứ tự tie-break của Breakdown summary phục vụ bot chấm tự động (Playwright/Cypress).
   - **Nguyên tắc sống còn:** Sai 1 ký tự trong `data-testid` hoặc thiếu/thừa dấu chấm trong error string = 0 điểm test.

2. **[PE_SDN302_GUIDELINES.md](file:///c:/Users/HPPAVILION/Documents/IT/Demo/PE-SDN/PE_SDN302_GUIDELINES.md)**:
   - **Mục đích:** Kiến trúc code mẫu Clean Architecture, Singleton Prisma, Route Protection (`proxy.ts`), JWT 0ms không query lại DB, xử lý lỗi Timezone Bug (00:00 - 07:00 VN), kiểm tra trùng lặp HTTP `409 Conflict` trên cả POST và PATCH, và lệnh đóng gói zip nộp bài.

3. **[SHADCN_DOMAIN_UI_DESIGN_GUIDE.md](file:///c:/Users/HPPAVILION/Documents/IT/Demo/PE-SDN/SHADCN_DOMAIN_UI_DESIGN_GUIDE.md)**:
   - **Mục đích:** Nhận diện lĩnh vực của đề thi (Finance/Expense, F&B/Culinary, E-commerce/Product, Medical, Task Management...) để áp dụng bảng màu Semantic Tokens và bố cục 2 cột (35% Form - 65% Filters & List) thẩm mỹ cao, chuẩn Anti-Slop.

---

## ⚡ QUY TRÌNH 5 BƯỚC THỰC THI TỰ ĐỘNG KHI NHẬN ĐỀ THI

Khi người dùng dán nội dung đề thi hoặc yêu cầu làm đề:

```
[Nhận Đề Thi]
      │
      ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 1: BÓC TÁCH REQUIREMENT (Theo Requirement Guide)  │
│ - Tên Thực thể (Expense, ReadingLog, Product, Task...)  │
│ - Tên Cookie phiên (session_token, token...) theo đề   │
│ - Route cần bảo vệ (/expenses, /reading-logs...)       │
│ - Bảng trường dữ liệu (Types, Required, Min/Max)       │
│ - Bảng `data-testid` bắt buộc cho từng Input/Button    │
│ - Danh sách Exact Error Message Strings                │
│ - Thứ tự ưu tiên tie-break của 5 danh mục              │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 2: CẬP NHẬT DATABASE SCHEMA & PRISMA              │
│ - Cập nhật model trong `prisma/schema.prisma`          │
│ - Thiết lập quan hệ 1-N với User (`userId`, Cascade)   │
│ - Cập nhật file `prisma/migrations/20261106000000_init/│
│   migration.sql`                                       │
│ - Chạy lệnh đồng bộ: `npx prisma db push --force-reset`│
│   và `npx prisma generate`                             │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 3: DỰNG MODULE BACKEND & VALIDATION               │
│ - `features/<entity>/validations/<entity>.schema.ts`   │
│   (Chống Timezone Bug lúc rạng sáng 00:00 - 07:00 VN)  │
│ - `features/<entity>/server/<entity>.repository.ts`    │
│ - `features/<entity>/server/<entity>.service.ts`       │
│   (Bắt mã lỗi 409 Conflict, serialize Date YYYY-MM-DD, │
│    sắp xếp Breakdown tie-break theo danh mục)          │
│ - API Routes: `/api/<entities>`, `/api/<entities>/[id]`│
│   `/api/<entities>/summary`                            │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 4: DỰNG GIAO DIỆN CHUẨN ĐỀ THI                    │
│ - Bố cục 2 cột: Cột trái (Form 35%) - Cột phải (65%)   │
│ - Áp dụng Vibe & Palette theo `SHADCN_DOMAIN_UI...`    │
│ - Gắn 100% thuộc tính `data-testid` chuẩn xác          │
│ - Optimistic UI cho Star và Delete (0ms phản hồi)      │
│ - Hỗ trợ aria-pressed="true"/"false" trên nút Star     │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 5: AUDIT, KIỂM THỬ TỰ ĐỘNG & ĐÓNG GÓI BÀI THI     │
│ - Chạy `npx tsc --noEmit` & `npm run build` xác nhận   │
│   0 lỗi biên dịch.                                     │
│ - Rà soát lại bảng `data-testid` và mã lỗi HTTP.       │
│ - Đóng gói file `.zip` và tạo file `.docx` nộp bài.    │
└────────────────────────────────────────────────────────┘
```

---

## 🎯 BẢN ĐỒ LỆNH TẮT (QUICK SHORTCUTS DÀNH CHO USER)

Người dùng có thể gõ các lệnh ngắn sau để kích hoạt hành động tức thì:

- **`/analyze` hoặc `"phân tích đề"`**: Yêu cầu Agent đọc đề thi và xuất bảng bóc tách Thực thể + `data-testid` + Error strings + Tie-break order.
- **`/scaffold <Entity>`**: Yêu cầu Agent tự động dựng toàn bộ Backend, Validation, API và UI cho thực thể `<Entity>` theo boilerplate.
- **`/audit` hoặc `"kiểm tra bài"`**: Rà soát lại toàn bộ testid, timezone validation, mã lỗi 409, date format và chạy `npm run build`.
- **`/pack <MãSV>`**: Tự động nén toàn bộ mã nguồn ra file `<MãSV>.zip` (sạch 100% không rác) và tạo sẵn mẫu file Word `<MãSV>.docx` để sẵn sàng nộp bài.
