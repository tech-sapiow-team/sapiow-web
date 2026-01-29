"use client";


export default function CategorySkeleton() {
  return (
    <div className="flex items-center overflow-x-auto scrollbar-hide gap-6 py-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div className="h-3 w-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
