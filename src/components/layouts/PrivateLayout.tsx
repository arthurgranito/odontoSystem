import { useState } from "react";
import Sidebar from "../common/Sidebar";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <main
        className={`flex-1 transition-all duration-500 ease-in-out ${
          expanded ? "ml-64" : "ml-14"
        }`}
      >
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default PrivateLayout; 