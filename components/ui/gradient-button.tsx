import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ComponentProps<"button"> {
  wrapperClassName?: string;
}

function GradientButton({ ...props }: GradientButtonProps) {
  const { className, wrapperClassName, ...rest } = props;
  return (
    <div
      className={cn(
        "relative inline-flex rounded-md p-[1px] bg-gradient-to-br from-transparent via-accent to-primary transition-all",
        wrapperClassName,
      )}
    >
      <Button
        data-slot="gradient-button"
        size="lg"
        variant="gradient"
        className={cn(className, "hover:bg-primary")}
        {...rest}
      />
    </div>
  );
}

export { GradientButton };
