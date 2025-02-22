"use client";

import React from "react";

const ScreenReaderSimulator = ({ isValid }) => {
  return (
    <div className="bg-white shadow-lg p-5 rounded-md w-80">
      <h2 className="text-lg font-bold mb-3">Screen Reader Simulation 🤖</h2>
      <p className="text-sm mb-2 text-gray-500">What a screen reader hears:</p>
      <div className="bg-gray-200 p-3 rounded-md text-gray-700 text-sm font-mono">
        {isValid ? (
          <>
            <p>"📢 Name, Edit text."</p>
            <p>"📢 Email, Edit text."</p>
          </>
        ) : (
          <>
            <p>"📢 Edit text, Edit text."</p>
            <p className="text-red-500">⚠️ No labels detected!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ScreenReaderSimulator;
