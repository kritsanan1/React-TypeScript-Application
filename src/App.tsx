import { Code, Palette, Zap } from 'lucide-react';
import { AnimatedBackground, IconCluster, FeatureCard } from './components/index.ts';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <AnimatedBackground />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Icon cluster */}
          <IconCluster />

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
            <FeatureCard
              icon={Code}
              title="Code"
              description="Transform ideas into beautiful, functional applications with intelligent assistance."
              gradient="from-indigo-500 to-purple-600"
            />
            <FeatureCard
              icon={Palette}
              title="Design"
              description="Create stunning user interfaces with modern design principles and attention to detail."
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={Zap}
              title="Deploy"
              description="Launch your creations to the world with seamless deployment and optimization."
              gradient="from-pink-500 to-blue-600"
            />
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