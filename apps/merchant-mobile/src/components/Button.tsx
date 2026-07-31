import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  title: string;
  className?: string;
  onPress?: (event: any) => void;
  disabled?: boolean;
}

export function Button({ variant = 'primary', size = 'md', title, className, style, ...props }: ButtonProps & { style?: any }) {
  return (
    <TouchableOpacity
      className={twMerge(
        'items-center justify-center rounded-[16px] flex-row',
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
          size === 'sm' && 'text-[14px]',
          size === 'md' && 'text-[16px]',
          size === 'lg' && 'text-[18px]'
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
