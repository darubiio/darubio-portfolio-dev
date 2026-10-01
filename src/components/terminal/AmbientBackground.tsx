export function AmbientBackground() {
  return (
    <div className="bg-stage" aria-hidden>
      <div className="wash" />
      <div className="gyro">
        <div className="tilt t1">
          <div className="ring r1" />
        </div>
        <div className="tilt t2">
          <div className="ring r2" />
        </div>
        <div className="tilt t3">
          <div className="ring r3" />
        </div>
      </div>
      <div className="vignette" />
    </div>
  );
}
