export function ChipList({ items, accent = false }: { items: string[]; accent?: boolean }) {
  return (
    <div className="chips">
      {items.map((item) => (
        <span key={item} className={accent ? "chip accent" : "chip"}>
          {item}
        </span>
      ))}
    </div>
  );
}
