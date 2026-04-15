import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'sm',
  className,
  showText = false,
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeMap[size],
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground fill-muted/20"
            )}
          />
        ))}
      </div>
      {showText && (
        <span className="text-caption text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
