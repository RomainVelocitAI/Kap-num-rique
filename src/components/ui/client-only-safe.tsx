'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ClientOnlySafeProps {
  children: ReactNode
  fallback?: ReactNode
  delay?: number
}

export default function ClientOnlySafe({ 
  children, 
  fallback = null,
  delay = 0 
}: ClientOnlySafeProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}