export default function Loading() {
  return (
    <div className="h-[200px] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-egyptian-blue/20 border-t-egyptian-blue rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading business details...</p>
      </div>
    </div>
  );
}
