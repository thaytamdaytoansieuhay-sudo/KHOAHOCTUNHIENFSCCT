import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  switch (subject) {
    case "Toán": return "bg-blue-600 text-white";
    case "Vật Lý": return "bg-purple-600 text-white";
    case "Hóa học": return "bg-orange-600 text-white";
    case "Sinh học": return "bg-green-600 text-white";
    case "Tin học": return "bg-red-600 text-white";
    case "Robotics": return "bg-teal-600 text-white";
    default: return "bg-gray-600 text-white";
  }
};

export const getLevelColor = (level: string) => {
  switch (level) {
    case "Quốc tế": return "bg-yellow-400 text-yellow-900";
    case "Quốc gia": return "bg-red-600 text-white";
    case "Tỉnh/Thành phố": return "bg-blue-600 text-white";
    case "Quận/Huyện": return "bg-green-600 text-white";
    case "Trường": return "bg-gray-500 text-white";
    default: return "bg-gray-200 text-gray-800";
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
