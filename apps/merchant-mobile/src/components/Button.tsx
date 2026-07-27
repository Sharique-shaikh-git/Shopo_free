import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  title: string;
}

export function Button({ variant = 'primary', size = 'md', title, className, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={twMerge(
        'items-center justify-center rounded-xl flex-row',
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-secondary',
        variant === 'outline' && 'border-2 border-primary bg-transparent',
        variant === 'ghost' && 'bg-transparent',
        size === 'sm' && 'py-2 px-4',
        size === 'md' && 'py-4 px-6',
        size === 'lg' && 'py-5 px-8',
        className
      )}
      {...props}
    >
      <Text
        className={twMerge(
          'font-semibold text-center',
          variant === 'primary' && 'text-primary-foreground',
          variant === 'secondary' && 'text-secondary-foreground',
          variant === 'outline' && 'text-primary',
          variant === 'ghost' && 'text-primary',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg'
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
