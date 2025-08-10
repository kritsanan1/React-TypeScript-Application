import React from 'react';
import { Sparkles, Code, Palette, Zap } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Icon cluster */}
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

          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            Start Creating
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light leading-relaxed">
            Start prompting (or editing) to see magic happen
          </p>

          {/* Decorative elements */}
          <div className="flex justify-center space-x-2 mb-12">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Code</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Transform ideas into beautiful, functional applications with intelligent assistance.</p>
            </div>

            <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Design</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Create stunning user interfaces with modern design principles and attention to detail.</p>
            </div>

            <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Deploy</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Launch your creations to the world with seamless deployment and optimization.</p>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">Ready when you are ✨</p>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-indigo-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400 rounded-full opacity-60 animate-ping delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping delay-1500"></div>
      </div>
    </div>
  );
}

export default App;