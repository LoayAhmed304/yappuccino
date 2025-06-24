import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 6 skeleton items for better visual hierarchy
  const skeletonContacts = Array(6).fill(null);

  return (
    <aside className="h-full w-20 lg:w-80 flex flex-col transition-all duration-300">
      {/* Header skeleton with enhanced spacing */}
      <div className="p-8 border-b border-base-300/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-base-300/30 rounded-xl">
            <Users className="size-7 text-base-content/40" />
          </div>
          <div className="skeleton h-5 w-24 hidden lg:block rounded-lg" />
        </div>

        {/* Filter section skeleton */}
        <div className="hidden lg:block">
          <div className="bg-base-200/30 rounded-2xl p-4 backdrop-blur-sm border border-base-300/30">
            <div className="flex items-center gap-3">
              <div className="skeleton w-4 h-4 rounded" />
              <div className="skeleton h-4 w-32 rounded-lg" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-base-300/50 rounded-full" />
              <div className="skeleton h-3 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Skeleton Contacts with enhanced design */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="w-full p-5 flex items-center gap-4 rounded-2xl bg-base-100/30 backdrop-blur-sm border border-base-300/20"
          >
            {/* Avatar skeleton with enhanced styling */}
            <div className="relative mx-auto lg:mx-0 shrink-0">
              <div className="skeleton size-14 rounded-2xl" />
              {/* Online indicator skeleton */}
              <div className="absolute -bottom-1 -right-1">
                <div className="size-5 bg-base-300/40 rounded-full ring-2 ring-base-100" />
              </div>
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2 rounded-lg" />
              <div className="flex items-center gap-2">
                <div className="skeleton w-2 h-2 rounded-full" />
                <div className="skeleton h-3 w-16 rounded-lg" />
              </div>
            </div>

            {/* Hover indicator skeleton */}
            <div className="hidden lg:block">
              <div className="w-2 h-8 bg-base-300/20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
