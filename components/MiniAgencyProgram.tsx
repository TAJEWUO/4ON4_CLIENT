"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

export default function MiniAgencyProgram() {
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);

  useEffect(() => {
    const calculateMaxDrag = () => {
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.offsetWidth;
        const buttonWidth = 100; // Width of drag button
        setMaxDrag(containerWidth - buttonWidth - 8); // 8px for padding
      }
    };

    calculateMaxDrag();
    window.addEventListener('resize', calculateMaxDrag);
    
    return () => window.removeEventListener('resize', calculateMaxDrag);
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const containerRect = sliderRef.current.getBoundingClientRect();
    let clientX: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const newPosition = Math.min(Math.max(0, clientX - containerRect.left - 50), maxDrag);
    setDragPosition(newPosition);
    
    // Check if dragged to the end
    if (newPosition >= maxDrag * 0.97) {
      window.location.href = '/user/app/tour-guides/register';
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Snap back if not completed
    if (dragPosition < maxDrag * 0.97) {
      setDragPosition(0);
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-8 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            <span className="text-green-600">REGISTER</span>
            {" "}and JOIN OUR{" "}
            <span className="text-red-400">'TOUR GUIDES MINI AGENCY'</span>
            {" "}program
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Become part of our exclusive network of professional tour guides and unlock new opportunities
          </p>
        </div>
        
        {/* Drag to Join Slider - Full Width */}
        <div 
          ref={sliderRef}
          className="relative w-full h-20 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border border-gray-300 overflow-hidden shadow-inner"
          style={{ borderRadius: '0 40px 40px 0' }}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-base md:text-lg font-bold text-gray-300 tracking-widest">
              DRAG TO JOIN →
            </span>
          </div>
          
          {/* Progress Fill */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-300 via-green-400 to-green-500"
            style={{ 
              width: `${(dragPosition / maxDrag) * 100}%`,
              opacity: 0.2,
              transition: isDragging ? 'none' : 'width 0.3s ease-out'
            }}
          />
          
          {/* Draggable Button */}
          <div
            className="absolute top-1 left-1 bottom-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-r-3xl shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
            style={{ 
              transform: `translateX(${dragPosition}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              touchAction: 'none'
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="flex flex-col items-center">
              <ChevronRight className="w-10 h-10 text-white" />
              <div className="flex gap-1 mt-1">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Drag the button all the way to the right to register your interest
          </p>
        </div>
      </div>
    </section>
  );
}
