import React, { useEffect } from "react";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
// import BackgroundImage from "../assets/backgrounds/Background.png";

const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="relative">
            {/* Page Content */}
            <div className="relative z-10">
                <section id="home">
                    <HeroSection />
                    <AboutSection />
                </section>
            </div>
        </div>
    );
};

export default LandingPage;
