"use client";

import { useEffect, useState, useRef } from "react";

const MenuNavigation = ({ isValid }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuItemsRef = useRef([]);

  useEffect(() => {
    if (!isValid) return; // Prevent interaction if code is incorrect

    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        setFocusedIndex((prev) => (prev + 1) % menuItemsRef.current.length);
      } else if (event.key === "ArrowUp") {
        setFocusedIndex(
          (prev) =>
            (prev - 1 + menuItemsRef.current.length) %
            menuItemsRef.current.length
        );
      } else if (event.key === "Enter") {
        alert(
          `You selected: ${menuItemsRef.current[focusedIndex].textContent}`
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isValid, focusedIndex]);

  return (
    <ul id="menu" className="bg-white shadow-lg p-5 rounded-md w-64">
      {["Home", "About", "Contact"].map((item, index) => (
        <li
          key={index}
          ref={(el) => (menuItemsRef.current[index] = el)}
          className={`p-2 text-lg cursor-pointer ${
            focusedIndex === index ? "bg-yellow-200 font-bold" : ""
          }`}
          tabIndex={isValid ? "0" : "-1"}
          role={isValid ? "menuitem" : ""}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default MenuNavigation;
