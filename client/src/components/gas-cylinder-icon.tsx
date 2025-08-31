interface GasCylinderIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function GasCylinderIcon({ size = "md", className = "" }: GasCylinderIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      {/* Main cylinder body - realistic gas cylinder */}
      <rect x="9" y="5" width="6" height="15" rx="3" ry="0.8" fill="currentColor" opacity="0.95"/>
      
      {/* Top valve assembly */}
      <rect x="10.5" y="2" width="3" height="4" rx="0.8" fill="currentColor"/>
      
      {/* Valve handle */}
      <circle cx="12" cy="3" r="0.8" fill="none" stroke="currentColor" strokeWidth="0.6"/>
      <rect x="11.5" y="1.5" width="1" height="1" rx="0.5" fill="currentColor"/>
      
      {/* Bottom ring */}
      <ellipse cx="12" cy="20.5" rx="3.5" ry="0.8" fill="currentColor"/>
      
      {/* Safety collar */}
      <rect x="9.5" y="4.5" width="5" height="0.8" rx="0.4" fill="currentColor" opacity="0.8"/>
      
      {/* Gas level indicators */}
      <rect x="10" y="8" width="4" height="0.3" rx="0.15" fill="currentColor" opacity="0.6"/>
      <rect x="10" y="11" width="4" height="0.3" rx="0.15" fill="currentColor" opacity="0.6"/>
      <rect x="10" y="14" width="4" height="0.3" rx="0.15" fill="currentColor" opacity="0.6"/>
      <rect x="10" y="17" width="4" height="0.3" rx="0.15" fill="currentColor" opacity="0.6"/>
      
      {/* Warning label */}
      <rect x="10.2" y="9.5" width="3.6" height="2" rx="0.2" fill="none" stroke="currentColor" strokeWidth="0.25" opacity="0.7"/>
      
      {/* Pressure gauge */}
      <circle cx="10.8" cy="6.5" r="0.4" fill="none" stroke="currentColor" strokeWidth="0.25" opacity="0.6"/>
    </svg>
  );
}