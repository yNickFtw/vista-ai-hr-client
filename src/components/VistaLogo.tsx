import { Link } from "@tanstack/react-router";

interface VistaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  isLink?: boolean;
}

export function VistaLogo({ className = "", size = "md", isLink = true }: VistaLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    isLink ? (
      <Link to="/">
        <span
          className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 ${sizeClasses[size]} ${className}`}
        >
          VistaAI
        </span>
      </Link>
    ) : (
      <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 ${sizeClasses[size]} ${className}`}>VistaAI</span>
    )
  );
}
