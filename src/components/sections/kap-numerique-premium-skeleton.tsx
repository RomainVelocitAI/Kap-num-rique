export default function KapNumeriquePremiumSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre skeleton */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-3/4 mx-auto" />
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/2 mx-auto" />
        </div>

        {/* Cards skeleton */}
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group">
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg">
                {/* Icon skeleton */}
                <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mb-6" />
                
                {/* Title skeleton */}
                <div className="h-8 bg-gray-300 rounded animate-pulse mb-4 w-3/4" />
                
                {/* Description skeleton */}
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-300 rounded animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-4/6" />
                </div>
                
                {/* Features skeleton */}
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
                      <div className="h-3 bg-gray-300 rounded animate-pulse flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}