import React from "react";

const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-white dark:bg-[#101624] transition-colors">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="1"
              className="dark:stroke-[#22303C]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

export default BackgroundGrid;