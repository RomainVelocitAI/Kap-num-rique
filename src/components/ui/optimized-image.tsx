import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  fill?: boolean
  sizes?: string
  quality?: number
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fill = false,
  sizes,
  quality = 85
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          quality={quality}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          className={`
            duration-700 ease-in-out
            ${isLoading ? 'scale-110 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0'}
          `}
          onLoadingComplete={() => setIsLoading(false)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          className={`
            duration-700 ease-in-out
            ${isLoading ? 'scale-110 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0'}
          `}
          onLoadingComplete={() => setIsLoading(false)}
        />
      )}
      
      {/* Skeleton pendant le chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}