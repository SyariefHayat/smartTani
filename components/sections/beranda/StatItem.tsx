"use client";

import { LucideIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface StatItemProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatItem({ icon: Icon, value, label }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Extract the numeric part of the string
  // Matches strings like "125.430" or "1,2"
  const match = value.match(/[\d.,]+/);
  const numericStr = match ? match[0] : "0";
  const isFloat = numericStr.includes(",");
  const targetNumber = parseFloat(numericStr.replace(/\./g, "").replace(",", "."));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && targetNumber > 0) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const frameRate = 16; // roughly 60fps
      const totalFrames = duration / frameRate;
      const increment = targetNumber / totalFrames;

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, frameRate);

      return () => clearInterval(timer);
    } else if (isVisible) {
      setCount(targetNumber);
    }
  }, [isVisible, targetNumber]);

  // Format the animated number
  let displayCount = "";
  if (isFloat) {
    // Keep 1 decimal place if the target number has it
    displayCount = count.toFixed(1).replace(".", ",");
    // Ensure we don't show .0 if the original was just an integer
    if (displayCount.endsWith(",0") && !numericStr.endsWith(",0")) {
        displayCount = displayCount.slice(0, -2);
    }
  } else {
    displayCount = Math.floor(count).toLocaleString("id-ID");
  }

  // Replace the original number in the string with the animated one
  const displayValue = match ? value.replace(numericStr, displayCount) : value;

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-2 sm:px-4">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#E1F5EE] text-[#0F6E56] md:size-12">
        <Icon className="size-5 md:size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-extrabold text-[#17391f] md:text-xl lg:text-2xl whitespace-nowrap">
          {displayValue}
        </p>
        <p className="text-[10px] font-medium text-[#5d7a64] sm:text-xs md:text-sm">
          {label}
        </p>
      </div>
    </div>
  );
}
