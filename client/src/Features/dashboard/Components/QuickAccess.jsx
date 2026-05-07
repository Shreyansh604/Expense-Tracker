import React from 'react'

const QuickAccess = ({ featureName }) => {
  return (
    <button className="px-4 py-2 flex items-center justify-center bg-neutral-700 text-white p-2 rounded hover:bg-neutral-500 transition">
      {featureName}
    </button>
  );
};

export default QuickAccess;
