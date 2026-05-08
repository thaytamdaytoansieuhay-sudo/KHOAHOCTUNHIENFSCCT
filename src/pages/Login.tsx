import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Atom, ShieldCheck, FileText, Users, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Mock login always successful for any email/password
      login(email);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Left Banner Section */}
      <div className="md:w-5/12 lg:w-1/2 bg-[#1E40AF] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-400 blur-[80px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Atom className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-wide leading-tight uppercase">Tổ Khoa Học Tự Nhiên</h1>
              <p className="text-xs text-orange-300 font-bold tracking-widest mt-1">TRƯỜNG THPT FPT CẦN THƠ</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Hệ thống Quản lý <br className="hidden md:block" />
              <span className="text-orange-400">Hồ sơ Giáo viên</span>
            </h2>
            <p className="text-blue-100 text-lg max-w-md leading-relaxed">
              Cổng thông tin nội bộ dành riêng cho Tổ trưởng chuyên môn và Ban Lãnh đạo hỗ trợ quản lý nhân sự, thành tích và đánh giá năng lực giáo viên một cách toàn diện.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 space-y-4">
          <div className="flex items-center gap-4 text-blue-100">
            <div className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center border border-blue-700/50">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
            <p className="font-medium">Quản lý danh sách & hồ sơ cán bộ</p>
          </div>
          <div className="flex items-center gap-4 text-blue-100">
            <div className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center border border-blue-700/50">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
            </div>
            <p className="font-medium">Lưu trữ thành tích & sáng kiến</p>
          </div>
          <div className="flex items-center gap-4 text-blue-100">
            <div className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center border border-blue-700/50">
              <FileText className="w-5 h-5 text-orange-400" />
            </div>
            <p className="font-medium">Hệ thống báo cáo & biểu đồ trực quan</p>
          </div>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="md:w-7/12 lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50 relative">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập cổng</h3>
            <p className="text-gray-500">Vui lòng đăng nhập với tài khoản quản trị để tiếp tục</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Tổ trưởng / Quản trị</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] pl-4 pr-4 py-3 bg-gray-50 focus:bg-white transition"
                  placeholder="admin@thpt.edu.vn"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#1E40AF] focus:ring-[#1E40AF] pl-4 pr-4 py-3 bg-gray-50 focus:bg-white transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mt-4 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#1E40AF] focus:ring-[#1E40AF] w-4 h-4" />
                <span className="text-gray-600 font-medium">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-[#1E40AF] font-semibold hover:underline">Quên mật khẩu?</a>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1E40AF] text-white rounded-xl py-3.5 font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
            >
              Đăng nhập vào hệ thống
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-10">
            &copy; {new Date().getFullYear()} THPT FPT Cần Thơ. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
