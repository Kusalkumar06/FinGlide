import React from "react";

function ProgressBar(props) {
  const {value,width} = props
  return (
    <div className={`w-[${width}px] bg-[#F7DFCE] rounded-full h-2 overflow-hidden`}>
      <div
        className='bg-[#D36A37] h-6 text-white font-medium transition-all duration-300'
        style={{ width: `${value}%` }}
      >
      </div>
    </div>
  );
}

export default ProgressBar