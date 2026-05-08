import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { UploadCloud, File, Image as ImageIcon, FileText, Trash2, Download, AlertCircle } from 'lucide-react';

export default function Documents() {
  const { documents, addDocument, deleteDocument, userEmail } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" vượt quá kích thước 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        let type = 'other';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type === 'application/pdf') type = 'pdf';
        else if (file.type.includes('word') || file.type.includes('document')) type = 'doc';

        addDocument({
          id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
          name: file.name,
          type,
          size: file.size,
          dataUrl,
          uploadedAt: new Date().toISOString(),
          uploader: userEmail || 'Admin'
        });
      };
      reader.onerror = () => {
        setError(`Không thể đọc file "${file.name}".`);
      };
      reader.readAsDataURL(file);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc': return <FileText className="w-8 h-8 text-blue-700" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UploadCloud className="text-blue-600" /> Kho tài liệu
        </h2>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 cursor-pointer">
          <UploadCloud className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 cursor-pointer">Kéo thả file vào đây</h3>
        <p className="text-gray-500 text-sm mb-4">hoặc click để chọn file từ thiết bị của bạn</p>
        <p className="text-xs text-gray-400">Hỗ trợ: Hình ảnh, PDF, Word (Max 2MB/file)</p>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">Tài liệu đã tải lên ({documents.length})</h3>
        </div>
        
        {documents.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <File className="w-12 h-12 text-gray-300 mb-3" />
            <p>Chưa có tài liệu nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map(doc => (
              <div key={doc.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                  {doc.type === 'image' && doc.dataUrl ? (
                    <img src={doc.dataUrl} alt={doc.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    getFileIcon(doc.type)
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{doc.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{formatSize(doc.size)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>Bởi: {doc.uploader}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{new Date(doc.uploadedAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <a 
                    href={doc.dataUrl} 
                    download={doc.name}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Tải xuống"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => deleteDocument(doc.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
