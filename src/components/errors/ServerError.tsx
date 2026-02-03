// 3rd party
import { ServerOff } from "lucide-react";

export function ServerError({
  message = "Something went wrong. Please try again later.",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative h-14 w-14 rounded-full bg-brand/20 text-brand border border-brand/30">
        <ServerOff className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="font-bold text-xl mt-4">Internal Server Error - 500</p>
      <p className="text-slate-700 dark:text-muted-foreground mt-1 text-center">
        {message}
      </p>
    </div>
  );
}
