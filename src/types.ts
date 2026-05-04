export type Subject = "Toán" | "Vật Lý" | "Hóa học" | "Sinh học" | "Tin học" | "Robotics";
export type TeacherRole = "Giáo viên" | "Trưởng bộ môn" | "Tổ trưởng" | "Tổ phó";
export type TeacherStatus = "Đang làm" | "Nghỉ phép" | "Đã nghỉ việc";
export type AchievementLevel = "Trường" | "Quận/Huyện" | "Tỉnh/Thành phố" | "Quốc gia" | "Quốc tế";

export type TeacherType = "Giáo viên cơ hữu" | "Giáo viên thỉnh giảng";

export interface TeacherStats {
  soHSGHuongDan: number; // số học sinh giỏi đã hướng dẫn
  soGiaiDatDuoc: number; // tổng số giải đạt được
  giaoChuanGioiNhat: string | AchievementLevel; // cấp độ cao nhất
  namHocNoiBat: string; // năm học tốt nhất
  tyleDatGiai: number; // % HS đạt giải
}

export interface BirthdayWish {
  id: string;
  teacherId: string;
  senderName: string;
  message: string;
  imageUrl?: string;
  date: string;
}

export interface Teacher {
  id: string;
  hoTen: string;
  bomon: Subject;
  chucVu: TeacherRole;
  email: string;
  soDienThoai: string;
  ngaySinh?: string;
  ngayVaoLam: string;
  loaiGiaoVien: TeacherType;
  trangThai: TeacherStatus;
  anhDaiDien: string;
  ghiChu: string;
  danhHieuNamHoc: string[];
  thanhTichBomon?: TeacherStats;
}

export type TeacherAchievementType = "Danh hiệu" | "Khen thưởng" | "Chứng chỉ" | "Sáng kiến cải tiến";

export interface TeacherAchievement {
  id: string;
  teacherId: string;
  loai: TeacherAchievementType;
  tenThanhTich: string;
  capDo: AchievementLevel;
  namHoc: string;
  moTa: string;
  ngayCap: string;
  donViCap: string;
}

export interface Student {
  id: string;
  hoTen: string;
  lop: string;
  bomon: Subject;
  gvcn: string; // Teacher name or ID
  ngaySinh: string;
}

export type StudentAchievementType = "Học sinh giỏi (HSG)" | "Học sinh xuất sắc" | "Olympic / Thi đấu" | "Cuộc thi sáng tạo" | "Robotics / Lập trình" | "Học bổng";

export interface StudentAchievement {
  id: string;
  studentId: string;
  loai: StudentAchievementType;
  tenGiai: string;
  capDo: AchievementLevel;
  namHoc: string;
  bomon: Subject;
  kyThi: string;
  gvcnHuongDan: string; // Teacher name
  moTa: string;
  ngayDat: string;
  diemSo?: number;
}

export type MentorshipStatus = "Đang hướng dẫn" | "Hoàn thành" | "Tạm dừng";

export interface Mentorship {
  id: string;
  teacherId: string;
  studentId: string;
  bomon: Subject;
  mucTieu: string;
  trangThai: MentorshipStatus;
  ngayBatDau: string;
  ngayKetThuc?: string;
  ketQua?: string;
  danhGiaGV?: string;
  danhGiaHS?: string;
  ghiChu?: string;
}

export type EventType = "Họp tổ" | "Dự giờ" | "Chuyên đề" | "Thi HSG" | "Nộp báo cáo" | "Sự kiện" | "Nghỉ lễ" | "Khác";
export type EventStatus = "Sắp diễn ra" | "Đã hoàn thành" | "Đã hủy";

export interface ScheduleEvent {
  id: string;
  tieuDe: string;
  loai: EventType;
  ngay: string; // YYYY-MM-DD
  gioBatDau: string; // HH:MM
  gioKetThuc: string; // HH:MM
  diaDiem: string;
  nguoiPhuTrach: string;
  thanhPhanThamDu: string[]; // array of strings (names or "Toàn tổ")
  moTa?: string;
  nhacNho?: number; // days before
  trangThai: EventStatus;
}
