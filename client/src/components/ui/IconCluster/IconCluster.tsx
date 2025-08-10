import React from 'react';
import { Sparkles, Code, Palette, Zap } from 'lucide-react';

const IconCluster: React.FC = () => {
  return (
    <div className="flex justify-center mb-8 space-x-4">
      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 transform hover:scale-110 transition-transform duration-300">
        <Sparkles className="w-8 h-8 text-indigo-600" />
      </div>
      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 transform hover:scale-110 transition-transform duration-300 delay-100">
        <Code className="w-8 h-8 text-purple-600" />
      </div>
      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 transform hover:scale-110 transition-transform duration-300 delay-200">
        <Palette className="w-8 h-8 text-pink-600" />
      </div>
      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 transform hover:scale-110 transition-transform duration-300 delay-300">
        <Zap className="w-8 h-8 text-blue-600" />
      </div>
    </div>
  );
};

export default IconCluster;