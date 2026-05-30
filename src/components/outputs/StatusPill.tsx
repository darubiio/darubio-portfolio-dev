export function StatusPill({ label }: { label?: string }) {
  return (
    <span className="status-pill">
      <span className="dot" />
      {label}
    </span>
  );
}
