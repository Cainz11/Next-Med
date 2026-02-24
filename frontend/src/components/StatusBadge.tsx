interface StatusBadgeProps {
  status: string;
  label?: string;
}

const STATUS_MAP: Record<string, { className: string; label: string }> = {
  Scheduled: { className: 'badge-success', label: 'Agendada' },
  Completed: { className: 'badge-muted', label: 'Realizada' },
  Cancelled: { className: 'badge-danger', label: 'Cancelada' },
  NoShow: { className: 'badge-warning', label: 'Não compareceu' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { className: 'badge-muted', label: status };
  return (
    <span className={`badge ${config.className}`}>
      {label ?? config.label}
    </span>
  );
}
