# Components Structure

## Shared Components (`/shared`)
Các component có thể tái sử dụng trong toàn bộ ứng dụng.

### KPICard
Hiển thị các chỉ số KPI quan trọng với icon, giá trị, delta và mô tả.

**Props:**
- `title`: Tiêu đề của KPI
- `value`: Giá trị hiển thị
- `delta`: Thay đổi so với kỳ trước (VD: "+12%")
- `tone`: Màu sắc ("success", "error", "info", "warning")
- `icon`: React icon component
- `description`: Mô tả bổ sung

### MetricCard
Hiển thị các chỉ số phụ trợ với icon và màu sắc.

**Props:**
- `title`: Tiêu đề
- `value`: Giá trị
- `icon`: React icon component
- `color`: Màu sắc text (VD: "text-success")

### QuickActionButton
Nút thao tác nhanh với icon, tiêu đề và mô tả.

**Props:**
- `icon`: React icon component
- `title`: Tiêu đề nút
- `description`: Mô tả
- `color`: Màu nền (VD: "bg-primary-main")
- `onClick`: Callback khi click

### ModuleCard
Card hiển thị thông tin module với stats và actions.

**Props:**
- `title`: Tiêu đề module
- `icon`: React icon component
- `color`: Màu nền icon
- `stats`: Array các object {label, value}
- `actions`: Array các string action
- `onActionClick`: Callback khi click action

### ActivityItem
Item hiển thị hoạt động gần đây.

**Props:**
- `icon`: React icon component
- `title`: Tiêu đề hoạt động
- `time`: Thời gian
- `type`: Loại hoạt động ("success", "info", "warning", "error")
- `onClick`: Callback khi click

### ChartPlaceholder
Placeholder cho biểu đồ với khả năng tùy chỉnh.

**Props:**
- `title`: Tiêu đề biểu đồ
- `icon`: React icon component
- `description`: Mô tả placeholder
- `height`: Chiều cao (VD: "h-64")
- `showFilters`: Hiển thị nút filter

## Dashboard Components (`/dashboard`)
Các component chuyên biệt cho dashboard.

### QuickActions
Component chứa các thao tác nhanh.

**Props:**
- `onActionClick`: Callback khi click action

### ModuleOverview
Component hiển thị tổng quan các module.

**Props:**
- `onModuleAction`: Callback khi click action trong module

### RecentActivities
Component hiển thị hoạt động gần đây.

**Props:**
- `activities`: Array các hoạt động (optional, có default)
- `onActivityClick`: Callback khi click activity

## Layout Components (`/layouts`)
Các component layout chính.

### MainLayout
Layout chính chứa Header, Sidebar và content.

### Header
Header component với search, notifications và profile.

### Sidebar
Sidebar navigation với các menu items.

### StatCard
Card hiển thị thống kê (legacy component).

## Usage Example

```jsx
import { KPICard, MetricCard } from '../components/shared';
import { QuickActions, ModuleOverview } from '../components/dashboard';

function MyPage() {
  return (
    <div>
      <KPICard
        title="Total Users"
        value="1,247"
        delta="+12%"
        tone="success"
        icon={<Users />}
        description="So với tháng trước"
      />
      
      <QuickActions onActionClick={handleAction} />
    </div>
  );
}
```
