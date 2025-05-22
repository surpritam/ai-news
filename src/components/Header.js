import React from 'react';

function Header() {
  return (
    <header className="w-full flex flex-col items-center py-8 bg-white border-b border-gray-100 mb-4">
      {/* <img src="/logo192.png" alt="AI Daily Digest Logo" className="w-16 h-16 mb-2" /> */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1 text-center">AI Daily Digest</h1>
      <p className="text-gray-500 text-center text-base">Your personalized AI news, simply delivered</p>
    </header>
  );
}

export default Header;
