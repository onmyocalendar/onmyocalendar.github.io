import React, { useState, useEffect} from 'react';
import { GOOGLE_COLORS } from '../App'; 

// Nhận các props từ Component Cha
export default function ConfigPanel({ colorMode, setColorMode, selectedColorId, setSelectedColorId, onRandomize, colorList}) {
  const [duration, setDuration] = useState('1');
  const [showColorPicker, setShowColorPicker] = useState(false); 

  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const [isLoading, setIsLoading] = useState(false);

  const durationOptions = [
    { value: '1', label: '1 tháng' },
    { value: '3', label: '3 tháng' },
    { value: '6', label: '6 tháng' },
    { value: '12', label: '1 năm' },
  ];

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  async function handleCreateSchedule(retried = false){
    setIsLoading(true);
    
    fetch("https://onmyocalendar-be-api.onrender.com/calendar/create-boss-schedule", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        "X-Refresh-Token": localStorage.getItem("refresh_token") || "",
      },
      body: JSON.stringify({
        "start_date": getTodayString(),
        "duration_months": parseInt(duration),
        "boss_colors": colorList,
      })
    })
    .then(res => {
      // BẮT RIÊNG LỖI 401 TỪ BACKEND
      if (res.status === 401) throw new Error("401"); 
      if (!res.ok) throw new Error("Lỗi hệ thống");
    })
    .then(async() => {
      await new Promise(resolve => {setTimeout(resolve, 25000)});
      alert("Đã tạo lịch thành công! Nếu lịch vẫn chưa xuất hiện, bạn hãy reload lại trang Google Calendar sau ít phút nhé");
    })
    .catch(async(error) => {
      console.error("Lỗi:", error);
      if (error.message === "401" && !retried) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('access_token'); 
        setIsLoggedIn(false);
        await handleLogin();
        await handleCreateSchedule(true);
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    })
    .finally(()=>{
      setIsLoading(false);
    });
  }

  async function handleLogin(){
    return new Promise((resolve) => {
      
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

     
      const popup = window.open(
        "https://onmyocalendar-be-api.onrender.com/auth/login",
        "Google Đăng Nhập",
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=no`
      );

      
      const handleMessage = (event) => {
        
        if (event.origin !== "https://onmyocalendar-be-api.onrender.com") return;
        if (event.data && event.data.access_token) {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("access_token", event.data.access_token);
          localStorage.setItem("refresh_token", event.data.refresh_token || "");
          
          window.removeEventListener("message", handleMessage);
          resolve(true);
        }
      };

      window.addEventListener("message", handleMessage);
    });
  }

  return (
    <div className="w-full md:w-1/3 bg-white text-slate-800 p-8 flex flex-col gap-8 border-r border-slate-100">
      <div className="w-full text-center">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          <span className='text-blue-800'>Onmyo</span>Calendar
        </h1>
        <p className="text-xs text-slate-500 mt-1 text-right italic">
          giúp bạn không còn phải đợi đến 6 giờ mới được biết buff nữa 🥀
        </p>
      </div>

      <div className="flex flex-col gap-6 grow">
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-semibold text-slate-700">
            Bạn muốn lịch trong bao lâu
          </label>
          
          <div className="relative">
            {/* Nút bấm để xổ menu ra */}
            <button
              type="button"
              onClick={() => setIsDurationOpen(!isDurationOpen)}
              // onBlur kết hợp setTimeout giúp tự động đóng menu khi click ra ngoài
              onBlur={() => setTimeout(() => setIsDurationOpen(false), 0)}
              className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer text-left"
            >
              <span>{durationOptions.find(opt => opt.value === duration)?.label}</span>
              {/* Icon mũi tên tự động xoay lên/xuống khi click */}
              <svg 
                className={`fill-current h-4 w-4 text-slate-400 transition-transform duration-200 ${isDurationOpen ? 'rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </button>

            {isDurationOpen && (
              <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20">
                {durationOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onMouseDown = {() => {
                      setDuration(opt.value);
                      setIsDurationOpen(false);
                    }}
                    className={`py-2.5 px-4 cursor-pointer hover:bg-blue-50 transition-colors 
                      ${duration === opt.value ? 'bg-blue-100/50 text-blue-700 font-semibold' : 'text-slate-700'}`
                    }
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      <div className="flex flex-col gap-2 relative">
        <label className="text-sm font-semibold text-slate-700">
          Bạn chọn hệ nào
        </label>
        
        <div className='flex flex-row gap-2'>
          <button 
            type="button"
            onClick={() => {
              setColorMode('single');
              setShowColorPicker(!showColorPicker);
            }}
            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 bg-white border text-sm
              ${colorMode === 'single' ? 'border-blue-500 ring-1 ring-blue-500 text-blue-700' : 'border-slate-200 text-slate-600'} 
              hover:bg-slate-50 py-3 px-2 rounded-xl font-medium transition-all shadow-sm whitespace-nowrap`}
          >
            <span className="text-lg">🎨</span> Một màu
          </button>

          <button 
            type="button"
            onClick={() => {
              onRandomize(); 
              setShowColorPicker(false); 
            }}
            className={`flex-1 flex items-center justify-center gap-2 bg-white border text-sm
              ${colorMode === 'random' ? 'border-blue-500 ring-1 ring-blue-500 text-blue-700' : 'border-slate-200 text-slate-600'} 
              hover:bg-slate-50 py-3 px-2 rounded-xl font-medium transition-all shadow-sm whitespace-nowrap cursor-pointer`}
          >
            <span className="text-lg">🎲</span> Random
          </button>
        </div>

        {colorMode === 'single' && showColorPicker && (
          <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-10">
            <p className="text-xs text-slate-500 font-medium mb-3 text-center">
              Chọn màu cố định cho Google Calendar
            </p>
            <div className="grid grid-cols-6 gap-3 place-items-center">
              {GOOGLE_COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => {
                    setSelectedColorId(color.id); 
                    setShowColorPicker(false);
                  }}
                  title={color.name}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 
                    ${selectedColorId === color.id ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent'}`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

        <div className="mt-auto">
          <div className='flex flex-row gap-2'>
            {isLoggedIn && (
              <button className='cursor-pointer w-full font-bold py-3 px-5.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2
              bg-white text-slate-800 border border-slate-200 hover:bg-gray-100'
              onClick={()=>{
                if(localStorage.getItem("isLoggedIn") === "true"){
                  localStorage.removeItem("isLoggedIn");
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                  setIsLoggedIn(false);
                  alert("Bạn đã đăng xuất thành công!");
                }

              }}>
                Đăng xuất
              </button>
            )}
            <button 
              className={`cursor-pointer w-full font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2
                ${isLoading 
                  ? 'bg-slate-400 text-slate-100 cursor-not-allowed' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white hover:shadow-lg focus:ring-4 focus:ring-slate-200'
                }`}
              onClick={async() => {
                if (!isLoggedIn) {
                  
                  const success = await handleLogin(); 

                  if (success) {
                    
                    setIsLoading(true); 
                    await handleCreateSchedule(); 
                  }
                } else {
                  await handleCreateSchedule();
                }
                }}
              disabled={isLoading} 
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo lịch...
                </>
              ) : (
                "Tạo lịch"
              )}
            </button>
            
          </div>
          <p className="text-xs text-slate-400 text-center mt-2 italic leading-relaxed">
              *Lưu ý là lịch sẽ được lưu trên Google Calendar của tài khoản Google bạn đã đăng nhập nhé
          </p>
        </div>

      </div>
    </div>
  );
}