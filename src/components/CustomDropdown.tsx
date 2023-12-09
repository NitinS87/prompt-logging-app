import { cn } from "@/utils/cn";
import React, { useState } from "react";

type CustomDropdownProps = {
  name?: string;
  options: string[];
  optionsClass?: string;
  className?: string;
  handleChange: (selectedOption: string) => void;
};

const CustomDropdown = ({
  name,
  options,
  optionsClass,
  className,
  handleChange,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOpening = () => setIsOpen(!isOpen);

  const handleSelecting = (option: string) => {
    setSelectedOption(option);
    handleChange(option);
    setIsOpen(false);
  };

  return (
    <div className={cn(className, "relative")}>
      <div onClick={handleOpening} className="flex justify-between">
        {selectedOption} {name && name} <span>&#10003;</span>
      </div>
      {isOpen && (
        <div className="absolute w-full top-12 left-0 flex flex-col justify-between gap-2 items-center">
          {options.map((option) => (
            <div
              className={cn(
                optionsClass,
                "cursor-pointer hover:bg-slate-700 w-full text-white"
              )}
              onClick={() => handleSelecting(option)}
              key={option}
            >
              {option} {name && name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
