export type StatusType =
  | "New Lead"
  | "Interested"
  | "Ordered"
  | "Completed"
  | "Lost";

const STATUS_CONFIG: Record<StatusType, { label: string; classes: string; emoji: string }> = {
  "New Lead": { label: "Naya Lead", classes: "bg-blue-100 text-blue-700 border-blue-200", emoji: "🌟" },
  Interested: { label: "Interested", classes: "bg-yellow-100 text-yellow-700 border-yellow-200", emoji: "🤔" },
  Ordered: { label: "Order Diya", classes: "bg-purple-100 text-purple-700 border-purple-200", emoji: "📦" },
  Completed: { label: "Complete", classes: "bg-green-100 text-green-700 border-green-200", emoji: "✅" },
  Lost: { label: "Lost", classes: "bg-red-100 text-red-700 border-red-200", emoji: "❌" },
};

export default function StatusBadge({ status }: { status: StatusType }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    classes: "bg-gray-100 text-gray-600 border-gray-200",
    emoji: "•",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${config.classes}`}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
