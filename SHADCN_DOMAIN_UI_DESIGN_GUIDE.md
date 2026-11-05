# 🎨 CẨM NANG THIẾT KẾ GIAO DIỆN THEO CHỦ ĐỀ NGÀNH NGHỀ (DOMAIN UI QUICK-PALETTE)
> **Mục tiêu:** Tra cứu nhanh bộ màu Tailwind (Màu nền trang, Màu thẻ Card, Nút bấm CTA, Badge) và bộ Icon `lucide-react` phù hợp với từng chủ đề đề thi PE (Tài chính, Ẩm thực, Sản phẩm, Nhiệm vụ, Đặt phòng, Y tế).
> **Nguyên tắc vàng:** Thay đổi phong cách và màu sắc trong **30 giây** nhưng **TUYỆT ĐỐI BẢO TOÀN 100% `data-testid`**.

---

## 🎯 1. BẢNG PHỐI MÀU TOÀN DIỆN (BACKGROUND + CARD + NÚT CTA + BADGE)

Khi nhận đề thi, chỉ cần xác định ngành nghề và copy cụm class Tailwind tương ứng áp dụng cho Trang (`layout.tsx`), Form (`<Entity>Form.tsx`) và Nút bấm:

| Ngành Nghề Đề Thi | Màu Nền Trang (Page Bg) | Nền Thẻ Card & Viền (Card & Border) | Nút Bấm Chính (CTA Button) | Badge & Tag Phân Loại | Bo Góc | Icon Tiêu Biểu (`lucide-react`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Finance / SaaS**<br>*(Expense, Budget, Invoice)* | `bg-slate-50 dark:bg-slate-950` | `bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800` | `bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100` | `bg-emerald-50 text-emerald-700 border-emerald-200` | `rounded-xl` | `DollarSign`, `Layers`, `TrendingUp`, `Receipt`, `Wallet` |
| **2. F&B / Culinary**<br>*(Food, Recipe, Menu, Order)* | `bg-stone-50 dark:bg-stone-950` | `bg-white border-stone-200 dark:bg-stone-900 dark:border-stone-800` | `bg-orange-600 hover:bg-orange-700 text-white shadow-orange-100` | `bg-amber-50 text-amber-800 border-amber-200` | `rounded-2xl` | `Utensils`, `Coffee`, `Flame`, `ShoppingBag`, `ChefHat` |
| **3. E-Commerce**<br>*(Product, Inventory, Stock)* | `bg-gray-50 dark:bg-gray-950` | `bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800` | `bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100` | `bg-violet-50 text-violet-700 border-violet-200` | `rounded-xl` | `Package`, `Tag`, `Barcode`, `ShoppingCart`, `Boxes` |
| **4. Tasks / Productivity**<br>*(Task, Todo, Project, Ticket)* | `bg-zinc-50 dark:bg-zinc-950` | `bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800` | `bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900` | `bg-cyan-50 text-cyan-800 border-cyan-200` | `rounded-lg` | `CheckSquare`, `Clock`, `Flag`, `AlertCircle`, `Calendar` |
| **5. Hospitality / Travel**<br>*(Booking, Hotel, Flight)* | `bg-teal-50/40 dark:bg-slate-950` | `bg-white border-teal-100 dark:bg-slate-900 dark:border-slate-800` | `bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100` | `bg-sky-50 text-sky-700 border-sky-200` | `rounded-2xl` | `Compass`, `MapPin`, `CalendarDays`, `Users`, `Plane` |
| **6. Healthcare / Medical**<br>*(Patient, Clinic, Medicine)* | `bg-sky-50/30 dark:bg-slate-950` | `bg-white border-sky-100 dark:bg-slate-900 dark:border-slate-800` | `bg-sky-600 hover:bg-sky-700 text-white shadow-sky-100` | `bg-rose-50 text-rose-700 border-rose-200` | `rounded-xl` | `HeartPulse`, `Activity`, `ShieldAlert`, `Stethoscope`, `Pill` |

---

## ⚡ 2. CÁCH ĐỔI NHANH TRONG 30 GIÂY

### Bước A: Đổi màu nền toàn trang trong `app/(dashboard)/layout.tsx`
Chỉ cần thay class `bg-...` của thẻ bao bọc ngoài cùng:
```tsx
// Ví dụ khi đề thi là Ẩm thực (F&B / Food):
<div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
  <Navbar />
  <main className="flex-1 pb-16">{children}</main>
</div>
```

### Bước B: Đổi màu nút bấm Submit trong `features/<entity>/components/<Entity>Form.tsx`
Thay class màu nền của thẻ `<button type="submit">`:
```tsx
// 1. Cho đề Finance:
className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm ..."

// 2. Cho đề F&B / Ẩm thực:
className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-2xl shadow-sm ..."

// 3. Cho đề Product / E-Commerce:
className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm ..."
```

### Bước C: Đổi màu Badge Category trong `features/<entity>/components/<Entity>Row.tsx`
```tsx
// Ẩm thực (F&B):
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
  <Utensils className="w-3 h-3" />
  {item.category}
</span>
```

---

## 📐 3. BỐ CỤC 2 CỘT CHUẨN MỌI ĐỀ THI (35% FORM - 65% LIST)

Mọi đề thi đều giữ vững tỉ lệ hiển thị này:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        THỐNG KÊ SUMMARY CARDS (100%)                   │
│  [ Total Count ]      [ Total Value ]      [ Starred ]      [ Average ]│
├───────────────────────────────────┬────────────────────────────────────┤
│           CỘT TRÁI (35%)          │            CỘT PHẢI (65%)          │
│                                   │                                    │
│   ┌───────────────────────────┐   │   ┌────────────────────────────┐   │
│   │     FORM THÊM MỚI         │   │   │  BỘ LỌC SEARCH & CATEGORY  │   │
│   │  - Title (Input)          │   │   └────────────────────────────┘   │
│   │  - Amount (Input)         │   │   ┌────────────────────────────┐   │
│   │  - Category (Select)      │   │   │  DANH SÁCH BẢN GHI (LIST)  │   │
│   │  - Date (Datepicker)      │   │   │  - Row 1 [Star] [Delete]   │   │
│   │  - Note (Textarea)        │   │   │  - Row 2 [Star] [Delete]   │   │
│   │  [ Button Submit ]        │   │   │  - Row 3 [Star] [Delete]   │   │
│   └───────────────────────────┘   │   └────────────────────────────┘   │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## ✨ 4. NGUYÊN TẮC THIẾT KẾ SỐNG CÒN

1. **Đổi màu sắc nhưng BẢO TOÀN 100% `data-testid`**:
   - Dù đổi từ `bg-indigo-600` sang `bg-orange-600` thì nút thêm vẫn phải giữ nguyên `data-testid="expense-form-submit-btn"` (hoặc `<entity>-form-submit-btn`).
2. **Cảm giác bấm vật lý (Tactile feedback):**
   - Luôn kèm `active:scale-[0.98] transition-transform` trên nút bấm để người chấm click thấy mượt mà.
3. **Độ tương phản chữ (Readable contrast):**
   - Nút nền đậm (`bg-*-600`, `bg-zinc-900`) luôn đi cùng chữ trắng `text-white`.
   - Nền nhạt (`bg-*-50`) luôn đi cùng chữ đậm (`text-*-700` hoặc `text-*-800`).
