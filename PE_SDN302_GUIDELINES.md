# 🏆 CẨM NANG KỸ THUẬT & QUY TẮC CỐT LÕI PE SDN302
> **Mục tiêu:** Tài liệu kỹ thuật thực chiến đồng bộ 100% với cấu trúc thư mục hiện tại của dự án. Loại bỏ hoàn toàn các thư viện nặng nề (Three.js, Canvas, GSAP, Radix UI), tập trung vào bố cục 2 cột chuẩn thi và 5 bài học xương máu xử lý lỗi.

---

## 📁 1. CẤU TRÚC CHUẨN ĐỒNG BỘ 100% CỦA DỰ ÁN

Toàn bộ dự án tuân thủ cấu trúc phân tầng rõ ràng (Clean Architecture):

```text
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx           # Bố cục 2 cột (Form 35% - Filters & List 65%)
│   │   ├── <items>/page.tsx             # Alias trỏ về Dashboard
│   │   └── layout.tsx                   # Bọc <EntityProvider> & Header Navbar
│   ├── api/
│   │   ├── auth/                        # Cố định mọi đề: login, register, logout, me
│   │   └── <items>/                     # CRUD Endpoints theo đề thi
│   │       ├── route.ts                 # GET (lọc/tìm) & POST (tạo mới + bắt 409)
│   │       ├── summary/route.ts         # GET: Thống kê số lượng, tổng tiền, breakdown
│   │       └── [id]/
│   │           ├── route.ts             # GET chi tiết, PUT cập nhật, DELETE xóa (0ms)
│   │           └── star/route.ts        # PATCH: Bật/tắt trạng thái Star (0ms)
│   ├── login/page.tsx                   # Trang Đăng nhập chuẩn
│   └── register/page.tsx                # Trang Đăng ký chuẩn
├── features/<entity>/                   # Generic Entity Engine (Cắm & Chạy)
│   ├── types.ts                         # Interface, DTOs & FilterParams
│   ├── validations/<entity>.schema.ts   # Chống Timezone Bug (00:00 - 07:00 VN)
│   ├── server/
│   │   ├── <entity>.repository.ts       # Tầng Prisma (findMany, duplicateCheck, CRUD)
│   │   └── <entity>.service.ts          # Tầng nghiệp vụ (Validate, bắt lỗi 409, 404)
│   ├── context/<entity>Context.tsx      # Quản lý State & Optimistic UI (0ms Star/Delete)
│   ├── components/
│   │   ├── <Entity>Form.tsx             # Form thêm mới (Title, Amount, Category, Date, Note)
│   │   ├── <Entity>Filters.tsx          # Thanh lọc Search, Category, Star/Status
│   │   ├── <Entity>Summary.tsx          # 4 Thẻ Cards thống kê + Breakdown badges
│   │   ├── <Entity>Row.tsx              # Từng dòng bản ghi (Nút Star & Delete)
│   │   └── <Entity>List.tsx             # Container danh sách & Empty state
│   └── index.ts                         # Barrel export
├── lib/
│   ├── auth.ts                          # JWT Token 0ms (In-Memory verify từ session_token Cookie)
│   ├── prisma.ts                        # Singleton Prisma Client
│   └── utils.ts                         # cn() helper, formatCurrency, formatDate
├── components.json                      # Cấu hình ShadCN UI bắt buộc
├── prisma/schema.prisma                 # Model User & Entity (Quan hệ 1-N, Cascade)
└── proxy.ts                             # Route Protection Proxy chuẩn Next.js 16
```

---

## 🖥️ 2. BỐ CỤC 2 CỘT CHUẨN ĐỀ THI (`app/(dashboard)/dashboard/page.tsx`)

Bố cục phân bổ chuẩn tỉ lệ vàng giúp màn hình gọn gàng, bot chấm thi click chính xác:

```tsx
// app/(dashboard)/dashboard/page.tsx
'use client'

import React from 'react'
import {
  ItemForm,
  ItemFilters,
  ItemList,
  ItemSummary,
} from '@/features/items'

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. KHỐI THỐNG KÊ SUMMARY TRÊN CÙNG */}
      <section data-testid="summary-section">
        <ItemSummary />
      </section>

      {/* 2. BỐ CỤC 2 CỘT: TRÁI 35% - PHẢI 65% */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột trái (Form 35%): lg:col-span-4 & sticky */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <ItemForm />
        </div>

        {/* Cột phải (Filters & List 65%): lg:col-span-8 */}
        <div className="lg:col-span-8 space-y-6">
          <ItemFilters />
          <ItemList />
        </div>
      </section>
    </div>
  )
}
```

---

## ⚡ 3. NĂM BÀI HỌC XƯƠNG MÁU TỪ THỰC CHIẾN (KÈM CODE CHUẨN)

### Bài Học 1: Xử Lý Lỗi Lệch Múi Giờ Rạng Sáng (Timezone Bug)
- **Vấn đề:** Khi thi hoặc chấm thi vào ban đêm/rạng sáng (00:00 - 07:00 VN), máy chủ UTC vẫn ở ngày hôm trước. Nếu dùng `new Date().toISOString()`, hệ thống sẽ coi ngày hôm nay ở VN là "ngày trong tương lai" và quăng lỗi đỏ: `Date cannot be in the future`.
- **Code chuẩn trong `features/<entity>/validations/<entity>.schema.ts`:**
```ts
export function validateDate(dateStr?: string): { isValid: boolean; error?: string } {
  if (!dateStr || !dateStr.trim()) {
    return { isValid: false, error: 'Date is required' }
  }

  const trimmed = dateStr.trim().split('T')[0]
  const parsed = new Date(trimmed + 'T00:00:00.000Z')
  if (isNaN(parsed.getTime())) {
    return { isValid: false, error: 'Invalid date format' }
  }

  // Khắc phục Timezone Bug: Lấy mốc lớn nhất giữa Giờ máy tính (Local) và Giờ Server (UTC)
  const now = new Date()
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const utcToday = now.toISOString().split('T')[0]
  const maxToday = localToday > utcToday ? localToday : utcToday

  if (trimmed > maxToday) {
    return { isValid: false, error: 'Date cannot be in the future' }
  }

  return { isValid: true }
}
```

---

### Bài Học 2: Bảo Vệ Route Chuẩn Next.js 16 (`proxy.ts`)
- **Vấn đề:** Next.js 16 đã bẻ gãy quy ước cũ, không dùng `middleware.ts`. Nếu để cả 2 file `middleware.ts` và `proxy.ts`, Next.js 16 sẽ báo lỗi build đỏ lòm: `Both middleware file and proxy file are detected. Please use ./proxy.ts only`.
- **Tùy biến Cookie & Route theo đề:** Đọc tên cookie từ Mục 2.3 của đề bài (ví dụ `session_token` hoặc `token`). Cấu hình đường dẫn bảo vệ trong `proxy.ts` trỏ đúng về trang nghiệp vụ của đề (ví dụ `/<entities>` hoặc `/dashboard`).
- **Code chuẩn tại thư mục gốc `proxy.ts`:**
```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const { pathname } = request.nextUrl

  // Danh sách route công khai
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isPublicApi = pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')

  // Chưa đăng nhập mà truy cập trang bảo vệ -> Về /login
  if (!token && !isAuthPage && !isPublicApi && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Đã đăng nhập mà vào lại /login hoặc /register -> Về /dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

### Bài Học 3: Bắt Trùng Lặp Chuẩn HTTP `409 Conflict`
- **Vấn đề:** Đề thi PE luôn yêu cầu kiểm tra trùng lặp: Cùng User, Cùng Tên (không phân biệt hoa thường), Cùng Số tiền/Giá trị, Cùng trong 1 Ngày ➔ Bắt buộc trả về HTTP `409 Conflict` (không được trả `400` hay `500`).
- **Code chuẩn trong `features/<entity>/server/<entity>.service.ts`:**
```ts
// 1. Repository: Quét bản ghi trùng lặp trong cả ngày
static async findDuplicate(userId: string, title: string, amount: number, spentAt: Date) {
  const startOfDay = new Date(spentAt)
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date(spentAt)
  endOfDay.setUTCHours(23, 59, 59, 999)

  return prisma.item.findFirst({
    where: {
      userId,
      title: { equals: title.trim(), mode: 'insensitive' },
      amount,
      spentAt: { gte: startOfDay, lte: endOfDay },
    },
  })
}

// 2. Service: Ném lỗi có statusCode = 409
const duplicate = await ItemRepository.findDuplicate(userId, dto.title, amount, spentDate)
if (duplicate) {
  const err: any = new Error('Duplicate entry: an item with the same title, amount, and date already exists')
  err.statusCode = 409
  throw err
}
```

---

### Bài Học 4: Tối Ưu Độ Trễ 0ms (In-Memory Auth & Optimistic UI)
- **Vấn đề:** Server Supabase ở Singapore/Ấn Độ có thể mất 500ms - 1000ms cho mỗi roundtrip mạng. Nếu mỗi request API lại query database để check user, hệ thống sẽ cực kỳ chậm.
- **Giải pháp 1 (Auth 0ms trong `lib/auth.ts`):** Verify JWT trực tiếp từ Cookie, lấy ngay `{ id, email }` trong RAM mà không cần gọi lại Database:
```ts
export async function getAuthenticatedUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
```
- **Giải pháp 2 (Optimistic UI trong `context/<entity>Context.tsx`):** Thao tác Star và Delete cập nhật UI ngay lập tức trong 0ms, sau đó gọi ngầm API. Nếu lỗi thì tự động khôi phục lại state cũ:
```ts
// Optimistic Star (0ms)
const toggleStar = async (id: string) => {
  const prevItems = [...items]
  setItems((prev) => prev.map((it) => (it.id === id ? { ...it, starred: !it.starred } : it)))

  try {
    const res = await fetch(`/api/items/${id}/star`, { method: 'PATCH' })
    if (!res.ok) setItems(prevItems)
  } catch {
    setItems(prevItems)
  }
}
```
> [!NOTE]
> Riêng thao tác **Add Form**, **KHÔNG DÙNG Optimistic** vì cần chờ Server phản hồi mã `409 Duplicate` để hiển thị đúng thông báo lỗi cho bot chấm bài.

---

### Bài Học 5: Phòng Ngừa Xung Đột Extension & Khóa File Trên Windows
1. **Lỗi extension chèn thuộc tính (`bis_skin_checked="1"`, `M_ID`):**
   - Luôn thêm `suppressHydrationWarning` vào thẻ `<html>` và `<body>` trong `app/layout.tsx`.
   - **Quy tắc vàng:** Luôn mở cửa sổ **Ẩn danh (Incognito: `Ctrl + Shift + N`)** để chạy thử hoặc quay video chấm thi.
2. **Lỗi khóa file Windows (`EPERM rename query_engine.dll`):**
   - Khi chạy `npx prisma db push` hoặc `npm run build`, hãy dừng terminal đang chạy `npm run dev` (`Ctrl + C`) để giải phóng file `.dll` của Prisma.

---

## 📋 4. CHECKLIST 5 PHÚT TRƯỚC KHI NỘP BÀI THI

- [ ] **Kiểm tra biên dịch:** Chạy `npx tsc --noEmit` & `npm run build` xác nhận `Compiled successfully` với 0 lỗi.
- [ ] **Kiểm tra biến môi trường:** File `.env` chứa đúng 3 biến (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`).
- [ ] **Bảo toàn `data-testid`:** Rà soát lại Form, Buttons, Inputs, List, Cards theo bảng đặc tả trong `PE_SDN302_REQUIREMENT_ANALYSIS_GUIDE.md`.
- [ ] **Đóng gói file ZIP nộp bài:**
  - Bắt buộc xóa thư mục `node_modules/` và `.next/`.
  - Giữ lại mã nguồn, thư mục `prisma/`, và file `.env.example`.
