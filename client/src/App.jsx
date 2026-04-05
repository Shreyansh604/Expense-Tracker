import { useState } from "react";
import "./App.css";
import DisplayBox from "./Features/dashboard/Components/DisplayBox";
import SideBar from "./Components/SideBar";

function App() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="pl-28 bg-[#0b0b0b] text-white flex-1 justify-end">
        {/* Right side container */}
        <div className="w-full flex justify-center">
          {/* Centered content */}
          <div className="w-full max-w-5xl grid gap-4 p-4">
            {/* Row 1 */}
            <div className="grid grid-cols-[2fr_3fr] gap-4">
              <DisplayBox boxName="Pending Tasks" className={"w-106 h-60"} />
              <DisplayBox boxName="Recent Expenses" className={"w-106 h-60"} />
            </div>

            {/* Row 2 */}
            <DisplayBox boxName="Quick Access" className={"w-216 h-30"} />

            {/* Row 3 */}
            <DisplayBox boxName="Monthly Report" className={"w-216 h-60"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
