import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ComponentProps<"button"> {
  wrapperClassName?: string;
}

function GradientButton({ ...props }: GradientButtonProps) {
  const { className, ...rest } = props;
  return (
    <Button
      data-slot="gradient-button"
      size="lg"
      className={cn(
        className,
        "inline-flex items-center gap-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 px-4 py-2 h-auto justify-center whitespace-normal text-start",
      )}
      {...rest}
    />
  );
}

export { GradientButton };
