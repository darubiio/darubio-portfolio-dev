export function AboutBioLine({ line }: { line: string }) {
  if (line === "") return <div style={{ height: 8 }} />;

  const commentStart = line.indexOf("//");
  if (commentStart === -1) return <div className="row">{line}</div>;

  return (
    <div className="row">
      {line.slice(0, commentStart)}
      <span className="cmt">{line.slice(commentStart)}</span>
    </div>
  );
}
