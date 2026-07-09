import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-blue-600", "bg-emerald-600", "bg-violet-600", "bg-rose-600",
  "bg-amber-600", "bg-cyan-600", "bg-indigo-600", "bg-fuchsia-600",
];

function hashToIndex(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % PALETTE.length;
}

export function AvatarBadge({ label, size = "md" }: { label: string; size?: "sm" | "md" | "lg" }) {
  const color = PALETTE[hashToIndex(label)];
  const sizeClasses = { sm: "size-6 text-[10px]", md: "size-8 text-xs", lg: "size-11 text-sm" }[size];
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full font-bold text-white", color, sizeClasses)}>
      {label.slice(0, 2).toUpperCase()}
    </span>
  );
}
