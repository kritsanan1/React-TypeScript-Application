import React from 'react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, gradient }) => {
  return (
    <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2">
      <div className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;