import React from "react";

const HeroSection = () => {
    return (
        <div className="block relative w-full h-screen overflow-hidden z-0">
            <div className="absolute top-0 left-0 w-full h-full">
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/KO3VhTsDwDM?autoplay=1&mute=1&loop=1&playlist=KO3VhTsDwDM&controls=0&showinfo=0&modestbranding=1"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    title="Background Video"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-[#E89005] mix-blend-color opacity-100" />
            <div className="absolute inset-0 bg-black mix-blend-multiply opacity-60" />

            <div className="relative z-10 h-full flex items-center justify-center text-white px-2 xs:px-4 sm:px-6 pt-[10vh] pb-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex flex-col items-center justify-center gap-0">
                        <div className="text-[4rem] xs:text-[5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem] font-roboto font-bold text-transparent bg-clip-text bg-[#E89005] leading-none">
                            <span>
                                0.04% CO₂
                            </span>
                        </div>
                        <div className="text-center text-xs sm:text-base md:text-lg lg:text-2xl font-light tracking-[45%] font-inter leading-none">
                            <span className="whitespace-nowrap">INTRODUCING CARBON COINS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
