import Image from "next/image";
import { Badge } from "./ui/badge";

interface UserAvatarProps {
  user: {
    name: string;
    email: string;
    image: string;
    subscription: "free" | "pro" | "enterprise";
  };
}

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        loading="eager"
        className="object-cover rounded-full"
        src={user.image}
        alt={user.name}
        width={240}
        height={240}
      />
      <p className="text-2xl font-semibold ">{user.name}</p>
      <p className="text-accent">{user.email}</p>
      <Badge
        variant={user.subscription === "free" ? "outline" : "default"}
        className="text-xs text-muted-foreground rounded-full capitalize"
      >
        {user.subscription} Plan
      </Badge>
    </div>
  );
}
