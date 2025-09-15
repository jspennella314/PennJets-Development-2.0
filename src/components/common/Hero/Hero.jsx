import React from 'react';
import Button from '../Button/Button';

const Hero = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  overlay = true,
  className = ''
}) => {
  return (
    <section className={`relative min-h-screen flex items-center justify-center ${className}`}>
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-900/60 to-primary-900/70" />
      )}
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto container-padding text-center text-white">
        <div className="animate-fade-in">
          {subtitle && (
            <p className="text-lg sm:text-xl font-medium text-primary-200 mb-4 tracking-wide uppercase">
              {subtitle}
            </p>
          )}
          
          <h1 className="heading-xl mb-6 text-white">
            {title}
          </h1>
          
          {description && (
            <p className="body-lg text-gray-200 mb-8 max-w-3xl mx-auto">
              {description}
            </p>
          )}
          
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              {primaryAction && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={primaryAction.onClick}
                  className="animate-slide-up"
                >
                  {primaryAction.text}
                </Button>
              )}
              
              {secondaryAction && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={secondaryAction.onClick}
                  className="animate-slide-up animation-delay-200 text-white border-white hover:bg-white hover:text-gray-900"
                >
                  {secondaryAction.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;