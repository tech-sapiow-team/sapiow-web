"use client";

export default function SubCategorySkeleton() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mt-5 mb-2 px-0 w-full min-w-0 max-w-full overflow-x-hidden animate-pulse">
      <div className="min-w-0 max-w-full overflow-x-auto pr-2 overscroll-x-contain">
        <div className="flex items-center gap-4 w-max">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[42px] w-24 bg-gray-200 rounded-full border border-gray-100 flex-shrink-0"
            ></div>
          ))}
        </div>
      </div>

      <div className="w-[98px] h-[40px] rounded-[8px] bg-gray-200 border border-gray-100 flex-shrink-0"></div>
    </div>
  );
}
