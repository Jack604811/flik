export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex px-3 py-2 border-amber-600 border gap-3 items-center  self-start">
      <span className="text-2xl">⚠️</span>
      <span className="">{children}</span>
    </div>
  );
}
