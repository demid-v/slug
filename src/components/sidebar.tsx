"use client";

import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useState } from "react";

const Sidebar = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((isOpen) => !isOpen);

  return (
    <div
      className="transition- flex min-w-fit gap-1 pl-3"
      style={{ scrollbarWidth: "thin" }}
    >
      {isOpen && children}
      <Button variant="ghost" onClick={toggleSidebar}>
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </Button>
    </div>
  );
};

export default Sidebar;