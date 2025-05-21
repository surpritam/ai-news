import React from 'react';

function Footer() {
  return (
    <footer className="w-full py-6 mt-10 bg-white border-t border-gray-100 flex flex-col items-center text-center text-gray-500 text-sm">
      <div>
        &copy; {new Date().getFullYear()} AI Daily Digest &mdash; Open Source under the MIT License.
      </div>
      <div className="mt-1">
        <a href="https://github.com/pritamsur/ai-news" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on GitHub</a>
      </div>
    </footer>
  );
}

export default Footer;
