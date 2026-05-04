import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  GraduationCap, 
  Trophy, 
  Star, 
  FileBox, 
  Menu,
  Atom,
  BarChart,
  CalendarDays,
  Target,
  Gift
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tổng quan' },
  { path: '/teachers', icon: Users, label: 'Giáo viên' },
  { path: '/teacher-achievements', icon: Award, label: 'Thành tích GV' },
  { path: '/teacher-birthdays', icon: Gift, label: 'Sinh nhật Giáo viên' },
  { path: '/students', icon: GraduationCap, label: 'Học sinh' },
  { path: '/student-achievements', icon: Trophy, label: 'Thành tích HS' },
  { path: '/mentorships', icon: Target, label: 'Mentor & Hướng dẫn' },
  { path: '/hall-of-fame', icon: Star, label: 'Bảng vàng' },
  { path: '/schedule', icon: CalendarDays, label: 'Lịch làm việc' },
  { path: '/reports', icon: FileBox, label: 'Báo cáo' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const activeLabel = navItems.find((item) => item.path === location.pathname)?.label || 'Chi tiết';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1E40AF] text-white flex-shrink-0 relative sticky top-0 md:h-screen overflow-y-auto">
        <div className="p-4 md:p-6 flex items-center gap-3 border-b border-blue-800">
          <Atom className="w-8 h-8 text-yellow-300" />
          <div>
            <h1 className="font-bold text-lg tracking-wide leading-tight">TỔ KHOA HỌC TỰ NHIÊN</h1>
          </div>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  isActive ? "bg-white/10 text-white font-semibold" : "text-blue-200 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">{activeLabel}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              AD
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold">Admin Quản lý</p>
              <p className="text-xs text-gray-500">Tổ trưởng</p>
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
