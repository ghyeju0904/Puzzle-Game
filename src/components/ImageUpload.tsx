// @ts-ignore
import React, { useRef, useState } from 'react';
// @ts-ignore
import { motion } from 'framer-motion';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  selectedImage: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileSelect = (file: File): void => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    } else {
      alert('이미지 파일만 업로드 가능합니다.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedImage ? (
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-600">
              이미지가 선택되었습니다. 다른 이미지를 선택하려면 클릭하세요.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">📸</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                사진을 업로드하세요
              </p>
              <p className="text-sm text-gray-500 mt-2">
                클릭하거나 이미지를 여기로 드래그하세요
              </p>
            </div>
          </div>
        )}

        {isDragging && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-lg flex items-center justify-center">
            <p className="text-blue-600 font-medium">이미지를 여기에 놓으세요</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageUpload; 