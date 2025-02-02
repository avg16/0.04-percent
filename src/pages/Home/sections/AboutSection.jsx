import React from "react";

const AboutSection = () => {
    return (
        <div className="relative bg-black text-white py-16">
            {/* Yellow Borders with Blend Effect */}
            <div className="absolute inset-0 rounded-xl mix-blend-screen"></div>

            <div className="relative z-10 max-w-6xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-roboto font-semibold text-yellow-500 animate__animated animate__fadeIn animate__delay-1s">
                    About Us
                </h2>
                <p className="mt-4 text-lg md:text-xl text-gray-300 font-light animate__animated animate__fadeIn animate__delay-2s">
                    We are committed to changing the world by promoting carbon reduction and sustainability.
                    Our platform introduces Carbon Coins, a new way to encourage carbon-offset activities and make a real impact on the environment.
                </p>

                {/* Example Card for Mission */}
                <div className="mt-8 p-6 bg-transparent border-2 border-yellow-500 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 ease-in-out animate__animated animate__fadeIn animate__delay-3s">
                    <h3 className="text-xl font-semibold">Our Mission</h3>
                    <p className="mt-2 text-sm md:text-base">
                        Our mission is to help individuals and organizations track, reduce, and offset their carbon emissions by using innovative technologies and carbon credit solutions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
