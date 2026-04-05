import React from 'react'

const DisplayBox = ({boxName, className = ""}) => {
  return (
    <div className="flex flex-row">
      <div className={`border border-neutral-700 rounded-2xl text-white bg-neutral-900 ${className}`}>
        <div className="px-6 py-1">
          <h6 className="text-sm font-semibold">{boxName}</h6>
        </div>
        <hr className="border-neutral-700" />
      </div>
    </div>
  )
}

export default DisplayBox;
