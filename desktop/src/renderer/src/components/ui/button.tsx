import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    default: 'bg-[oklch(0.488_0.243_264.376)] text-white hover:opacity-90',
    secondary: 'bg-neutral-800 text-neutral-50 hover:bg-neutral-700',
    outline: 'border border-neutral-700 bg-transparent text-neutral-50 hover:bg-neutral-800',
    ghost: 'text-neutral-50 hover:bg-neutral-800',
    link: 'text-[oklch(0.488_0.243_264.376)] underline-offset-4 hover:underline'
  }

  const sizes = {
    default: 'px-4 py-2 text-sm leading-5',
    sm: 'h-9 px-3 text-xs',
    lg: 'h-11 px-8 text-base',
    icon: 'h-10 w-10'
  }

  const variantClass = variants[variant] || variants.default
  const sizeClass = sizes[size] || sizes.default

  return (
    <button className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
