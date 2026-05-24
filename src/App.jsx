import React, { useState } from 'react';
import ConfigPanel from './components/ConfigPanel';
import CalendarPreview from './components/CalendarPreview';

// Đưa mảng màu ra ngoài cùng hoặc giữ trong App
export const GOOGLE_COLORS = [
  { id: '1', hex: '#7986cb', name: 'Lavender' },
  { id: '2', hex: '#33b679', name: 'Sage' },
  { id: '3', hex: '#8e24aa', name: 'Grape' },
  { id: '4', hex: '#e67c73', name: 'Flamingo' },
  { id: '5', hex: '#f6c026', name: 'Banana' },
  { id: '6', hex: '#f5511d', name: 'Tangerine' },
  { id: '7', hex: '#039be5', name: 'Peacock' },
  { id: '8', hex: '#616161', name: 'Graphite' },
  { id: '9', hex: '#3f51b5', name: 'Blueberry' },
  { id: '10', hex: '#0b8043', name: 'Basil' },
  { id: '11', hex: '#d50000', name: 'Tomato' },
];

export default function CalendarPage() {
  // --- QUẢN LÝ STATE MÀU SẮC TẠI COMPONENT CHA ---
  const [colorMode, setColorMode] = useState('random'); 
  const [selectedColorId, setSelectedColorId] = useState('11'); 

  // Hàm tạo ra 7 màu ngẫu nhiên KHÔNG TRÙNG NHAU
  const generateRandomColors = () => {
    // 1. Tạo một bản sao của mảng 11 màu (để không làm hỏng mảng gốc)
    const availableColors = [...GOOGLE_COLORS];
    const selectedColors = [];

    // 2. Lặp 7 lần để bốc ra 7 màu cho 7 ngày
    for (let i = 0; i < 7; i++) {
      // Tìm một vị trí ngẫu nhiên trong số các màu ĐANG CÒN LẠI
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      
      // Lấy màu đó ra và đồng thời XÓA nó khỏi mảng availableColors (dùng splice)
      const pickedColor = availableColors.splice(randomIndex, 1)[0];
      
      // Đẩy mã hex của màu vừa bốc vào mảng kết quả
      selectedColors.push(pickedColor.hex);
    }

    return selectedColors;
  };

  // State lưu 7 màu random hiện tại
  const [randomColors, setRandomColors] = useState(generateRandomColors());

  // Tính toán mảng 7 màu cuối cùng để gửi cho Preview
  // Nếu mode là 'single' -> copy màu đang chọn thành 7 phần tử giống nhau
  // Nếu mode là 'random' -> lấy mảng randomColors
  const previewColors = colorMode === 'single'
    ? Array(7).fill(GOOGLE_COLORS.find(c => c.id === selectedColorId)?.hex || '#d50000')
    : randomColors;

  // Hàm xử lý khi user bấm nút "Random"
  const handleRandomize = () => {
    setColorMode('random');
    setRandomColors(generateRandomColors());
  };

  
  return (
    <div className="max-h-screen bg-white flex items-center justify-center rounded-2xl p-6">
      <div className="h-[80vh] overflow-y-auto flex flex-col md:flex-row w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        
        {/* Truyền các state và hàm xuống ConfigPanel */}
        <ConfigPanel 
          colorMode={colorMode}
          setColorMode={setColorMode}
          selectedColorId={selectedColorId}
          setSelectedColorId={setSelectedColorId}
          onRandomize={handleRandomize}
          colorList={previewColors}
        />
        
        {/* Truyền mảng 7 màu (hex) xuống CalendarPreview */}
        <CalendarPreview previewColors={previewColors} />

      </div>
    </div>
  );
}