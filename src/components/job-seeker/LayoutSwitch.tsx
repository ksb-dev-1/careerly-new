"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { Dispatch, SetStateAction } from "react";

// components
import { Button } from "@/components/ui/button";

// 3rd party
import { LayoutList, LayoutGrid } from "lucide-react";

type Layout = "list" | "grid";

interface LayoutSwitchProps {
  layout: Layout;
  setLayout: Dispatch<SetStateAction<Layout>>;
}

export function LayoutSwitch({ layout, setLayout }: LayoutSwitchProps) {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <Button
        size="icon"
        variant={`${layout === "list" ? "ghost" : "outline"}`}
        aria-label="list-layout"
        onClick={() => setLayout("list")}
        className={`border ${layout === "list" ? "bg-brand/20 text-brand border-brand/30 hover:text-brand! hover:bg-brand/30!" : ""}`}
      >
        <LayoutList />
      </Button>
      <Button
        size="icon"
        variant={`${layout === "grid" ? "ghost" : "outline"}`}
        aria-label="grid-layout"
        onClick={() => setLayout("grid")}
        className={`border ${layout === "grid" ? "bg-brand/20 text-brand border-brand/30 hover:text-brand! hover:bg-brand/30!" : ""}`}
      >
        <LayoutGrid />
      </Button>
    </div>
  );
}
