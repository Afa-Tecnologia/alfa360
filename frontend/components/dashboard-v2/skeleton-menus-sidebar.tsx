function SidebarSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
  const baseClasses = "bg-gray-600 animate-pulse rounded";

  // Skeleton itens do menu
  const menuItemsSkeleton = Array(6).fill(0).map((_, i) => (
    <div
      key={i}
      className={isCollapsed ? `h-6 w-6 my-3 mx-auto ${baseClasses}` : `h-6 w-full my-2 ${baseClasses}`}
    />
  ));

  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo skeleton */}
      <div className={isCollapsed ? `h-8 w-8 mb-6 ${baseClasses}` : `h-8 w-40 mb-6 ${baseClasses}`} />

      {/* Menu itens skeleton */}
      <nav className="flex flex-col flex-1 gap-2">{menuItemsSkeleton}</nav>

      {/* User info skeleton */}
      <div className={`mt-auto flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
        <div className={`rounded-full ${isCollapsed ? "h-8 w-8" : "h-10 w-10"} ${baseClasses}`} />
        {!isCollapsed && (
          <div className="flex-1 space-y-2">
            <div className={`h-4 w-32 ${baseClasses}`} />
            <div className={`h-3 w-48 ${baseClasses}`} />
          </div>
        )}
      </div>
    </div>
  );
}
