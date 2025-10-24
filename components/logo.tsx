import Link from 'next/link'

interface LogoProps {
  variant?: 'default' | 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  href?: string
}

export function Logo({
  variant = 'default',
  size = 'md',
  showText = true,
  href = '/'
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  const textColorClasses = {
    default: 'text-gray-900',
    light: 'text-white',
    dark: 'text-gray-900'
  }

  const gradientClasses = {
    default: 'from-blue-600 to-purple-600',
    light: 'from-blue-400 to-purple-400',
    dark: 'from-blue-600 to-purple-600'
  }

  const LogoContent = () => (
    <div className="flex items-center gap-3 group">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer circle with gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[variant]} rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
          {/* Inner design - stylized meter bars */}
          <div className="absolute inset-0 flex items-end justify-center p-1.5 gap-0.5">
            <div className="w-1 bg-white rounded-full opacity-60" style={{ height: '40%' }}></div>
            <div className="w-1 bg-white rounded-full opacity-80" style={{ height: '65%' }}></div>
            <div className="w-1 bg-white rounded-full" style={{ height: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSizeClasses[size]} font-bold ${textColorClasses[variant]} group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
            ConsoFlow
          </span>
          <span className={`text-xs ${variant === 'light' ? 'text-blue-100' : 'text-gray-500'} tracking-wide`}>
            Smart Tracking
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
