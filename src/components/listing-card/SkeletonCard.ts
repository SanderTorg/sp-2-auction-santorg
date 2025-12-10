export default function SkeletonCard(): string {
  return `
    <div class="block bg-white rounded-lg shadow-md overflow-hidden relative">
      <div class="w-full h-48 bg-gray-200 animate-pulse"></div>
      <div class="absolute top-2 right-2 w-16 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
      <div class="flex flex-col p-4 gap-3">
        <div class="h-7 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="flex flex-col gap-2">
          <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        
        <div class="flex justify-between items-center mt-2">
          <div class="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div class="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  `;
}
