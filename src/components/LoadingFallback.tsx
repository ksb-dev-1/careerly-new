// components
import { Spinner } from "@/components/Spinner";

export function LoadingFallback({ color }: { color?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-around">
      <Spinner size={32} color={color} />
    </div>
  );
}
