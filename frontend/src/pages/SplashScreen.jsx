import React from "react";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="flex flex-col items-center gap-4 animate-fadeIn">

        {/* Logo circle */}
        <div className="w-28 h-28 rounded-full border-4 border-indigo-500 flex items-center justify-center animate-ping-slow">
          <img
            src="/logo.png"  // <<< Your BookXpress logo
            alt="BookXpress"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Text */}
        <div className="text-xl font-bold text-indigo-600 tracking-wide animate-pulse">
          BookXpress
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-ping-slow {
          animation: ping 2s infinite;
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
