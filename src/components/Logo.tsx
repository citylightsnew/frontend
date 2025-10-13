import logoImage from '../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="City Lights Logo" 
        className={`${sizeClasses[size]} object-contain transition-transform duration-200 hover:scale-105`}
      />
      {showText && (
        <div className="ml-3">
          <h1 className={`${textSizeClasses[size]} font-bold text-gray-900`}>
            City Lights
          </h1>
          <p className="text-gray-600 text-sm">
            Control de Edificios
          </p>
        </div>
      )}
    </div>
  );
}