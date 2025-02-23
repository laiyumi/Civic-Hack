"use client";

import { useState, useEffect } from 'react';

export default function CodeEditor({ onChange, initialAttributes = "", initialKeyHandler = "" }) {
  const [attributes, setAttributes] = useState(initialAttributes);
  const [keyHandler, setKeyHandler] = useState(initialKeyHandler);
  const [activeTab, setActiveTab] = useState('html'); // 'html', 'js', or 'css'

  useEffect(() => {
    setAttributes(initialAttributes);
    setKeyHandler(initialKeyHandler);
  }, [initialAttributes, initialKeyHandler]);

  const handleAttributesChange = (e) => {
    setAttributes(e.target.value);
  };

  const handleKeyHandlerChange = (e) => {
    setKeyHandler(e.target.value);
  };

  const generateFullCode = () => {
    return `<div class="menu-toggle" onclick="toggleMenu()" onkeydown="handleKey(event)" ${attributes}>
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
  function handleKey(event) {
    ${keyHandler}
  }
</script>
<style>
  .menu { display: none; }
  .menu.open { display: block; }
</style>`;
  };

  const updateCode = () => {
    onChange(generateFullCode());
  };

  useEffect(() => {
    const timer = setTimeout(updateCode, 1000);
    return () => clearTimeout(timer);
  }, [attributes, keyHandler]);

  return (
    <div className="font-mono">
      {/* Tab Buttons */}
      <div className="flex gap-px">
        {[
          { id: 'html', label: 'HTML' },
          { id: 'js', label: 'JavaScript' },
          { id: 'css', label: 'CSS' }
        ].map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 transition-colors relative
              ${index === 0 ? 'rounded-tl-xl' : ''}
              ${index === 2 ? 'rounded-tr-xl' : ''}
              ${activeTab === tab.id
                ? 'text-teal-300 bg-gray-900'
                : 'text-gray-400 bg-gray-800 hover:text-gray-200'
              }
              ${activeTab === tab.id ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-500' : ''}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Content */}
      <div className="bg-gray-900 p-4 border-t border-gray-800 rounded-b-xl rounded-tr-xl">
        {activeTab === 'html' && (
          <div className="space-y-2 font-mono text-[13px] leading-6">
            <div className="flex items-center space-x-1 flex-wrap">
              <span className="text-pink-400">{'<div'}</span>
              <span className="text-violet-400">{' class'}</span>
              <span className="text-gray-400">{'='}</span>
              <span className="text-emerald-300">{'"menu-toggle"'}</span>
              <span className="text-violet-400">{' onclick'}</span>
              <span className="text-gray-400">{'='}</span>
              <span className="text-emerald-300">{'"toggleMenu()"'}</span>
              <span className="text-violet-400">{' onkeydown'}</span>
              <span className="text-gray-400">{'='}</span>
              <span className="text-emerald-300">{'"handleKey(event)"'}</span>
              <input
                type="text"
                value={attributes}
                onChange={handleAttributesChange}
                className="bg-gray-800/50 text-emerald-300 px-2 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 w-64 text-[13px]"
                placeholder='role="button" tabindex="0"'
                spellCheck="false"
                autoComplete="off"
              />
              <span className="text-pink-400">{'>'}</span>
            </div>

            <div className="pl-4 text-gray-300">☰ Today's To-dos</div>
            <div><span className="text-pink-400">{'</div>'}</span></div>

            <div>
              <span className="text-pink-400">{'<ul '}</span>
              <span className="text-violet-400">class</span>
              <span className="text-gray-400">=</span>
              <span className="text-emerald-300">{'"menu"'}</span>
              <span className="text-pink-400">{'>'}</span>
            </div>

            {['Travel', 'Catch Fish', 'Eat'].map((item) => (
              <div key={item} className="pl-4">
                <span className="text-pink-400">{'<li><a '}</span>
                <span className="text-violet-400">href</span>
                <span className="text-gray-400">=</span>
                <span className="text-emerald-300">{'"#"'}</span>
                <span className="text-pink-400">{'>'}</span>
                <span className="text-gray-300">{item}</span>
                <span className="text-pink-400">{'</a></li>'}</span>
              </div>
            ))}

            <div><span className="text-pink-400">{'</ul>'}</span></div>
          </div>
        )}

        {activeTab === 'js' && (
          <div className="space-y-2 font-mono text-[13px] leading-6 overflow-x-auto">
            <div className="flex items-center space-x-1 flex-wrap min-w-fit">
              <span className="text-violet-400">function</span>
              <span className="text-blue-300">{' toggleMenu'}</span>
              <span className="text-gray-300">{'() {'}</span>
            </div>
            <div className="pl-4 text-gray-300 flex items-center space-x-1 flex-wrap min-w-fit">
              {"document.querySelector('.menu').classList.toggle('open');"}
            </div>
            <div className="text-gray-300">{'}'}</div>

            <div className="mt-4 flex items-center space-x-1 flex-wrap min-w-fit">
              <span className="text-violet-400">function</span>
              <span className="text-blue-300">{' handleKey'}</span>
              <span className="text-gray-300">{'(event) {'}</span>
            </div>
            <div className="pl-4 w-full">
              <input
                type="text"
                value={keyHandler}
                onChange={handleKeyHandlerChange}
                className="bg-gray-800/50 text-gray-300 px-2 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 w-full text-[13px] min-w-[300px]"
                placeholder='if (event.key === "Enter" || event.key === " ") toggleMenu();'
                spellCheck="false"
                autoComplete="off"
              />
            </div>
            <div className="text-gray-300">{'}'}</div>
          </div>
        )}

        {activeTab === 'css' && (
          <div className="space-y-2 font-mono text-[13px] leading-6">
            <div>
              <span className="text-orange-300">{'.menu'}</span>
              <span className="text-gray-300">{' {'}</span>
            </div>
            <div className="pl-4">
              <span className="text-blue-300">display</span>
              <span className="text-gray-300">{': '}</span>
              <span className="text-amber-300">none</span>
              <span className="text-gray-300">;</span>
            </div>
            <div className="text-gray-300">{'}'}</div>

            <div className="mt-2">
              <span className="text-orange-300">{'.menu.open'}</span>
              <span className="text-gray-300">{' {'}</span>
            </div>
            <div className="pl-4">
              <span className="text-blue-300">display</span>
              <span className="text-gray-300">{': '}</span>
              <span className="text-amber-300">block</span>
              <span className="text-gray-300">;</span>
            </div>
            <div className="text-gray-300">{'}'}</div>
          </div>
        )}
      </div>
    </div>
  );
} 