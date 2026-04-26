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

  const match = value.match(/[\d.,]+/);
  const numericStr = match ? match[0] : "0";
  const isFloat = numericStr.includes(",");
  const targetNumber = parseFloat(numericStr.replace(/\./g, "").replace(",", "."));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && targetNumber > 0) {
      let start = 0;
      const duration = 2000;
      const frameRate = 16;
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

  let displayCount = "";
  if (isFloat) {
    displayCount = count.toFixed(1).replace(".", ",");
    if (displayCount.endsWith(",0") && !numericStr.endsWith(",0")) {
      displayCount = displayCount.slice(0, -2);
    }
  } else {
    displayCount = Math.floor(count).toLocaleString("id-ID");
  }

  const displayValue = match ? value.replace(numericStr, displayCount) : value;

  return (
    <div ref={ref} className="flex flex-col items-center text-center w-full">
      {/* Icon */}
      <div className="mb-3 flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#E1F5EE] text-[#0F6E56]">
        <Icon className="size-7" />
      </div>
      {/* Value */}
      <p className="text-sm font-extrabold text-[#17391f] sm:text-base lg:text-lg whitespace-nowrap md:max-w-[100px]">
        {displayValue}
      </p>
      {/* Label — boleh wrap, dibatasi lebar agar tidak melebar */}
      <p className="mt-1 text-[10px] font-medium leading-tight text-[#5d7a64] sm:text-xs">
        {label}
      </p>
    </div>
  );
}