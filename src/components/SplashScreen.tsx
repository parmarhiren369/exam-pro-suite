import { useState, useEffect } from "react";
import splashImage from "@/assets/splash-image.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1600);
    const completeTimer = setTimeout(() => onComplete(), 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-scale-in flex flex-col items-center gap-6">
        <img
          src={splashImage}
          alt="Hiren's Evaluator Pro"
          className="w-[90vw] max-w-2xl rounded-2xl shadow-premium-lg animate-fade-in-up"
        />
        <div className="animate-fade-in-up stagger-2 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground tracking-tight">
            Hiren's Evaluator Pro
          </h1>
          <p className="text-primary-foreground/70 mt-2 text-lg">
            JEE · NEET · Competitive Exam Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
