import { GradientButton } from "./ui/gradient-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowRightIcon } from "lucide-react";

interface MessageUsageProps {
  resetsAt: Date;
  standard: {
    usage: number;
    limit: number;
  };
  premium?: {
    usage: number;
    limit: number;
  };
}

export default function MessageUsage({
  resetsAt,
  standard,
  premium,
}: MessageUsageProps) {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="font-semibold flex justify-between items-center">
          <span className="text-sm text-foreground font-semibold">
            Message Usage
          </span>
          <span className="text-muted-foreground text-xs">
            Resets{" "}
            {new Date(resetsAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex w-full justify-between gap-2">
            <h3 className="text-sm text-foreground font-semibold">Standard</h3>
            <p className="text-xs text-muted-foreground">
              {standard.usage}/{standard.limit}
            </p>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div
              style={{ width: `${(standard.usage / standard.limit) * 100}%` }}
              className="h-full bg-primary rounded-l-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {standard.limit - standard.usage} messages remaining
          </p>
        </div>
        {premium && (
          <div className="space-y-2">
            <div className="flex w-full justify-between gap-2">
              <h3 className="text-sm text-foreground font-semibold">Premium</h3>
              <span className="text-xs text-muted-foreground">
                {premium?.usage}/{premium?.limit}
              </span>
            </div>
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <div
                style={{ width: `${(premium.usage / premium.limit) * 100}%` }}
                className="h-full bg-primary rounded-l-full"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {premium.limit - premium.usage} messages remaining
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {premium ? (
          <GradientButton className="font-semibold text-primary-foreground cursor-pointer">
            Buy more Premium Credits <ArrowRightIcon className="w-4 h-4" />
          </GradientButton>
        ) : (
          <GradientButton className="font-semibold text-primary-foreground cursor-pointer">
            Upgrade <ArrowRightIcon className="w-4 h-4" />
          </GradientButton>
        )}
      </CardFooter>
    </Card>
  );
}
