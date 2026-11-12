import React from "react";
import { BACKGROUND_COLORS } from "../design-system";

function ProgressBar({ value }) {
  const clampedValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="bg-orange-100 rounded-full h-2 overflow-hidden border border-orange-200/50">
      <div
        className={`${BACKGROUND_COLORS.bgPrimary} h-full text-white font-medium transition-all duration-300 rounded-full`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

export default ProgressBar;
