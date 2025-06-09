import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

function GradientButton({ ...props }: React.ComponentProps<"button">) {
  const { className, ...rest } = props;
  return (
    <div className="relative inline-flex rounded-md p-[1px] bg-gradient-to-br from-transparent via-accent to-primary transition-all">
      <Button
        data-slot="gradient-button"
        size="lg"
        variant="secondary"
        className={cn(className, "hover:bg-primary")}
        {...rest}
      />
    </div>
  );
}

export { GradientButton };
