import { useMemo, useState } from "react";

// Lightweight, dependency-free interactive graphs/calculators for GRAPH-format
// visuals. Pure SVG so it renders instantly and works with reduced motion.

const W = 520;
const H = 300;
const PAD = 44;

function toPath(points: Array<[number, number]>): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

/** Enzyme activity vs temperature: rises to an optimum, then denatures. */
function EnzymeTempGraph() {
  const optimum = 37;
  const denatureEnd = 60;
  const [temp, setTemp] = useState(optimum);

  const rateAt = (t: number) => {
    if (t <= optimum) return t / optimum;
    if (t >= denatureEnd) return 0;
    return 1 - (t - optimum) / (denatureEnd - optimum);
  };

  const points = useMemo<Array<[number, number]>>(() => {
    const pts: Array<[number, number]> = [];
    for (let t = 0; t <= 70; t += 1) {
      const x = PAD + (t / 70) * (W - 2 * PAD);
      const y = H - PAD - rateAt(t) * (H - 2 * PAD);
      pts.push([x, y]);
    }
    return pts;
  }, []);

  const markerX = PAD + (temp / 70) * (W - 2 * PAD);
  const markerY = H - PAD - rateAt(temp) * (H - 2 * PAD);

  return (
    <div className="igb-graph">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Graph of enzyme activity against temperature, peaking at the optimum then falling as the enzyme denatures.">
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} className="axis" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} className="axis" />
        <path d={toPath(points)} className="curve" />
        <line x1={markerX} y1={PAD} x2={markerX} y2={H - PAD} className="marker" />
        <circle cx={markerX} cy={markerY} r={6} className="dot" />
        <text x={W / 2} y={H - 10} className="axis-label">Temperature (°C)</text>
        <text x={14} y={H / 2} className="axis-label" transform={`rotate(-90 14 ${H / 2})`}>Rate of reaction</text>
      </svg>
      <label className="igb-graph-slider">
        Temperature: <strong>{temp}°C</strong>
        <input type="range" min={0} max={70} value={temp} onChange={(e) => setTemp(Number(e.target.value))} />
      </label>
      <p className="igb-graph-note">
        {temp < optimum
          ? "Below the optimum: more heat means more collisions, so the rate rises."
          : temp === optimum
            ? "At the optimum (~37°C) the rate is highest."
            : temp < denatureEnd
              ? "Above the optimum the enzyme is denaturing — the active site changes shape, so the rate falls."
              : "The enzyme is fully denatured — the rate is zero."}
      </p>
    </div>
  );
}

/** Enzyme activity vs pH: a peak at the optimum pH. */
function EnzymePhGraph() {
  const optimum = 7;
  const [ph, setPh] = useState(optimum);
  const rateAt = (p: number) => Math.max(0, 1 - Math.abs(p - optimum) / 5);

  const points = useMemo<Array<[number, number]>>(() => {
    const pts: Array<[number, number]> = [];
    for (let p = 1; p <= 13; p += 0.2) {
      const x = PAD + ((p - 1) / 12) * (W - 2 * PAD);
      const y = H - PAD - rateAt(p) * (H - 2 * PAD);
      pts.push([x, y]);
    }
    return pts;
  }, []);

  const markerX = PAD + ((ph - 1) / 12) * (W - 2 * PAD);
  const markerY = H - PAD - rateAt(ph) * (H - 2 * PAD);

  return (
    <div className="igb-graph">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Graph of enzyme activity against pH, peaking at the optimum pH.">
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} className="axis" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} className="axis" />
        <path d={toPath(points)} className="curve" />
        <line x1={markerX} y1={PAD} x2={markerX} y2={H - PAD} className="marker" />
        <circle cx={markerX} cy={markerY} r={6} className="dot" />
        <text x={W / 2} y={H - 10} className="axis-label">pH</text>
        <text x={14} y={H / 2} className="axis-label" transform={`rotate(-90 14 ${H / 2})`}>Rate of reaction</text>
      </svg>
      <label className="igb-graph-slider">
        pH: <strong>{ph.toFixed(1)}</strong>
        <input type="range" min={1} max={13} step={0.5} value={ph} onChange={(e) => setPh(Number(e.target.value))} />
      </label>
      <p className="igb-graph-note">
        {Math.abs(ph - optimum) < 0.6
          ? "At the optimum pH the rate is highest."
          : "Away from the optimum pH the active site changes shape (denatures), so fewer substrates fit and the rate falls."}
      </p>
    </div>
  );
}

/** Magnification calculator: magnification = image size ÷ actual size. */
function MagnificationCalculator() {
  const [image, setImage] = useState(30); // mm
  const [actual, setActual] = useState(60); // µm
  // Convert image mm -> µm for a consistent calculation.
  const imageUm = image * 1000;
  const magnification = actual > 0 ? Math.round(imageUm / actual) : 0;

  return (
    <div className="igb-calc">
      <p className="igb-calc-formula">magnification = image size ÷ actual size</p>
      <div className="igb-calc-grid">
        <label>
          Image size (mm)
          <input type="number" min={0} value={image} onChange={(e) => setImage(Number(e.target.value))} />
        </label>
        <label>
          Actual size (µm)
          <input type="number" min={0} value={actual} onChange={(e) => setActual(Number(e.target.value))} />
        </label>
      </div>
      <p className="igb-calc-result">
        {image} mm = {imageUm.toLocaleString()} µm, so magnification = <strong>×{magnification.toLocaleString()}</strong>
      </p>
      <p className="igb-graph-note">
        Always convert both measurements to the same unit (1 mm = 1000 µm) before dividing.
      </p>
    </div>
  );
}

export function GraphViewer({ slug }: { slug: string }) {
  if (slug === "enzyme-temperature") return <EnzymeTempGraph />;
  if (slug === "enzyme-ph") return <EnzymePhGraph />;
  if (slug === "magnification") return <MagnificationCalculator />;
  return <p className="igb-graph-note">Interactive graph coming soon for this topic.</p>;
}
