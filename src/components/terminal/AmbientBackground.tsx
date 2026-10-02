import { PointerGlow } from "@/components/terminal/PointerGlow";

export function AmbientBackground() {
  return (
    <div className="bg-stage" aria-hidden>
      <div className="wash" />
      <div className="drift">
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
          {/* Rings collected from the pointer join here (PointerGlow.tsx). */}
          <div className="ring-pool" />
        </div>
      </div>
      <div className="vignette" />
      <PointerGlow />
    </div>
  );
}
