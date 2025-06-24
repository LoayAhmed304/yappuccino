const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-hidden bg-gradient-to-b from-base-50/30 to-base-100/50 backdrop-blur-sm">
      <div className="p-8 space-y-6">
        {skeletonMessages.map((_, idx) => (
          <div
            key={`message-skeleton-${idx}`}
            className={`flex ${
              idx % 2 === 0 ? "justify-start" : "justify-end"
            } group`}
          >
            <div
              className={`flex items-end gap-4 max-w-[75%] ${
                idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Avatar skeleton with enhanced styling */}
              <div className="shrink-0 mb-1">
                <div className="skeleton size-10 rounded-2xl" />
              </div>

              {/* Message bubble skeleton with layered design */}
              <div
                className={`flex flex-col ${
                  idx % 2 === 0 ? "items-start" : "items-end"
                }`}
              >
                {/* Timestamp skeleton */}
                <div
                  className={`mb-2 px-1 ${
                    idx % 2 === 0 ? "text-left" : "text-right"
                  }`}
                >
                  <div className="skeleton h-3 w-12 rounded" />
                </div>

                {/* Message content skeleton */}
                <div
                  className={`
                  relative p-4 rounded-2xl shadow-sm backdrop-blur-sm border
                  ${
                    idx % 2 === 0
                      ? "bg-base-100/80 border-base-300/40"
                      : "bg-primary/10 border-primary/20"
                  }
                `}
                >
                  {/* Message tail */}
                  <div
                    className={`
                    absolute w-3 h-3 transform rotate-45
                    ${
                      idx % 2 === 0
                        ? "bg-base-100/80 border-l border-b border-base-300/40 -left-1.5 bottom-3"
                        : "bg-primary/10 border-r border-b border-primary/20 -right-1.5 bottom-3"
                    }
                  `}
                  ></div>

                  {/* Varied skeleton content */}
                  {idx % 3 === 0 && (
                    <div className="mb-3">
                      <div className="skeleton w-40 h-24 rounded-xl" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="skeleton h-4 w-32 rounded" />
                    {idx % 2 === 0 && (
                      <div className="skeleton h-4 w-24 rounded" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSkeleton;
