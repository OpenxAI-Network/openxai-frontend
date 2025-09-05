import React, { useState, ReactNode } from "react";
// import { cn } from "../utils";

interface AccordionItemProps {
  title: string;
  description: string | ReactNode;
  className?: string;
  [key: string]: any; // For additional props
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  description
}) => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <div className={`${accordionOpen && "bg-[#1F2021]"} py-[32px] px-[24px] text-white rounded-lg`}>
      <button
        onClick={() => setAccordionOpen(!accordionOpen)}
        className="flex justify-between w-full font-semibold"
      >
        <span className={`${accordionOpen && "fill-white"} text-lg`}>{title}</span>
        <svg
          className="fill-white shrink-0 ml-8"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              accordionOpen && "!rotate-180 fill-white"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              accordionOpen && "!rotate-180 fill-white"
            }`}
          />
        </svg>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out text-white text-sm ${
          accordionOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={`font-regular text-white overflow-hidden text-left text-md ${accordionOpen && "pt-[16px]"}`}>
          {description}
        </div>
      </div>
    </div>
  );
};
