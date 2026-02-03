// 3rd party
import { Ban } from "lucide-react";

export function UnauthenticatedError({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative h-14 w-14 rounded-full bg-brand/20 text-brand border border-brand/30">
        <Ban className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="font-bold text-xl mt-4">Unauthenticated - 401</p>
      <p className="text-lg text-slate-700 dark:text-muted-foreground mt-1 text-center">
        {message}
      </p>
    </div>
  );
}
