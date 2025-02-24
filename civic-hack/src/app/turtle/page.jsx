"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CodeEditor from "@/components/turtle/CodeEditor";

// Dynamically import BurgerMenu to prevent SSR errors
const BurgerMenu = dynamic(() => import("@/components/turtle/BurgerMenu"), {
  ssr: false,
});

const TurtleAnimation = dynamic(
  () => import("@/components/turtle/TurtleAnimation"),
  { ssr: false }
);

const initialCode = `<div class="menu-toggle" onclick="toggleMenu()">
  ☰ Today's To-dos
</div>
<ul class="menu">
  <li><a href="#">Travel</a></li>
  <li><a href="#">Catch Fish</a></li>
  <li><a href="#">Eat</a></li>
</ul>
<script>
  function toggleMenu() {
    document.querySelector('.menu').classList.toggle('open');
  }
</script>
<style>
  .menu { display: none; }
  .menu.open { display: block; }
</style>`;

const solutionCode = `<div class="menu-toggle" role="button" tabindex="0" onclick="toggleMenu()" onkeydown="handleKey(event)">
  ☰ Today's To-dos
</div>
<ul class="menu">
  <li><a href="#">Travel</a></li>
  <li><a href="#">Catch Fish</a></li>
  <li><a href="#">Eat</a></li>
</ul>
<script>
  function handleKey(event) {
    if (event.key === "Enter" || event.key === " ") {
      toggleMenu();
    }
  }
</script>`;

export default function TurtlePage() {
  const [code, setCode] = useState(initialCode);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSolution, setShowSolution] = useState(false);
  const [isAccessible, setIsAccessible] = useState(false);
  const totalPages = 2;
  const [attributes, setAttributes] = useState("");
  const [keyHandler, setKeyHandler] = useState("");
  const [turtlePosition, setTurtlePosition] = useState({ x: 200, y: 120 });
  const [isMoving, setIsMoving] = useState(false);
  const [turtleTarget, setTurtleTarget] = useState(null);

  // prevent the default tab key
  useEffect(() => {
    const handleTab = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, []);

  const handleRunCode = () => {
    const hasCorrectAttributes =
      attributes.trim() === 'role="button" tabindex="0"';
    const hasCorrectKeyHandler =
      keyHandler.trim() ===
      'if (event.key === "Enter" || event.key === " ") toggleMenu();';

    setIsAccessible(hasCorrectAttributes && hasCorrectKeyHandler);
  };

  const handleResetCode = () => {
    setCode(initialCode);
    setIsAccessible(false);
    setAttributes("");
    setKeyHandler("");
  };

  const handleFillAnswer = () => {
    setAttributes('role="button" tabindex="0"');
    setKeyHandler(
      'if (event.key === "Enter" || event.key === " ") toggleMenu();'
    );
  };

  const handleFocusChange = ({ type, index }) => {
    setIsMoving(true);
    requestAnimationFrame(() => {
      const menuButton = document.querySelector('[role="button"]');
      const menuItems = document.querySelectorAll(".menu");

      let target;
      if (type === "button") {
        target = menuButton;
      } else {
        const menu = document.querySelector(".menu-items");
        if (menu) {
          menu.style.display = "block";
        }
        setTimeout(() => {
          target = menuItems[index];
          if (target) {
            const rect = target.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            const x = ((rect.left + rect.width / 2) / viewportWidth) * 100;
            const y = ((rect.top + rect.height / 2) / viewportHeight) * 100;

            setTurtlePosition({
              x: x + 2,
              y: y - 3,
            });

            setTurtleTarget(target);
          }
        }, 50);
        return;
      }

      if (target) {
        const rect = target.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const x = ((rect.left + rect.width / 2) / viewportWidth) * 100;
        const y = ((rect.top + rect.height / 2) / viewportHeight) * 100;

        setTurtlePosition({
          x: x - 2,
          y: y - 3,
        });

        setTurtleTarget(target);
      }
    });

    setTimeout(() => setIsMoving(false), 300);
  };

  const pageContents = {
    1: {
      title: "",
      content: null,
    },
    2: {
      title: "Enhancing Menu Item Navigation",
      content: (
        <div className="space-y-4">
          <p>Now let's make the menu items themselves keyboard navigable.</p>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h4 className="text-yellow-400 font-medium mb-2">Task 2:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                Add <code className="text-blue-400">role="menuitem"</code> to
                each menu item
              </li>
              <li>Ensure menu items can receive focus with Tab key</li>
              <li>Add keyboard navigation between menu items</li>
            </ul>
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-emerald-900 to-green-900 p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center relative">
          <div className="inline-block">
            <div className="inline-block px-3 py-1 mb-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-teal-500 to-teal-600">
              Level 3
            </div>
            <span className="absolute -top-6 -left-6 w-12 h-12 bg-teal-500/20 rounded-full blur-xl animate-pulse"></span>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-4 relative pt-8">
              <span
                className="bg-gradient-to-r from-teal-300 via-emerald-200 to-green-300 text-transparent bg-clip-text
                relative after:absolute after:inset-0 after:bg-gradient-to-r after:from-teal-300/40 after:via-emerald-200/40 
                after:to-green-300/40 after:blur-lg after:-z-10"
              >
                Accessibility Challenge: Turtle Trek!
              </span>
            </h1>
          </div>

          <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl">
            <p className="text-teal-100 text-lg mb-4 leading-relaxed">
              Our little turtle is on a journey! 🏝️ But oh no! Its To-do List is
              blocked for keyboard users.
              <br />
              Help the turtle navigate smoothly by making this journey fully
              keyboard-accessible.
            </p>
            <p className="text-emerald-300 text-lg font-medium">
              Can you guide the turtle safely while keeping the site WCAG 2.1
              compliant?
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Code Editor */}
          <div className="w-full">
            <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 shadow-xl overflow-hidden p-6">
              {/* Background */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

              {/* Code Editor Section */}
              <div className="relative mb-8">
                <CodeEditor
                  onChange={setCode}
                  initialAttributes={attributes}
                  initialKeyHandler={keyHandler}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleRunCode}
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg shadow-lg 
                    transition-all duration-300 flex items-center gap-2 font-medium
                    hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Run
                </button>

                <button
                  onClick={handleResetCode}
                  className="group/reset px-6 py-2.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg 
                    transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover/reset:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>

                <button
                  onClick={handleFillAnswer}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg 
                    transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Answer
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="w-full">
            <div
              className="relative backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 
              shadow-xl overflow-hidden p-6 transition-all duration-300 hover:shadow-2xl 
              hover:border-white/20"
            >
              {/* Background */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>

              {/* Preview Content */}
              <div className="relative">
                <div
                  className="bg-gradient-to-br from-teal-800/30 to-emerald-800/30 backdrop-blur-sm 
                  rounded-xl border border-teal-700/30 p-6 shadow-xl transition-all duration-300 
                  hover:border-teal-700/40"
                >
                  <div className="flex justify-center">
                    <div className="w-[400px]">
                      <BurgerMenu
                        code={code}
                        isAccessible={isAccessible}
                        onFocusChange={handleFocusChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Turtle Animation */}
      <div
        className={`fixed z-30 w-24 h-24 transition-all duration-300 transform
          ${isMoving ? "scale-105" : "scale-100"}
          ${turtleTarget ? "opacity-100" : "opacity-100"}`}
        style={{
          left: turtleTarget ? `${turtlePosition.x}%` : "98%",
          top: turtleTarget ? `${turtlePosition.y}%` : "90%",
          transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
          transform: `translate(-50%, -50%) ${
            isMoving ? "scale(1.05)" : "scale(1)"
          }`,
          filter: "drop-shadow(0 0 10px rgba(0, 255, 200, 0.2))",
        }}
      >
        <div className={isMoving ? "turtle-active" : ""}>
          <TurtleAnimation />
        </div>
      </div>
    </div>
  );
}
