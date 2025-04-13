import React from 'react';
import { Globe, Facebook, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800/30 backdrop-blur-sm mt-16 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-current animate-pulse" />
            <span>by Mosaddik</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://mosaddik.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all transform hover:scale-105"
            >
              <Globe size={18} />
              <span>Portfolio</span>
            </a>
            <a
              href="https://www.facebook.com/mosaddik.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all transform hover:scale-105"
            >
              <Facebook size={18} />
              <span>Facebook</span>
            </a>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Mosaddik. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}