import { Button } from "@/components/ui/button";
import { FileText, Image, Package, BarChart3, Brain, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            Ayrshaer CMS
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Comprehensive Content Management with AI-Powered Features
          </p>

          {/* Login button */}
          <div className="mb-12">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <a href="/api/login">Get Started</a>
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            <FeatureCard
              icon={FileText}
              title="Content Management"
              description="Create, edit, and manage articles with multi-language support and rich text editing."
              gradient="from-blue-500 to-purple-600"
            />
            <FeatureCard
              icon={Image}
              title="Media Library"
              description="Organize and manage your media files with smart categorization and metadata."
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={Package}
              title="Product Catalog"
              description="Manage your products with inventory tracking and integrated payment processing."
              gradient="from-pink-500 to-red-600"
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics"
              description="Comprehensive analytics and insights to track your content performance."
              gradient="from-green-500 to-blue-600"
            />
            <FeatureCard
              icon={Brain}
              title="AI Recommendations"
              description="Powered by Gemini AI for intelligent content suggestions and personalization."
              gradient="from-yellow-500 to-green-600"
            />
            <FeatureCard
              icon={Zap}
              title="Payment Integration"
              description="Seamless Stripe integration for processing payments and subscriptions."
              gradient="from-indigo-500 to-purple-600"
            />
          </div>

          {/* Footer text */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Built with modern technologies for creators and businesses ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

function FeatureCard({ icon: Icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 dark:border-gray-700/20">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 mx-auto`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}