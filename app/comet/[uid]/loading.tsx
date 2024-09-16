export default function Loading() {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-300 h-64 rounded"></div>
            <div className="bg-gray-300 h-64 rounded"></div>
          </div>
        </div>
      </div>
    );
  }