import React from 'react';
import logo from '../assets/newlogo.jpeg';
import { IoLogoApple } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const LandPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen overflow-hidden">
      {/* Section 1: Hero with background */}
      <div
        className="bg-cover bg-center bg-no-repeat h-screen w-full relative flex items-center justify-end"
        style={{ backgroundImage: "url('/landpagemay.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* Navbar */}
        <nav className="w-full h-[100px] absolute top-0 z-10 px-5 md:px-10 flex justify-between items-center bg-white/10 backdrop-blur-md">
          {/* Left Side */}
          <div className="flex gap-3">
            <button
              className="w-32 h-10 bg-one text-white rounded-3xl hover:bg-one/90 text-sm"
              onClick={() => navigate("/login")}
            >
              تسجيل الدخول
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6 text-white">
            <div className="flex gap-5 pt-4 text-sm md:text-base">
              <span className="relative after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                تحميل التطبيق
              </span>
              <span className="relative after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                الرئيسية
              </span>
            </div>
            <img src={logo} className="w-16 h-16" alt="Logo" />
          </div>
        </nav>

        {/* Hero Text Content */}
        <div className="relative z-10 px-5 md:px-10 flex flex-col gap-5 w-full" dir="rtl">
          <h2 className="font-medium text-[28px] md:text-[40px] lg:text-[64px] text-right text-white leading-tight">
            مرحبًا بك في دعوة للتغير
          </h2>

          <span className="font-normal text-[14px] md:text-[18px] lg:text-[24px] text-white text-right max-w-full md:max-w-[80%] lg:max-w-[60%] leading-relaxed">
            ناديك المجتمعي المتكامل للأنشطة الرياضية، الثقافية، والترفيهية – حيث تجتمع العائلة والراحة والتطوير في مكان واحد.
          </span>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* <button className="w-full sm:w-52 h-12 bg-one text-white rounded-3xl hover:bg-one/90 text-sm">
              تحميل App Store
            </button> */}
            <a href='https://drive.google.com/file/d/1aLzV4XW3EWy51jr0ivmzubofngt5XP6v/view?usp=drivesdk'  className="w-full flex items-center justify-center sm:w-52 h-12 border border-white text-white rounded-3xl hover:bg-white/10 text-sm">
<p>              تحميل Play Store
</p>
            </a>
          </div>
        </div>
      </div>

      {/* Section 2: Club Features */}
      <div className="bg-[#131416] flex items-center justify-center py-10 px-4">
        <div className="bg-[#252115] w-full md:w-[90%] lg:w-[75%] rounded-xl py-10 px-4 md:px-8 flex flex-col items-center text-center gap-5">
          <h2 className="text-white text-[28px] md:text-[40px] lg:text-[48px] font-medium leading-snug">
            مرحبًا بك في  دعوة للتغير
          </h2>
          <p className="text-white text-[14px] md:text-[18px] px-2 md:px-10">
            استمتع بكل خدمات النادي على موبايلك – تابع الأنشطة، قدّم الشكاوى، شارك في التصويتات والمسابقات، و كل ده من مكانك
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {/* App Store Button */}
            {/* <button className="flex items-center gap-4 w-full md:w-[250px] bg-one text-white rounded-xl px-4 py-3">
              <IoLogoApple className="text-4xl md:text-6xl" />
              <div className="flex flex-col text-left">
                <p className="text-sm">Download on the</p>
                <p className="text-lg font-semibold">App Store</p>
              </div>
            </button> */}

            {/* Play Store Button */}
            <a href='https://drive.google.com/file/d/1aLzV4XW3EWy51jr0ivmzubofngt5XP6v/view?usp=drivesdk' className="flex items-center gap-4 w-full md:w-[250px] bg-one text-white rounded-xl px-4 py-3">
              <svg width="40" height="48" viewBox="0 0 49 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.8779 26.7439L0.209045 51.3472C0.211175 51.3515 0.211174 51.358 0.213303 51.3624C0.909529 54.0339 3.29415 56 6.1259 56C7.25859 56 8.32103 55.6865 9.2323 55.1378L9.30469 55.0943L34.8202 40.0384L22.8779 26.7439Z" fill="#EA4335"/>
                <path d="M45.8105 22.5544L45.7892 22.5392L34.7731 16.0095L22.3624 27.303L34.8178 40.0358L45.7743 33.5714C47.6947 32.5089 48.9999 30.4383 48.9999 28.052C48.9999 25.6788 47.7139 23.6191 45.8105 22.5544Z" fill="#FBBC04"/>
                <path d="M0.208655 4.65084C0.0723904 5.16467 0 5.70464 0 6.26202V49.7379C0 50.2953 0.0723904 50.8353 0.210784 51.3469L23.6568 27.3729L0.208655 4.65084Z" fill="#4285F4"/>
                <path d="M23.0452 28L34.7767 16.0054L9.29105 0.895065C8.36488 0.326796 7.28329 0.000205994 6.12717 0.000205994C3.29543 0.000205994 0.906544 1.97064 0.210319 4.64434C0.210319 4.64651 0.208191 4.64869 0.208191 4.65087L23.0452 28Z" fill="#34A853"/>
              </svg>
              <div className="flex flex-col text-left">
                <p className="text-sm">Download on the</p>
                <p className="text-lg font-semibold">Play Store</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-one text-white py-4 text-center text-sm">
        <button
          className="underline font-normal"
          onClick={() => window.open("https://wegostation.com", "_blank")}
        >
          powered by wegostation
        </button>
      </div>
    </div>
  );
};

export default LandPage;
