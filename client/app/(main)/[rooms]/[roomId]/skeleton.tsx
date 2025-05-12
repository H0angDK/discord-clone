import clsx from "@/features/clsx";
const Loading = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <HeaderSkeleton />
      <MessageListSkeleton />
      <FooterSkeleton />
    </div>
  );
};

function HeaderSkeleton() {
  return (
    <div className="h-12 bg-surface-200 w-full sticky top-0 z-10 border-b border-border-heavy px-3 flex items-center justify-between animate-pulse">
      <div className="flex items-center rounded-lg bg-surface-400 w-full h-2/3"></div>
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="p-4 space-y-4 overflow-y-scroll flex-1">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          suppressHydrationWarning
          className={clsx(
            "h-10 rounded",
            Math.random() > 0.6 ? "bg-primary/40 ml-auto" : "bg-secondary/40"
          )}
          style={{ width: `${Math.random() * 40 + 30}%` }}
        />
      ))}
    </div>
  );
}

function FooterSkeleton() {
  return (
    <div className="bg-surface-200 w-full sticky bottom-0 z-10 p p-2 border-t border-border-heavy min-h-16 flex items-center justify-between">
      <div className="animate-pulse h-9/10 w-full bg-surface-400 rounded-lg"></div>
    </div>
  );
}

export { Loading };
