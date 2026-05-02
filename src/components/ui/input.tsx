import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
