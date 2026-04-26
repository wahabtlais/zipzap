import React from "react";

const Ratings = ({ rating = 0 }: { rating?: number }) => {
  const clampedRating = Math.min(5, Math.max(0, rating));

  return (
    <div className="flex items-center gap-2 pb-2">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill =
            clampedRating >= star
              ? "full"
              : clampedRating >= star - 0.5
                ? "half"
                : "empty";

          return (
            <span key={star} className="relative inline-block w-4 h-4">
              {/* Empty star (base) */}
              <svg
                viewBox="0 0 20 20"
                className="w-4 h-4 text-gray-200"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              {/* Filled / half overlay */}
              {fill !== "empty" && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: fill === "half" ? "50%" : "100%" }}
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-4 h-4 text-amber-400"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Numeric rating */}
      <span className="text-sm font-semibold text-gray-700">
        {clampedRating.toFixed(1)}
      </span>
    </div>
  );
};

export default Ratings;
