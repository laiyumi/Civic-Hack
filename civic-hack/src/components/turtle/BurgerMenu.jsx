"use client";

import { useState, useEffect, useRef } from 'react';

export default function BurgerMenu({ code, isAccessible, onFocusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuItemRefs = useRef([]);
  const [focusIndex, setFocusIndex] = useState(-1);

  useEffect(() => {
    menuItemRefs.current = menuItemRefs.current.slice(0, 3);
  }, []);

  useEffect(() => {
    if (focusIndex >= 0) {
      if (focusIndex === 0) {
        onFocusChange({ type: 'button', index: 0 });
      } else {
        onFocusChange({ type: 'item', index: focusIndex - 1 });
      }
    }
  }, [focusIndex, onFocusChange]);

  const handleKeyDown = (e) => {
    if (!isAccessible) return;

    if ((e.key === 'Enter' || e.key === ' ') && focusIndex === 0) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      const nextIndex = (focusIndex + 1) % (isOpen ? 4 : 1);
      setFocusIndex(nextIndex);

      if (nextIndex === 0) {
        menuButtonRef.current?.focus();
      } else {
        menuItemRefs.current[nextIndex - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    if (isAccessible) {
      menuButtonRef.current?.setAttribute('tabindex', '0');
      menuItemRefs.current.forEach(ref => {
        if (ref) ref.setAttribute('tabindex', '0');
      });
      setFocusIndex(0);
      menuButtonRef.current?.focus();
    } else {
      menuButtonRef.current?.removeAttribute('tabindex');
      menuItemRefs.current.forEach(ref => {
        if (ref) ref.removeAttribute('tabindex');
      });
      setFocusIndex(-1);
    }
  }, [isAccessible]);

  return (
    <div className="w-full max-w-sm" onKeyDown={handleKeyDown}>
      {/* Preview Container */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="text-sm text-gray-500">Preview</div>
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Menu Toggle Button */}
          <div
            ref={menuButtonRef}
            onClick={() => setIsOpen(!isOpen)}
            className={`text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer
              ${focusIndex === 0 ? 'ring-2 ring-blue-500 outline-none' : ''}`}
            role={isAccessible ? "button" : undefined}
          >
            ☰ Today's To-dos
          </div>

          {/* Menu Items */}
          <div className={`mt-2 transition-all duration-300 menu-items ${isOpen ? 'block' : 'hidden'}`}>
            <ul className="bg-white border rounded-lg shadow-lg">
              {['Travel', 'Catch Fish', 'Eat'].map((item, index) => (
                <li key={item}>
                  <a
                    href="#"
                    ref={el => menuItemRefs.current[index] = el}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 menu
                      ${focusIndex === index + 1 ? 'ring-2 ring-blue-500 outline-none bg-gray-50' : ''}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
        <p className="text-gray-400 mb-2">Try using keyboard to navigate:</p>
        <div className="flex justify-center gap-4">
          <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md">Tab</kbd>
          <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md">Enter</kbd>
          <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md">Space</kbd>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`mt-4 p-3 rounded-lg transition-colors duration-300 ${
        isAccessible ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
      }`}>
        <p className="text-sm flex items-start gap-2">
          {isAccessible ? (
            <>
              <span className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>
                Menu is now keyboard accessible!
                <br />
              </span>
            </>
          ) : (
            <>
              <span className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <span>
                Menu needs keyboard accessibility
                <br />
                <span className="text-gray-400">Current menu can only be used with mouse</span>
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
} 