import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Environment, Float, Html, OrbitControls, RoundedBox, useGLTF, useProgress } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { Suspense, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  CatmullRomCurve3,
  Group,
  Mesh,
  TubeGeometry,
  Vector3,
  type MeshStandardMaterialParameters,
} from "three";
import type { CellItem, CellModelAsset, ViewMode } from "../data/cells";
import {
  applyAssetVertexColors,
  createAssetMaterial,
  createNativeAssetMaterial,
  createSolidAssetMaterial,
} from "../lib/cellMaterials";

type CellSceneProps = {
  cell: CellItem;
  activeOrganelle: string;
  viewMode: ViewMode;
  crossSection: boolean;
  autoRotate: boolean;
  resetKey: number;
};

type MaterialProps = {
  id: string;
  activeOrganelle: string;
  viewMode: ViewMode;
  color: string;
  opacity?: number;
  roughness?: number;
  metalness?: number;
};

function CellMaterial({
  id,
  activeOrganelle,
  viewMode,
  color,
  opacity = 1,
  roughness = 0.66,
  metalness = 0.03,
}: MaterialProps) {
  const active = id === activeOrganelle;
  const dimmed = viewMode === "focus" && !active;
  const material: MeshStandardMaterialParameters = {
    color,
    roughness,
    metalness,
    transparent: opacity < 1 || dimmed,
    opacity: dimmed ? Math.min(opacity, 0.18) : opacity,
    emissive: active ? color : "#000000",
    emissiveIntensity: active ? 0.34 : 0,
  };

  return <meshStandardMaterial {...material} />;
}

type TubeProps = {
  id: string;
  color: string;
  points: Array<[number, number, number]>;
  radius?: number;
  activeOrganelle: string;
  viewMode: ViewMode;
};

function CurveTube({
  id,
  color,
  points,
  radius = 0.035,
  activeOrganelle,
  viewMode,
}: TubeProps) {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(
      points.map((point) => new Vector3(point[0], point[1], point[2])),
    );
    return new TubeGeometry(curve, 80, radius, 12, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <CellMaterial
        id={id}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        color={color}
        roughness={0.58}
      />
    </mesh>
  );
}

type CommonModelProps = {
  activeOrganelle: string;
  viewMode: ViewMode;
  crossSection: boolean;
};


function AssetCellModel({
  cell,
  asset,
  viewMode,
  crossSection,
}: CommonModelProps & {
  cell: CellItem;
  asset: CellModelAsset;
}) {
  const { scene } = useGLTF(asset.url, true, true);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    let meshIndex = 0;

    clone.traverse((node) => {
      const mesh = node as Mesh;
      if (!mesh.isMesh) {
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (asset.materialMode === "native") {
        mesh.material = createNativeAssetMaterial({
          original: mesh.material,
          cell,
          asset,
          crossSection,
        });
      } else if (asset.materialMode === "solid") {
        mesh.geometry.computeVertexNormals();
        mesh.material = createSolidAssetMaterial({
          original: mesh.material,
          cell,
          viewMode,
          crossSection,
        });
      } else {
        mesh.geometry.computeVertexNormals();
        applyAssetVertexColors(mesh, cell);
        mesh.material = createAssetMaterial({
          original: mesh.material,
          cell,
          meshIndex,
          viewMode,
          crossSection,
        });
      }
      meshIndex += 1;
    });

    return clone;
  }, [cell, scene, viewMode, crossSection]);

  return (
    <group
      position={asset.position ?? [0, 0, 0]}
      rotation={asset.rotation ?? [0, 0, 0]}
      scale={[asset.scale, asset.scale, asset.scale]}
    >
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function Dots({
  id,
  color,
  activeOrganelle,
  viewMode,
  count,
  spread,
}: CommonModelProps & {
  id: string;
  color: string;
  count: number;
  spread: [number, number, number];
}) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const a = index * 1.71;
        const b = index * 2.37;
        return [
          Math.sin(a) * spread[0],
          Math.cos(b) * spread[1],
          Math.sin(a + b) * spread[2],
        ] as [number, number, number];
      }),
    [count, spread],
  );

  return (
    <>
      {dots.map((position, index) => (
        <mesh key={`${id}-${index}`} position={position} castShadow>
          <sphereGeometry args={[0.055 + (index % 3) * 0.018, 18, 18]} />
          <CellMaterial
            id={id}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            color={color}
            opacity={0.92}
          />
        </mesh>
      ))}
    </>
  );
}

function Nucleus({
  id = "nucleus",
  position,
  scale,
  activeOrganelle,
  viewMode,
  color = "#7047a8",
}: CommonModelProps & {
  id?: string;
  position: [number, number, number];
  scale: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 48, 48]} />
        <CellMaterial
          id={id}
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color={color}
          opacity={0.92}
          roughness={0.44}
        />
      </mesh>
      <mesh position={[0.2, 0.16, 0.38]} castShadow>
        <sphereGeometry args={[0.23, 28, 28]} />
        <CellMaterial
          id={id}
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#b56ad8"
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function Mitochondrion({
  id = "mitochondrion",
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  activeOrganelle,
  viewMode,
}: CommonModelProps & {
  id?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.16, 0.46, 10, 24]} />
        <CellMaterial
          id={id}
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#cf7042"
        />
      </mesh>
      {[0, 1, 2].map((item) => (
        <mesh key={item} position={[0, -0.18 + item * 0.18, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.012, 8, 18]} />
          <CellMaterial
            id={id}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            color="#f0b074"
          />
        </mesh>
      ))}
    </group>
  );
}

function PlantModel({ activeOrganelle, viewMode, crossSection }: CommonModelProps) {
  return (
    <group rotation={[0.1, -0.28, 0]}>
      <RoundedBox args={[4.7, 2.7, 0.42]} radius={0.18} smoothness={8} position={[0, 0, 0]}>
        <CellMaterial
          id="cellWall"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#84ad4a"
          opacity={crossSection ? 0.34 : 0.5}
        />
      </RoundedBox>
      <RoundedBox args={[4.18, 2.24, 0.24]} radius={0.12} smoothness={8} position={[0.02, 0.02, 0.08]}>
        <CellMaterial
          id="cellWall"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#4f9f83"
          opacity={0.24}
        />
      </RoundedBox>
      <mesh position={[-0.45, -0.12, 0.32]} scale={[1.05, 0.78, 0.28]} castShadow>
        <sphereGeometry args={[0.78, 46, 46]} />
        <CellMaterial
          id="vacuole"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#62bdd2"
          opacity={0.74}
        />
      </mesh>
      <Nucleus
        position={[0.92, 0.42, 0.45]}
        scale={[0.52, 0.52, 0.38]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
      {[
        [-1.65, 0.48, 0.28],
        [1.68, -0.38, 0.3],
        [-1.52, -0.62, 0.22],
      ].map((position, index) => (
        <group key={index} position={position as [number, number, number]} rotation={[0, 0, index * 0.7]}>
          <mesh scale={[0.35, 0.18, 0.12]} castShadow>
            <sphereGeometry args={[1, 30, 20]} />
            <CellMaterial
              id="chloroplast"
              activeOrganelle={activeOrganelle}
              viewMode={viewMode}
              color="#67ad46"
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.82, 1]}>
            <torusGeometry args={[0.22, 0.012, 8, 42]} />
            <CellMaterial
              id="chloroplast"
              activeOrganelle={activeOrganelle}
              viewMode={viewMode}
              color="#9ed36a"
            />
          </mesh>
        </group>
      ))}
      <Mitochondrion
        position={[0.28, -0.72, 0.42]}
        rotation={[0.3, 0.2, 1.35]}
        scale={[0.95, 0.95, 0.95]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
      <CurveTube
        id="nucleus"
        color="#ce785c"
        points={[
          [0.42, 0.12, 0.42],
          [0.62, -0.06, 0.5],
          [1.05, -0.08, 0.46],
          [1.44, 0.06, 0.38],
        ]}
        radius={0.05}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
      />
      <Dots
        id="vacuole"
        color="#c76ac5"
        count={18}
        spread={[1.72, 0.92, 0.42]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
    </group>
  );
}

function WhiteBloodModel({ activeOrganelle, viewMode, crossSection }: CommonModelProps) {
  return (
    <group scale={[1.2, 1.2, 1.2]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.35, 64, 64]} />
        <CellMaterial
          id="membrane"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#d6d7e6"
          opacity={crossSection ? 0.28 : 0.45}
        />
      </mesh>
      {[
        [-0.42, 0.22, 0.34],
        [0.28, 0.06, 0.36],
        [0.02, -0.42, 0.28],
      ].map((position, index) => (
        <Nucleus
          key={index}
          id="nucleus"
          position={position as [number, number, number]}
          scale={[0.42, 0.36, 0.28]}
          color="#6c35a0"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          crossSection={crossSection}
        />
      ))}
      <Dots
        id="granules"
        color="#c06696"
        count={30}
        spread={[1.05, 1.02, 0.72]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
      <Dots
        id="lysosome"
        color="#8b54b7"
        count={12}
        spread={[0.92, 0.88, 0.62]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
    </group>
  );
}

function NeuronModel({ activeOrganelle, viewMode, crossSection }: CommonModelProps) {
  return (
    <group rotation={[0.02, -0.2, 0]} scale={[1.05, 1.05, 1.05]}>
      <Nucleus
        id="soma"
        position={[-0.55, 0, 0.08]}
        scale={[0.64, 0.58, 0.44]}
        color="#774eb2"
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
      <mesh position={[-0.55, 0, 0]} scale={[0.94, 0.82, 0.62]} castShadow receiveShadow>
        <sphereGeometry args={[1, 52, 52]} />
        <CellMaterial
          id="soma"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#8db5d8"
          opacity={crossSection ? 0.36 : 0.55}
        />
      </mesh>
      <CurveTube
        id="axon"
        color="#6b7dc6"
        points={[
          [0.04, 0.02, 0.04],
          [0.72, -0.02, 0.02],
          [1.56, 0.04, 0.02],
          [2.35, -0.04, 0],
        ]}
        radius={0.08}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
      />
      {[0.55, 1.06, 1.58, 2.08].map((x, index) => (
        <mesh key={index} position={[x, 0, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.16, 0.24, 8, 24]} />
          <CellMaterial
            id="axon"
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            color="#bfd1df"
            opacity={0.94}
          />
        </mesh>
      ))}
      {[
        [
          [-1.08, 0.28, 0],
          [-1.55, 0.82, 0.08],
          [-2.1, 1.03, 0],
        ],
        [
          [-1.16, -0.18, 0],
          [-1.7, -0.54, 0.05],
          [-2.2, -0.9, 0],
        ],
        [
          [-0.78, 0.58, 0.04],
          [-0.82, 1.16, 0.02],
          [-1.12, 1.58, 0],
        ],
        [
          [-0.9, -0.55, 0.04],
          [-0.92, -1.04, 0],
          [-1.2, -1.44, 0.02],
        ],
      ].map((points, index) => (
        <CurveTube
          key={index}
          id="dendrites"
          color="#7d9bcf"
          points={points as Array<[number, number, number]>}
          radius={0.052}
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
        />
      ))}
      <Dots
        id="dendrites"
        color="#b46ac7"
        count={12}
        spread={[2.2, 1.4, 0.2]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
    </group>
  );
}

function EpithelialModel({ activeOrganelle, viewMode, crossSection }: CommonModelProps) {
  const microvilliRows = 6;
  const microvilliCols = 6;
  const microvilli: Array<{ position: [number, number, number]; height: number }> = [];
  for (let row = 0; row < microvilliRows; row += 1) {
    for (let col = 0; col < microvilliCols; col += 1) {
      const x = -0.55 + col * 0.22 + (row % 2 === 0 ? 0 : 0.11);
      const z = -0.55 + row * 0.22;
      const dist = Math.hypot(x, z);
      if (dist > 0.7) continue;
      const height = 0.38 + Math.sin(row * 1.3 + col * 0.7) * 0.06;
      microvilli.push({ position: [x, 1.34 + height / 2, z], height });
    }
  }

  return (
    <group rotation={[0.08, -0.22, 0]} scale={[1.08, 1.08, 1.08]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.88, 2.6, 32, 1, false]} />
        <CellMaterial
          id="membrane"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#d79baa"
          opacity={crossSection ? 0.3 : 0.52}
        />
      </mesh>
      {[-1.62, 1.62].map((x, index) => (
        <mesh key={`neighbor-${index}`} position={[x, -0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.74, 0.84, 2.2, 28, 1, false]} />
          <CellMaterial
            id="membrane"
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            color="#c98ba0"
            opacity={crossSection ? 0.22 : 0.34}
          />
        </mesh>
      ))}
      {microvilli.map((villus, index) => (
        <mesh key={`villus-${index}`} position={villus.position} castShadow>
          <capsuleGeometry args={[0.038, villus.height, 6, 12]} />
          <CellMaterial
            id="microvilli"
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            color="#c86f80"
          />
        </mesh>
      ))}
      <mesh position={[0, 1.34, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.78, 0.06, 32]} />
        <CellMaterial
          id="microvilli"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#b85a6d"
          opacity={0.85}
        />
      </mesh>
      <Nucleus
        position={[0, -0.55, 0]}
        scale={[0.46, 0.36, 0.46]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
      {[-0.82, 0.82].map((x, index) => (
        <mesh key={`junction-${index}`} position={[x, 0.95, 0]} castShadow>
          <torusGeometry args={[0.22, 0.05, 10, 20, Math.PI]} />
          <CellMaterial
            id="junctions"
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            color="#9f6cbd"
          />
        </mesh>
      ))}
      <CurveTube
        id="junctions"
        color="#9f6cbd"
        points={[
          [-0.82, 1.0, -0.4],
          [-0.4, 1.05, 0],
          [-0.82, 1.0, 0.4],
        ]}
        radius={0.04}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
      />
      <CurveTube
        id="junctions"
        color="#9f6cbd"
        points={[
          [0.82, 1.0, -0.4],
          [0.4, 1.05, 0],
          [0.82, 1.0, 0.4],
        ]}
        radius={0.04}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
      />
      <mesh position={[0, -1.36, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.08, 36]} />
        <CellMaterial
          id="membrane"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#a56d7f"
          opacity={0.6}
        />
      </mesh>
      <Dots
        id="nucleus"
        color="#d082a2"
        count={14}
        spread={[0.5, 0.5, 0.36]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
    </group>
  );
}

function BacteriaModel({ activeOrganelle, viewMode, crossSection }: CommonModelProps) {
  return (
    <group rotation={[0.02, 0.1, -0.02]} scale={[1.12, 1.12, 1.12]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <capsuleGeometry args={[0.78, 2.9, 14, 48]} />
        <CellMaterial
          id="cellWall"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#65b8ae"
          opacity={crossSection ? 0.36 : 0.62}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} scale={[0.88, 0.88, 0.82]}>
        <capsuleGeometry args={[0.62, 2.6, 12, 40]} />
        <CellMaterial
          id="cellWall"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#235a74"
          opacity={0.44}
        />
      </mesh>
      <CurveTube
        id="nucleoid"
        color="#7a43ad"
        points={[
          [-0.9, 0.12, 0.3],
          [-0.42, -0.14, 0.38],
          [0.1, 0.18, 0.34],
          [0.62, -0.12, 0.36],
          [1.02, 0.06, 0.32],
        ]}
        radius={0.12}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
      />
      <CurveTube
        id="flagellum"
        color="#b87438"
        points={[
          [1.82, -0.22, 0.08],
          [2.35, -0.72, 0],
          [2.95, -0.5, 0.02],
          [3.55, -0.95, 0],
        ]}
        radius={0.055}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
      />
      <Dots
        id="nucleoid"
        color="#e59b3a"
        count={34}
        spread={[1.42, 0.48, 0.36]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
    </group>
  );
}

function AnimalModel({ activeOrganelle, viewMode, crossSection }: CommonModelProps) {
  return (
    <group rotation={[0.06, -0.34, 0]} scale={[1.08, 1.08, 1.08]}>
      <mesh scale={[1.7, 1.25, 0.72]} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <CellMaterial
          id="membrane"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#9db6dc"
          opacity={crossSection ? 0.28 : 0.48}
        />
      </mesh>
      <Nucleus
        position={[0.22, 0.18, 0.36]}
        scale={[0.55, 0.55, 0.42]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
      <Mitochondrion
        position={[-0.82, 0.44, 0.32]}
        rotation={[0.4, 0.1, 1.12]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
      <Mitochondrion
        position={[0.82, -0.42, 0.25]}
        rotation={[0.1, 0.35, -0.75]}
        scale={[0.9, 0.9, 0.9]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} position={[-0.24 + index * 0.18, -0.56 + index * 0.08, 0.46]} rotation={[0.2, 0, 0.7]}>
          <torusGeometry args={[0.38 + index * 0.035, 0.025, 10, 52]} />
          <CellMaterial
            id="golgi"
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            color="#d49057"
          />
        </mesh>
      ))}
      <Dots
        id="nucleus"
        color="#b35fc8"
        count={28}
        spread={[1.25, 0.85, 0.46]}
        activeOrganelle={activeOrganelle}
        viewMode={viewMode}
        crossSection={crossSection}
      />
    </group>
  );
}

function MuscleModel({ activeOrganelle, viewMode, crossSection }: CommonModelProps) {
  const fiberLength = 4.4;
  const sarcomere = 0.36;
  const sarcomereCount = Math.floor(fiberLength / sarcomere);
  const myofibrilLayout: Array<{ y: number; z: number }> = [
    { y: 0.36, z: 0.0 },
    { y: 0.18, z: 0.34 },
    { y: 0.18, z: -0.34 },
    { y: -0.18, z: 0.34 },
    { y: -0.18, z: -0.34 },
    { y: -0.36, z: 0.0 },
    { y: 0.0, z: 0.0 },
  ];

  return (
    <group rotation={[0.12, -0.18, -0.03]} scale={[1.0, 1.0, 1.0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <capsuleGeometry args={[0.7, fiberLength, 14, 48]} />
        <CellMaterial
          id="sarcolemma"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          color="#d7b284"
          opacity={crossSection ? 0.22 : 0.36}
        />
      </mesh>
      {myofibrilLayout.map((fibril, fibrilIndex) => (
        <group key={`myofibril-${fibrilIndex}`} position={[0, fibril.y, fibril.z]}>
          {Array.from({ length: sarcomereCount }, (_, sIndex) => {
            const x = -fiberLength / 2 + sIndex * sarcomere + sarcomere / 2;
            return (
              <group key={`s-${sIndex}`} position={[x, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.13, 0.13, sarcomere * 0.55, 18]} />
                  <CellMaterial
                    id="myofibril"
                    activeOrganelle={activeOrganelle}
                    viewMode={viewMode}
                    color="#a02f43"
                  />
                </mesh>
                <mesh position={[sarcomere * 0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.115, 0.115, sarcomere * 0.32, 18]} />
                  <CellMaterial
                    id="myofibril"
                    activeOrganelle={activeOrganelle}
                    viewMode={viewMode}
                    color="#e09aa5"
                  />
                </mesh>
                <mesh position={[sarcomere * 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.145, 0.145, 0.04, 18]} />
                  <CellMaterial
                    id="myofibril"
                    activeOrganelle={activeOrganelle}
                    viewMode={viewMode}
                    color="#3d1418"
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
      {[-1.45, -0.1, 1.25].map((x, index) => (
        <Nucleus
          key={`nucleus-${index}`}
          id="nucleus"
          position={[x, 0.62, 0.18]}
          scale={[0.36, 0.16, 0.22]}
          color="#7a4aa2"
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
          crossSection={crossSection}
        />
      ))}
      {[
        [-1.8, -0.5, 0.2],
        [-0.6, -0.55, -0.22],
        [0.6, -0.5, 0.22],
        [1.8, -0.55, -0.2],
      ].map((position, index) => (
        <mesh
          key={`mito-${index}`}
          position={position as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <capsuleGeometry args={[0.09, 0.32, 8, 14]} />
          <CellMaterial
            id="mitochondria"
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            color="#cf7042"
          />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((index) => (
        <CurveTube
          key={`sr-${index}`}
          id="sarcolemma"
          color="#ead2a7"
          points={[
            [-2.0 + index * 1.0, -0.78, 0.28],
            [-1.9 + index * 1.0, -0.2, 0.36],
            [-2.0 + index * 1.0, 0.62, 0.3],
          ]}
          radius={0.03}
          activeOrganelle={activeOrganelle}
          viewMode={viewMode}
        />
      ))}
    </group>
  );
}

function CellModel({
  cell,
  activeOrganelle,
  viewMode,
  crossSection,
  autoRotate,
}: Omit<CellSceneProps, "resetKey">) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current && autoRotate) {
      group.current.rotation.y += delta * 0.1;
    }
  });

  const common = { activeOrganelle, viewMode, crossSection };

  return (
    <group ref={group} position={[0, 0, 0]}>
      {cell.modelAsset ? (
        <AssetCellModel cell={cell} asset={cell.modelAsset} {...common} />
      ) : (
        <>
          {cell.modelKind === "plant" && <PlantModel {...common} />}
          {cell.modelKind === "whiteBlood" && <WhiteBloodModel {...common} />}
          {cell.modelKind === "neuron" && <NeuronModel {...common} />}
          {cell.modelKind === "epithelial" && <EpithelialModel {...common} />}
          {cell.modelKind === "bacteria" && <BacteriaModel {...common} />}
          {cell.modelKind === "animal" && <AnimalModel {...common} />}
          {cell.modelKind === "muscle" && <MuscleModel {...common} />}
        </>
      )}
    </group>
  );
}

function ModelLoadingOverlay({ cell }: { cell: CellItem }) {
  const { t } = useTranslation("common");
  const { progress, loaded, total } = useProgress();
  const displayProgress = Math.max(2, Math.min(100, Math.round(progress)));
  const mbLoaded = loaded ? (loaded / (1024 * 1024)).toFixed(1) : null;
  const mbTotal = total ? (total / (1024 * 1024)).toFixed(1) : null;
  const sourceLabel = cell.modelAsset?.sourceLabel;

  return (
    <Html center className="model-loader">
      <div>
        <span className="model-loader-spinner" aria-hidden="true" />
        <span>{t("scene.loading")}</span>
        <strong>{cell.name}</strong>
        {sourceLabel && <small className="model-loader-source">{sourceLabel}</small>}
        <i>
          <b style={{ width: `${displayProgress}%` }} />
        </i>
        <em>
          {displayProgress}%
          {mbLoaded && mbTotal && total > 0 && (
            <span className="model-loader-bytes">
              {" · "}
              {mbLoaded} / {mbTotal} MB
            </span>
          )}
        </em>
      </div>
    </Html>
  );
}

export function CellScene({
  cell,
  activeOrganelle,
  viewMode,
  crossSection,
  autoRotate,
  resetKey,
}: CellSceneProps) {
  const nativeMaterial = cell.modelAsset?.materialMode === "native";

  return (
    <Canvas
      key={resetKey}
      className={`cell-canvas${nativeMaterial ? " is-native-asset" : ""}`}
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: nativeMaterial ? 1.05 : 1.18,
      }}
      camera={{ position: [0, 0.2, 5.8], fov: 38 }}
    >
      {!nativeMaterial && <color attach="background" args={["#fbf7ee"]} />}
      <Suspense fallback={null}>
        <Environment preset="studio" background={false} environmentIntensity={nativeMaterial ? 0.75 : 0.5} />
      </Suspense>
      <ambientLight intensity={nativeMaterial ? 0.65 : 0.85} />
      <hemisphereLight
        args={[
          nativeMaterial ? "#fffaf0" : "#fff8ea",
          nativeMaterial ? "#efe3d2" : "#e3ded2",
          nativeMaterial ? 0.55 : 0.65,
        ]}
      />
      <directionalLight
        position={[4.2, 5.2, 5.8]}
        intensity={nativeMaterial ? 1.85 : 1.95}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {nativeMaterial && (
        <directionalLight
          position={[-4.4, 2.2, 3.6]}
          intensity={0.55}
          color="#fff1df"
        />
      )}
      <spotLight
        position={[-3.6, 3.2, 4.6]}
        angle={0.42}
        penumbra={0.74}
        intensity={nativeMaterial ? 0.4 : 0.85}
        color={nativeMaterial ? "#fff8ec" : cell.accentSoft}
      />
      <pointLight
        position={[2.8, -1.2, 3.2]}
        intensity={nativeMaterial ? 0.28 : 0.4}
        color={nativeMaterial ? "#ffffff" : cell.accent}
      />
      <Suspense fallback={<ModelLoadingOverlay cell={cell} />}>
        <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.18}>
          <CellModel
            cell={cell}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
          />
        </Float>
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={nativeMaterial ? 0.28 : 0.34}
          scale={nativeMaterial ? 7.8 : 7.2}
          blur={nativeMaterial ? 2.6 : 2.0}
          far={4.2}
          resolution={512}
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
