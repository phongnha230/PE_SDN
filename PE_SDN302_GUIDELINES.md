# 🏆 CẨM NANG KỸ THUẬT & QUY TẮC CỐT LÕI PE SDN302
> **Mục tiêu:** Tài liệu kỹ thuật thực chiến đồng bộ 100% với cấu trúc thư mục hiện tại của dự án. Loại bỏ hoàn toàn các thư viện nặng nề (Three.js, Canvas, GSAP, Radix UI), tập trung vào bố cục 2 cột chuẩn thi và 5 bài học xương máu xử lý lỗi.
> **Nguyên tắc sống còn:** Bắt đúng 100% mã lỗi HTTP (`401`, `400`, `404`, `409`), format đúng chuỗi ngày (`YYYY-MM-DD`), và tuân thủ chặt chẽ route chuẩn của đề.

---

## 📁 1. CẤU TRÚC CHUẨN ĐỒNG BỘ 100% CỦA DỰ ÁN

Toàn bộ dự án tuân thủ cấu trúc phân tầng rõ ràng (Clean Architecture):

```text
├── app/
│   ├── (dashboard)/
│   │   ├── <entities>/page.tsx          # Route chính theo đề (VD: /expenses, /reading-logs)
│   │   └── layout.tsx                   # Bọc <EntityProvider> & Header Navbar
│   ├── api/
│   │   ├── auth/                        # Cố định mọi đề: login, register, logout, me
│   │   └── <entities>/                  # CRUD Endpoints theo đề thi
│   │       ├── route.ts                 # GET (lọc/tìm) & POST (tạo mới + bắt 409)
│   │       ├── summary/route.ts         # GET: Thống kê số lượng, tổng, breakdown (có tie-break)
│   │       └── [id]/
│   │           └── route.ts             # PATCH (đổi star hoặc sửa field), DELETE (xóa bản ghi)
│   ├── login/page.tsx                   # Trang Đăng nhập chuẩn
│   ├── register/page.tsx                # Trang Đăng ký chuẩn
│   └── page.tsx                         # Trang chủ Home (home-title, 3 cards, public)
├── features/<entity>/                   # Generic Entity Engine (Cắm & Chạy)
│   ├── types.ts                         # Interface, DTOs & FilterParams
│   ├── validations/<entity>.schema.ts   # Chống Timezone Bug (00:00 - 07:00 VN)
│   ├── server/
│   │   ├── <entity>.repository.ts       # Tầng Prisma (findMany, duplicateCheck, CRUD)
│   │   └── <entity>.service.ts          # Tầng nghiệp vụ (Validate, bắt lỗi 409, 404, serialize date)
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

## 🖥️ 2. BỐ CỤC 2 CỘT CHUẨN ĐỀ THI (`app/(dashboard)/<entities>/page.tsx`)

Bố cục phân bổ chuẩn tỉ lệ vàng giúp màn hình gọn gàng, bot chấm thi click chính xác:

```tsx
// app/(dashboard)/expenses/page.tsx (hoặc reading-logs/page.tsx)
'use client'

import React from 'react'
import {
  EntityForm,
  EntityFilters,
  EntityList,
  EntitySummary,
} from '@/features/<entity>'

export default function EntityDashboardPage() {
  return (
    <div data-testid="expenses-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. KHỐI THỐNG KÊ SUMMARY TRÊN CÙNG */}
      <section data-testid="summary-section">
        <EntitySummary />
      </section>

      {/* 2. BỐ CỤC 2 CỘT: TRÁI 35% - PHẢI 65% */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột trái (Form 35%): lg:col-span-4 & sticky */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <EntityForm />
        </div>

        {/* Cột phải (Filters & List 65%): lg:col-span-8 */}
        <div className="lg:col-span-8 space-y-6">
          <EntityFilters />
          <EntityList />
        </div>
      </section>
    </div>
  )
}
```

---

## ⚡ 3. SÁU BÀI HỌC XƯƠNG MÁU TỪ THỰC CHIẾN (KÈM CODE CHUẨN)

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
- **Tùy biến Cookie & Route theo đề:** Đọc tên cookie từ Mục 2.3 của đề bài (ví dụ `session_token` hoặc `token`). Cấu hình đường dẫn bảo vệ trong `proxy.ts` trỏ đúng về trang nghiệp vụ của đề (ví dụ `/expenses` hoặc `/reading-logs`).
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

  // Chưa đăng nhập mà truy cập trang bảo vệ hoặc API bảo vệ -> Trả 401 cho API, redirect về /login cho Web
  if (!token && !isAuthPage && !isPublicApi && pathname !== '/') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Đã đăng nhập mà vào lại /login hoặc /register -> Về trang chính của thực thể (VD: /expenses)
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/expenses', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

### Bài Học 3: Bắt Trùng Lặp Chuẩn HTTP `409 Conflict` (Cả POST lẫn PATCH)
- **Vấn đề:** Đề thi PE luôn yêu cầu kiểm tra trùng lặp: Cùng User, Cùng Tên (không phân biệt hoa thường), Cùng Số tiền/Phút, Cùng trong 1 Ngày ➔ Bắt buộc trả về HTTP `409 Conflict` (không được trả `400` hay `500`).
- **Code chuẩn trong `features/<entity>/server/<entity>.service.ts`:**
```ts
// 1. Repository: Quét bản ghi trùng lặp trong cả ngày (bỏ qua id hiện tại nếu đang PATCH)
static async findDuplicate(userId: string, title: string, amount: number, spentDate: Date, excludeId?: string) {
  const startOfDay = new Date(spentDate)
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date(spentDate)
  endOfDay.setUTCHours(23, 59, 59, 999)

  return prisma.expense.findFirst({
    where: {
      userId,
      title: { equals: title.trim(), mode: 'insensitive' },
      amount,
      spentAt: { gte: startOfDay, lte: endOfDay },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  })
}

// 2. Service: Ném lỗi có statusCode = 409
const duplicate = await ExpenseRepository.findDuplicate(userId, dto.title, amount, spentDate, currentId)
if (duplicate) {
  const err: any = new Error('Duplicate expense: an expense with the same title, amount and date already exists')
  err.statusCode = 409
  throw err
}
```

---

### Bài Học 4: Chuẩn Hóa Serialization JSON Date (BẮT BUỘC)
- **Vấn đề:** Đề thi so khớp JSON response. Trường `spentAt` / `readOn` phải là chuỗi `"YYYY-MM-DD"`, còn `createdAt` phải là full ISO string `"2026-10-20T08:15:00.000Z"`.
- **Hàm chuẩn hóa trong Service:**
```ts
export function formatExpenseResponse(item: any) {
  return {
    id: item.id,
    title: item.title,
    amount: item.amount,
    category: item.category,
    note: item.note || '',
    starred: item.starred,
    spentAt: item.spentAt instanceof Date ? item.spentAt.toISOString().split('T')[0] : String(item.spentAt).split('T')[0],
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : new Date(item.createdAt).toISOString(),
  }
}
```

---

### Bài Học 5: Thuật Toán Sắp Xếp & Tie-Breaking (List & Summary Breakdown)
- **1. Sắp xếp Danh sách chính (List):**
  - Ngày mới nhất lên đầu (`spentAt desc`).
  - Nếu trùng ngày, xếp theo `title` A-Z không phân biệt hoa thường (`title asc insensitive`).
- **2. Sắp xếp Summary Breakdown:**
  - Tổng số tiền / phút giảm dần (`total desc`).
  - Nếu tổng bằng nhau, xếp theo thứ tự ưu tiên danh mục được định nghĩa trong đề:
  ```ts
  const CATEGORY_ORDER = ['Food', 'Transport', 'Bills', 'Shopping', 'Other']
  breakdown.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total
    return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  })
  ```

---

### Bài Học 6: Tối Ưu Độ Trễ 0ms (In-Memory Auth & Optimistic UI)
- **Auth 0ms trong `lib/auth.ts`:** Verify JWT trực tiếp từ Cookie, lấy ngay `{ id, email }` trong RAM mà không cần gọi lại Database:
```ts
export async function getAuthenticatedUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
```
- **Optimistic Star & Delete trong `context/<entity>Context.tsx`:** Cập nhật UI ngay lập tức trong 0ms, sau đó gọi ngầm API:
```ts
// Đề thi yêu cầu gọi PATCH /api/expenses/:id với body { starred: !current }
const toggleStar = async (id: string) => {
  const target = items.find((it) => it.id === id)
  if (!target) return
  const newStarred = !target.starred
  const prevItems = [...items]

  setItems((prev) => prev.map((it) => (it.id === id ? { ...it, starred: newStarred } : it)))

  try {
    const res = await fetch(`/api/expenses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ starred: newStarred }),
    })
    if (!res.ok) setItems(prevItems)
  } catch {
    setItems(prevItems)
  }
}
```

---

## 📋 4. LỆNH ĐÓNG GÓI BÀI THI SIÊU TỐC TRONG 5 GIÂY (POWERSHELL)

Khi nộp bài, chỉ cần chạy lệnh PowerShell sau để tự động tạo file `.zip` sạch 100% không dính `node_modules`, `.next`, `.git`, `.env`:

```powershell
# Thay QE123456 bằng Mã Sinh Viên của bạn
$studentCode = "QE123456"
Get-ChildItem -Path . -Exclude "node_modules", ".next", ".git", ".env" | Compress-Archive -DestinationPath "$studentCode.zip" -Force
```
