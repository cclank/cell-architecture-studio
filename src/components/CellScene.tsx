import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Float, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import {
  Color,
  CatmullRomCurve3,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshStandardMaterial,
  TubeGeometry,
  Vector3,
  type Material,
  type MeshStandardMaterialParameters,
} from "three";
import type { MoleculeItem, MoleculeModelAsset, ViewMode } from "../data/molecules";

type MoleculeSceneProps = {
  molecule: MoleculeItem;
  activeComponent: string;
  viewMode: ViewMode;
  crossSection: boolean;
  autoRotate: boolean;
  resetKey: number;
};

type MaterialProps = {
  id: string;
  activeComponent: string;
  viewMode: ViewMode;
  color: string;
  opacity?: number;
  roughness?: number;
  metalness?: number;
};

function AtomMaterial({
  id,
  activeComponent,
  viewMode,
  color,
  opacity = 1,
  roughness = 0.38,
  metalness = 0.12,
}: MaterialProps) {
  const active = id === activeComponent;
  const dimmed = viewMode === "focus" && !active;
  const material: MeshStandardMaterialParameters = {
    color,
    roughness,
    metalness,
    transparent: opacity < 1 || dimmed,
    opacity: dimmed ? Math.min(opacity, 0.14) : opacity,
    emissive: active ? color : "#000000",
    emissiveIntensity: active ? 0.42 : 0,
  };

  return <meshStandardMaterial {...material} />;
}

type CommonModelProps = {
  activeComponent: string;
  viewMode: ViewMode;
  crossSection: boolean;
};

type AtomProps = CommonModelProps & {
  id: string;
  position: [number, number, number];
  radius: number;
  color: string;
  opacity?: number;
};

function Atom({ id, position, radius, color, opacity = 1, activeComponent, viewMode, crossSection }: AtomProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={[radius, 36, 36]} />
      <AtomMaterial id={id} activeComponent={activeComponent} viewMode={viewMode} color={color} opacity={opacity} />
    </mesh>
  );
}

type BondProps = CommonModelProps & {
  id: string;
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  color: string;
};

function Bond({ id, from, to, radius = 0.055, color, activeComponent, viewMode, crossSection }: BondProps) {
  const geometry = useMemo(() => {
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2,
      (from[2] + to[2]) / 2,
    ];
    const curve = new CatmullRomCurve3([from, mid, to].map(([x, y, z]) => new Vector3(x, y, z)));
    return new TubeGeometry(curve, 24, radius, 10, false);
  }, [from, to, radius]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <AtomMaterial id={id} activeComponent={activeComponent} viewMode={viewMode} color={color} roughness={0.44} />
    </mesh>
  );
}

// ── Procedural asset pipeline (kept for optional GLB molecules) ──────────────

function applyAssetVertexColors(mesh: Mesh, molecule: MoleculeItem) {
  const geometry = mesh.geometry;
  const position = geometry.getAttribute("position");
  if (!position) return;

  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return;

  const sizeX = Math.max(box.max.x - box.min.x, 0.001);
  const sizeY = Math.max(box.max.y - box.min.y, 0.001);
  const sizeZ = Math.max(box.max.z - box.min.z, 0.001);
  const palette = [
    new Color(molecule.color),
    new Color(molecule.accent),
    ...molecule.components.map((c) => new Color(c.color)),
  ];
  const highlight = new Color("#fff4d8");
  const shadow = new Color("#3d4a72");
  const colors: number[] = [];

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const nx = (x - box.min.x) / sizeX;
    const ny = (y - box.min.y) / sizeY;
    const nz = (z - box.min.z) / sizeZ;
    const flow = Math.sin(nx * 11.6 + ny * 4.8) + Math.cos(ny * 9.4 + nz * 7.2);
    const paletteIndex = Math.abs(Math.floor((flow + nx * 3.2 + ny * 2.6) * palette.length)) % palette.length;
    const color = new Color(molecule.color).lerp(palette[paletteIndex], 0.48);
    color.lerp(highlight, Math.max(0, nz - 0.24) * 0.22);
    color.lerp(shadow, Math.max(0, 0.32 - nz) * 0.12);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
}

function createAssetMaterial({
  original,
  molecule,
  viewMode,
  crossSection,
}: {
  original: Mesh["material"];
  molecule: MoleculeItem;
  meshIndex: number;
  viewMode: ViewMode;
  crossSection: boolean;
}) {
  const source = Array.isArray(original) ? original[0] : original;
  const sourceMaterial = source as Partial<MeshStandardMaterial>;
  const material = new MeshStandardMaterial({
    color: "#ffffff",
    map: sourceMaterial.map ?? null,
    normalMap: sourceMaterial.normalMap ?? null,
    roughnessMap: sourceMaterial.roughnessMap ?? null,
    metalnessMap: sourceMaterial.metalnessMap ?? null,
    side: DoubleSide,
    vertexColors: true,
    transparent: crossSection || viewMode === "focus" || sourceMaterial.transparent,
    opacity: crossSection ? 0.92 : viewMode === "focus" ? 0.95 : sourceMaterial.opacity ?? 1,
    roughness: Math.min(0.82, sourceMaterial.roughness ?? 0.46),
    metalness: Math.min(0.12, sourceMaterial.metalness ?? 0.03),
    emissive: new Color(molecule.accent).lerp(new Color("#ffffff"), 0.58),
    emissiveIntensity: viewMode === "focus" ? 0.045 : 0.016,
  });
  material.envMapIntensity = 0.75 * (molecule.modelAsset?.exposure ?? 1);
  material.needsUpdate = true;
  return material;
}

function createNativeAssetMaterial({
  original,
  asset,
  crossSection,
}: {
  original: Mesh["material"];
  asset: MoleculeModelAsset;
  crossSection: boolean;
}) {
  const cloneMaterial = (source: Material) => {
    const material = source.clone();
    material.side = DoubleSide;
    material.transparent = crossSection || material.transparent;
    material.opacity = crossSection ? Math.min(material.opacity, 0.86) : material.opacity;
    if (material instanceof MeshStandardMaterial) {
      const displayMap = material.map ?? null;
      if (displayMap) {
        displayMap.anisotropy = 8;
        displayMap.needsUpdate = true;
      }
      material.vertexColors = false;
      material.emissive = new Color("#fff8eb");
      material.emissiveMap = displayMap;
      material.emissiveIntensity = 0.07 * (asset.exposure ?? 1);
      material.envMapIntensity = 0.62 * (asset.exposure ?? 1);
      material.roughness = Math.max(0.34, Math.min(material.roughness, 0.58));
      material.metalness = Math.min(material.metalness, 0.08);
      material.color.setRGB(1.04, 1.035, 1.02);
    }
    material.needsUpdate = true;
    return material;
  };
  return Array.isArray(original) ? original.map(cloneMaterial) : cloneMaterial(original);
}

function AssetMoleculeModel({
  molecule,
  asset,
  viewMode,
  crossSection,
}: CommonModelProps & {
  molecule: MoleculeItem;
  asset: MoleculeModelAsset;
}) {
  const { scene } = useGLTF(asset.url);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    let meshIndex = 0;
    clone.traverse((node) => {
      const mesh = node as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (asset.materialMode === "native") {
        mesh.material = createNativeAssetMaterial({ original: mesh.material, asset, crossSection });
      } else {
        mesh.geometry.computeVertexNormals();
        applyAssetVertexColors(mesh, molecule);
        mesh.material = createAssetMaterial({ original: mesh.material, molecule, meshIndex, viewMode, crossSection });
      }
      meshIndex += 1;
    });
    return clone;
  }, [molecule, scene, viewMode, crossSection]);

  return (
    <group position={asset.position ?? [0, 0, 0]} rotation={asset.rotation ?? [0, 0, 0]} scale={[asset.scale, asset.scale, asset.scale]}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

// ── Molecular models ─────────────────────────────────────────────────────────

// H₂O — bent, 104.5° bond angle, two lone pairs shown as faint lobes
function WaterModel({ activeComponent, viewMode, crossSection }: CommonModelProps) {
  return (
    <group rotation={[0.1, -0.3, 0.05]} scale={[1.05, 1.05, 1.05]}>
      {/* Oxygen */}
      <Atom id="ohBond" position={[0, 0, 0]} radius={0.6} color="#cc3322" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Hydrogen atoms at 104.5° */}
      <Atom id="ohBond" position={[1.35, 1.02, 0]} radius={0.32} color="#e8e8e8" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Atom id="ohBond" position={[-1.35, 1.02, 0]} radius={0.32} color="#e8e8e8" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* O–H bonds */}
      <Bond id="ohBond" from={[0, 0, 0]} to={[1.35, 1.02, 0]} radius={0.055} color="#cc8866" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="ohBond" from={[0, 0, 0]} to={[-1.35, 1.02, 0]} radius={0.055} color="#cc8866" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Lone pair lobes */}
      <Atom id="lonePair" position={[0.52, -0.72, 0.58]} radius={0.3} color="#9966cc" opacity={0.52} activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Atom id="lonePair" position={[-0.52, -0.72, -0.58]} radius={0.3} color="#9966cc" opacity={0.52} activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Dipole arrow (tube pointing toward O) */}
      <Bond id="dipole" from={[0, 0.75, 0]} to={[0, -0.55, 0]} radius={0.04} color="#2266bb" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Atom id="dipole" position={[0, -0.7, 0]} radius={0.1} color="#2266bb" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
    </group>
  );
}

// CH₄ — tetrahedral, four C–H bonds, faint VdW sphere
function MethaneModel({ activeComponent, viewMode, crossSection }: CommonModelProps) {
  const hPositions: [number, number, number][] = [
    [1.3, 1.3, 1.3],
    [1.3, -1.3, -1.3],
    [-1.3, 1.3, -1.3],
    [-1.3, -1.3, 1.3],
  ];

  return (
    <group rotation={[0.15, -0.25, 0.08]} scale={[0.88, 0.88, 0.88]}>
      {/* Van der Waals surface */}
      <mesh>
        <sphereGeometry args={[2.18, 48, 48]} />
        <AtomMaterial id="vdw" activeComponent={activeComponent} viewMode={viewMode} color="#aaccff" opacity={crossSection ? 0.06 : 0.1} />
      </mesh>
      {/* Central carbon */}
      <Atom id="carbon" position={[0, 0, 0]} radius={0.5} color="#555555" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Hydrogen atoms and C–H bonds */}
      {hPositions.map((pos, i) => (
        <group key={i}>
          <Atom id="chBond" position={pos} radius={0.3} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
          <Bond id="chBond" from={[0, 0, 0]} to={pos} radius={0.048} color="#999999" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
        </group>
      ))}
    </group>
  );
}

// C₆H₁₂O₆ — pyranose ring with OH groups
function GlucoseModel({ activeComponent, viewMode, crossSection }: CommonModelProps) {
  // Hexagonal ring in XZ plane (5C + 1O)
  const ringAtoms: Array<{ id: string; pos: [number, number, number]; color: string; radius: number }> = [
    { id: "anomericC", pos: [1.5, 0, 0], color: "#555555", radius: 0.38 },       // C1 anomeric
    { id: "ring", pos: [0.75, 0, 1.3], color: "#555555", radius: 0.38 },          // C2
    { id: "ring", pos: [-0.75, 0, 1.3], color: "#555555", radius: 0.38 },         // C3
    { id: "ring", pos: [-1.5, 0, 0], color: "#555555", radius: 0.38 },            // C4
    { id: "ring", pos: [-0.75, 0, -1.3], color: "#555555", radius: 0.38 },        // C5
    { id: "ring", pos: [0.75, 0, -1.3], color: "#cc4411", radius: 0.34 },         // Ring O
  ];

  // OH groups hanging below ring from each C
  const ohOxygens: [number, number, number][] = [
    [1.5, -1.15, 0.1],    // C1-OH
    [0.75, -1.15, 1.4],   // C2-OH
    [-0.75, -1.15, 1.4],  // C3-OH
    [-1.5, -1.15, 0.1],   // C4-OH
    [-0.75, -1.15, -1.4], // C5-OH (actually CH2OH direction)
  ];

  return (
    <group rotation={[0.38, -0.32, 0.04]} scale={[0.95, 0.95, 0.95]}>
      {/* Ring bonds */}
      {ringAtoms.map((atom, i) => {
        const next = ringAtoms[(i + 1) % 6];
        return (
          <Bond key={`rb-${i}`} id="ring" from={atom.pos} to={next.pos} radius={0.05} color="#776644" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
        );
      })}
      {/* Ring atoms */}
      {ringAtoms.map((atom, i) => (
        <Atom key={`ra-${i}`} id={atom.id} position={atom.pos} radius={atom.radius} color={atom.color} activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      ))}
      {/* OH groups (only on C atoms, not ring O) */}
      {ohOxygens.map((pos, i) => (
        <group key={`oh-${i}`}>
          <Bond id="hydroxyl" from={ringAtoms[i].pos} to={pos} radius={0.04} color="#cc8866" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
          <Atom id="hydroxyl" position={pos} radius={0.3} color="#cc4411" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
        </group>
      ))}
      {/* CH2OH exo group off C5 */}
      <Atom id="ring" position={[-0.75, 0.08, -2.5]} radius={0.34} color="#555555" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="ring" from={[-0.75, 0, -1.3]} to={[-0.75, 0.08, -2.5]} radius={0.04} color="#776644" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Atom id="hydroxyl" position={[-0.75, -1.1, -2.5]} radius={0.3} color="#cc4411" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="hydroxyl" from={[-0.75, 0.08, -2.5]} to={[-0.75, -1.1, -2.5]} radius={0.04} color="#cc8866" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
    </group>
  );
}

// NH₃ — trigonal pyramidal, lone pair shown at apex
function AmmoniaModel({ activeComponent, viewMode, crossSection }: CommonModelProps) {
  const hPositions: [number, number, number][] = [
    [1.22, -0.58, 0],
    [-0.61, -0.58, 1.06],
    [-0.61, -0.58, -1.06],
  ];

  return (
    <group rotation={[0.08, -0.28, 0.05]} scale={[1.05, 1.05, 1.05]}>
      {/* Lone pair lobe at apex */}
      <Atom id="lonePair" position={[0, 1.25, 0]} radius={0.34} color="#9966cc" opacity={0.52} activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Nitrogen */}
      <Atom id="nhBond" position={[0, 0.32, 0]} radius={0.52} color="#2255aa" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Hydrogen atoms and N–H bonds */}
      {hPositions.map((pos, i) => (
        <group key={i}>
          <Bond id="nhBond" from={[0, 0.32, 0]} to={pos} radius={0.052} color="#6688cc" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
          <Atom id="nhBond" position={pos} radius={0.3} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
        </group>
      ))}
      {/* Dipole arrow (pointing toward lone pair) */}
      <Bond id="dipole" from={[0, -0.6, 0]} to={[0, 0.72, 0]} radius={0.038} color="#2266bb" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Atom id="dipole" position={[0, 0.86, 0]} radius={0.09} color="#2266bb" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
    </group>
  );
}

// C₆H₆ — hexagonal ring, sp² C atoms, π cloud rings above/below
function BenzeneModel({ activeComponent, viewMode, crossSection }: CommonModelProps) {
  const r = 1.42; // ring radius
  const angles = [0, 60, 120, 180, 240, 300].map((deg) => (deg * Math.PI) / 180);
  const cPositions: [number, number, number][] = angles.map((a) => [r * Math.cos(a), 0, r * Math.sin(a)]);
  const hPositions: [number, number, number][] = angles.map((a) => [2.5 * Math.cos(a), 0, 2.5 * Math.sin(a)]);

  return (
    <group rotation={[0.35, -0.18, 0.06]} scale={[1.0, 1.0, 1.0]}>
      {/* π electron cloud — flat tori above and below ring */}
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[1.38, 0.14, 12, 60]} />
        <AtomMaterial id="piCloud" activeComponent={activeComponent} viewMode={viewMode} color="#9933cc" opacity={crossSection ? 0.18 : 0.32} roughness={0.28} metalness={0.18} />
      </mesh>
      <mesh position={[0, -0.32, 0]}>
        <torusGeometry args={[1.38, 0.14, 12, 60]} />
        <AtomMaterial id="piCloud" activeComponent={activeComponent} viewMode={viewMode} color="#9933cc" opacity={crossSection ? 0.18 : 0.32} roughness={0.28} metalness={0.18} />
      </mesh>
      {/* C–C ring bonds */}
      {cPositions.map((pos, i) => {
        const next = cPositions[(i + 1) % 6];
        return (
          <Bond key={`cc-${i}`} id="ring" from={pos} to={next} radius={0.055} color="#c09030" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
        );
      })}
      {/* Carbon atoms */}
      {cPositions.map((pos, i) => (
        <Atom key={`c-${i}`} id="ring" position={pos} radius={0.36} color="#555555" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      ))}
      {/* C–H bonds and H atoms */}
      {cPositions.map((pos, i) => (
        <group key={`ch-${i}`}>
          <Bond id="chBond" from={pos} to={hPositions[i]} radius={0.042} color="#999999" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
          <Atom id="chBond" position={hPositions[i]} radius={0.28} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
        </group>
      ))}
    </group>
  );
}

// CH₃CH₂OH — C–C–O chain, highlighted OH group
function EthanolModel({ activeComponent, viewMode, crossSection }: CommonModelProps) {
  return (
    <group rotation={[0.12, -0.38, 0.08]} scale={[1.05, 1.05, 1.05]}>
      {/* Oxygen */}
      <Atom id="hydroxyl" position={[-1.72, 0.28, 0.18]} radius={0.45} color="#cc3322" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* O–H hydrogen */}
      <Atom id="hydroxyl" position={[-2.28, 0.88, 0.56]} radius={0.26} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="hydroxyl" from={[-1.72, 0.28, 0.18]} to={[-2.28, 0.88, 0.56]} radius={0.046} color="#cc8866" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* C1 (methylene, bonded to O) */}
      <Atom id="alkyl" position={[-0.2, 0.04, 0]} radius={0.42} color="#555555" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="hydroxyl" from={[-0.2, 0.04, 0]} to={[-1.72, 0.28, 0.18]} radius={0.056} color="#aa6644" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* C1 hydrogens */}
      <Atom id="alkyl" position={[-0.08, -0.48, -1.05]} radius={0.26} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="alkyl" from={[-0.2, 0.04, 0]} to={[-0.08, -0.48, -1.05]} radius={0.042} color="#999999" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Atom id="alkyl" position={[-0.08, 1.15, -0.55]} radius={0.26} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="alkyl" from={[-0.2, 0.04, 0]} to={[-0.08, 1.15, -0.55]} radius={0.042} color="#999999" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* C2 (methyl) */}
      <Atom id="alkyl" position={[1.32, -0.08, 0.04]} radius={0.42} color="#555555" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="alkyl" from={[-0.2, 0.04, 0]} to={[1.32, -0.08, 0.04]} radius={0.056} color="#888888" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* C2 methyl hydrogens */}
      <Atom id="alkyl" position={[1.55, -1.1, 0.62]} radius={0.26} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="alkyl" from={[1.32, -0.08, 0.04]} to={[1.55, -1.1, 0.62]} radius={0.042} color="#999999" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Atom id="alkyl" position={[1.88, 0.82, 0.62]} radius={0.26} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="alkyl" from={[1.32, -0.08, 0.04]} to={[1.88, 0.82, 0.62]} radius={0.042} color="#999999" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Atom id="alkyl" position={[1.62, -0.22, -1.04]} radius={0.26} color="#e0e0e0" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="alkyl" from={[1.32, -0.08, 0.04]} to={[1.62, -0.22, -1.04]} radius={0.042} color="#999999" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Hydrogen-bond dashed indicator */}
      <Bond id="hBond" from={[-1.72, 0.28, 0.18]} to={[-2.95, -0.42, -0.38]} radius={0.022} color="#5599dd" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
    </group>
  );
}

// O=C=O — linear, two C=O double bonds shown as paired tubes
function CO2Model({ activeComponent, viewMode, crossSection }: CommonModelProps) {
  return (
    <group rotation={[0.1, -0.22, 0.06]} scale={[1.08, 1.08, 1.08]}>
      {/* Linear geometry indicator */}
      <Bond id="linear" from={[-2.6, 0, 0]} to={[2.6, 0, 0]} radius={0.022} color="#44aaaa" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Left oxygen */}
      <Atom id="doubleBond" position={[-1.98, 0, 0]} radius={0.5} color="#cc3322" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Right oxygen */}
      <Atom id="doubleBond" position={[1.98, 0, 0]} radius={0.5} color="#cc3322" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Central carbon */}
      <Atom id="carbon" position={[0, 0, 0]} radius={0.42} color="#444444" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Left C=O — two parallel bond tubes (σ + π) */}
      <Bond id="doubleBond" from={[0, 0.11, 0]} to={[-1.98, 0.11, 0]} radius={0.052} color="#dd5533" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="doubleBond" from={[0, -0.11, 0]} to={[-1.98, -0.11, 0]} radius={0.052} color="#dd5533" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      {/* Right C=O — two parallel bond tubes */}
      <Bond id="doubleBond" from={[0, 0.11, 0]} to={[1.98, 0.11, 0]} radius={0.052} color="#dd5533" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
      <Bond id="doubleBond" from={[0, -0.11, 0]} to={[1.98, -0.11, 0]} radius={0.052} color="#dd5533" activeComponent={activeComponent} viewMode={viewMode} crossSection={crossSection} />
    </group>
  );
}

// ── Model router ─────────────────────────────────────────────────────────────

function MoleculeModel({
  molecule,
  activeComponent,
  viewMode,
  crossSection,
  autoRotate,
}: Omit<MoleculeSceneProps, "resetKey">) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current && autoRotate) {
      group.current.rotation.y += delta * 0.1;
    }
  });

  const common = { activeComponent, viewMode, crossSection };

  return (
    <group ref={group} position={[0, 0, 0]}>
      {molecule.modelAsset ? (
        <AssetMoleculeModel molecule={molecule} asset={molecule.modelAsset} {...common} />
      ) : (
        <>
          {molecule.modelKind === "water" && <WaterModel {...common} />}
          {molecule.modelKind === "methane" && <MethaneModel {...common} />}
          {molecule.modelKind === "glucose" && <GlucoseModel {...common} />}
          {molecule.modelKind === "ammonia" && <AmmoniaModel {...common} />}
          {molecule.modelKind === "benzene" && <BenzeneModel {...common} />}
          {molecule.modelKind === "ethanol" && <EthanolModel {...common} />}
          {molecule.modelKind === "co2" && <CO2Model {...common} />}
        </>
      )}
    </group>
  );
}

function ModelLoadingOverlay({ molecule }: { molecule: MoleculeItem }) {
  const { progress } = useProgress();
  const displayProgress = Math.max(8, Math.min(100, Math.round(progress)));

  return (
    <Html center className="model-loader">
      <div>
        <span>Loading 3D model</span>
        <strong>{molecule.name}</strong>
        <i>
          <b style={{ width: `${displayProgress}%` }} />
        </i>
        <em>{displayProgress}%</em>
      </div>
    </Html>
  );
}

export function MoleculeScene({
  molecule,
  activeComponent,
  viewMode,
  crossSection,
  autoRotate,
  resetKey,
}: MoleculeSceneProps) {
  const nativeMaterial = molecule.modelAsset?.materialMode === "native";

  return (
    <Canvas
      key={resetKey}
      className={`cell-canvas${nativeMaterial ? " is-native-asset" : ""}`}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      camera={{ position: [0, 0.2, 5.8], fov: 38 }}
    >
      {!nativeMaterial && <color attach="background" args={["#fbf7ee"]} />}
      <ambientLight intensity={nativeMaterial ? 1.42 : 1.32} />
      <hemisphereLight
        args={[
          nativeMaterial ? "#fffaf0" : "#fff8ea",
          nativeMaterial ? "#efe3d2" : "#e3ded2",
          nativeMaterial ? 1.26 : 1.22,
        ]}
      />
      <directionalLight position={[4.2, 5.2, 5.8]} intensity={nativeMaterial ? 2.72 : 2.6} castShadow />
      {nativeMaterial && <directionalLight position={[-4.4, 2.2, 3.6]} intensity={0.82} color="#fff1df" />}
      <spotLight
        position={[-3.6, 3.2, 4.6]}
        angle={0.42}
        penumbra={0.74}
        intensity={nativeMaterial ? 0.78 : 1.38}
        color={nativeMaterial ? "#fff8ec" : molecule.accentSoft}
      />
      <pointLight
        position={[2.8, -1.2, 3.2]}
        intensity={nativeMaterial ? 0.46 : 0.58}
        color={nativeMaterial ? "#ffffff" : molecule.accent}
      />
      <Suspense fallback={<ModelLoadingOverlay molecule={molecule} />}>
        <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.18}>
          <MoleculeModel
            molecule={molecule}
            activeComponent={activeComponent}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
          />
        </Float>
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={nativeMaterial ? 0.18 : 0.24}
          scale={nativeMaterial ? 7.8 : 7.0}
          blur={nativeMaterial ? 3.2 : 2.4}
          far={4.2}
        />
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        minDistance={3.2}
        maxDistance={8.4}
      />
    </Canvas>
  );
}
