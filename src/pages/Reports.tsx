import { useStore } from '../store/useStore';
import { Download, FileText, Printer } from 'lucide-react';

export default function Reports() {
  const { teachers, students, teacherAchievements, studentAchievements } = useStore();

  const exportCSV = (filename: string, headers: string[], data: any[]) => {
    // Add BOM for Excel UTF-8 support
    const BOM = '\\uFEFF';
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\\n');

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const wnd = URL.createObjectURL(blob);
      link.setAttribute('href', wnd);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportTeachers = () => {
    const headers = ['ID', 'Họ Tên', 'Bộ Môn', 'Chức Vụ', 'Điện Thoại', 'Email', 'Trạng Thái', 'Giáo Viên', 'Ngày Vào Làm'];
    const data = teachers.map(t => [t.id, t.hoTen, t.bomon, t.chucVu, t.soDienThoai, t.email, t.trangThai, t.loaiGiaoVien, t.ngayVaoLam]);
    exportCSV('danh_sach_giao_vien.csv', headers, data);
  };

  const handleExportStudents = () => {
    const headers = ['ID', 'Họ Tên', 'Lớp', 'Bộ Môn', 'Ngày Sinh', 'GV Phụ Trách'];
    const data = students.map(s => {
      const gv = teachers.find(t => t.id === s.gvcn)?.hoTen || s.gvcn;
      return [s.id, s.hoTen, s.lop, s.bomon, s.ngaySinh, gv];
    });
    exportCSV('danh_sach_hoc_sinh.csv', headers, data);
  };

  const handleExportTeacherAchieve = () => {
    const headers = ['GV', 'Tên Thành Tích', 'Loại', 'Cấp Độ', 'Năm Học', 'Đơn Vị Cấp', 'Ngày Cấp'];
    const data = teacherAchievements.map(a => {
      const gv = teachers.find(t => t.id === a.teacherId)?.hoTen || '';
      return [gv, a.tenThanhTich, a.loai, a.capDo, a.namHoc, a.donViCap, a.ngayCap];
    });
    exportCSV('thanh_tich_gv.csv', headers, data);
  };

  const handleExportStudentAchieve = () => {
    const headers = ['Chủ nhân', 'Lớp', 'Tên Giải', 'Kỳ Thi', 'Bộ Môn', 'Loại', 'Cấp Độ', 'Năm Học', 'GV HD'];
    const data = studentAchievements.map(a => {
      const s = students.find(x => x.id === a.studentId);
      return [s?.hoTen, s?.lop, a.tenGiai, a.kyThi, a.bomon, a.loai, a.capDo, a.namHoc, a.gvcnHuongDan];
    });
    exportCSV('thanh_tich_hs.csv', headers, data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Báo Cáo & Xuất Dữ Liệu</h2>
          <p className="text-gray-500 mt-2">Xuất danh sách và thành tích ra file CSV (Mở tốt nhất bằng Excel, hỗ trợ tiếng Việt).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportCard 
            title="Danh sách Giáo Viên" 
            desc={`Tổng cộng ${teachers.length} giáo viên`} 
            onExport={handleExportTeachers} 
          />
          <ReportCard 
            title="Thành tích Giáo Viên" 
            desc={`Tổng cộng ${teacherAchievements.length} lượt vinh danh`} 
            onExport={handleExportTeacherAchieve} 
          />
          <ReportCard 
            title="Danh sách Học Sinh" 
            desc={`Tổng cộng ${students.length} học sinh tiêu biểu`} 
            onExport={handleExportStudents} 
          />
          <ReportCard 
            title="Thành tích Học Sinh" 
            desc={`Tổng cộng ${studentAchievements.length} danh hiệu/giải thưởng`} 
            onExport={handleExportStudentAchieve} 
          />
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">In Báo Cáo Tổng Hợp Đẹp</h3>
            <p className="text-sm text-gray-600 mt-1">Hệ thống sẽ chuyển sang chế độ layout bản in. (Ctrl + P)</p>
          </div>
          <button onClick={() => window.print()} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
            <Printer className="w-4 h-4" />
            In Báo Cáo
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, desc, onExport }: { title: string, desc: string, onExport: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors flex flex-col items-start">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 mb-4">
        <FileText className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 flex-1">{desc}</p>
      <button 
        onClick={onExport}
        className="w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors"
      >
        <Download className="w-4 h-4" />
        Xuất CSV
      </button>
    </div>
  );
}
