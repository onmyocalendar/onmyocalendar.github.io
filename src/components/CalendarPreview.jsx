import React from 'react';

function CalendarPreview({ previewColors }) {
  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  const timeSlots = ['07:00..', '..10:00', '...', '18:00..', '..21:00'];

  return (
    <div className="w-full md:w-2/3 p-6 bg-white flex flex-col items-center justify-center">
      <h2 className="text-sm italic font-bold text-gray-500 mb-6 text-center">
        Lịch của bạn sẽ trông như thế này:
      </h2>

      <div className="grid grid-cols-8 gap-2 w-full max-w-3xl">
        
        {/* HÀNG TIÊU ĐỀ (Thứ) */}
        <div className="text-center font-bold text-sm text-gray-500 pb-2 border-b-2 border-gray-200">
          Giờ
        </div>
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center font-semibold text-sm text-gray-500 pb-2 border-b-2 border-gray-200">
            {day}
          </div>
        ))}

        {/* VÒNG LẶP RẢI CÁC HÀNG */}
        {timeSlots.map((time, timeIndex) => {
          const isBossRow = time === '07:00..' || time === '18:00..';
          const isMiddleRow = time === '...';

          return (
            <React.Fragment key={timeIndex}>
              
              {/* CỘT 1: Hiển thị mốc giờ */}
              <div className="flex items-center justify-center font-medium text-xs text-gray-500 bg-gray-100 rounded p-2 h-12">
                {time}
              </div>

              {/* 7 Ô NỘI DUNG TIẾP THEO CỦA HÀNG */}
              {daysOfWeek.map((_, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`font-medium rounded p-2 h-12 flex items-center justify-center text-xs transition-all duration-300
                    ${isMiddleRow ? 'bg-transparent text-gray-500' : 'text-white shadow-sm'}
                  `}
                  // Gắn inline-style backgroundColor để đổi màu động dựa theo mảng previewColors
                  style={!isMiddleRow ? { backgroundColor: previewColors[dayIndex] } : {}}
                >
                  {isBossRow ? 'Boss' : ''}
                </div>
              ))}

            </React.Fragment>
          );
        })}
        
      </div>
    </div>
  );
}

export default CalendarPreview;