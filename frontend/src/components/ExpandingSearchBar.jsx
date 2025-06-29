import React, { useRef, useState } from "react";
import { Search } from "lucide-react";

const ExpandingSearchBar = ({ value, onChange, placeholder = "Search friends..." }) => {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef();

  const handleIconClick = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBlur = () => {
    if (!value) setExpanded(false);
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        className="absolute right-3 z-10"
        onClick={handleIconClick}
        tabIndex={-1}
        aria-label="Open search"
      >
        <Search className="size-5 text-base-content/75 -scale-x-100" />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`
          transition-all duration-300 ease-in-out
          ${expanded ? "w-48 sm:w-64 pr-10" : "w-0 pr-10"}
          input input-bordered
          overflow-hidden
          ${expanded ? "px-4 py-2" : "px-0 py-0"}
        `}
        style={{ minWidth: expanded ? "8rem" : "0" }}
      />
    </div>
  );
};

export default ExpandingSearchBar;
