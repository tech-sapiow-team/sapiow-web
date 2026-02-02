"use client";


export default function SubCategorySkeleton() {
  return (
    <div className="flex items-center justify-between mt-5 mb-2 px-0 animate-pulse">
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide flex-1 min-w-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[42px] w-24 bg-gray-200 rounded-full border border-gray-100 flex-shrink-0"
          ></div>
        ))}
      </div>

      <div className="w-[98px] h-[40px] rounded-[8px] bg-gray-200 border border-gray-100 flex-shrink-0 ml-4"></div>
    </div>
  );
}
