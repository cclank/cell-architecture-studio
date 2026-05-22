import {
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  type Material,
} from "three";
import type { CellItem, CellModelAsset, ViewMode } from "../data/cells";

// Procedurally tint a flat mesh's vertices from the cell palette so studio-mode
// models read as layered tissue rather than a uniform blob.
export function applyAssetVertexColors(mesh: Mesh, cell: CellItem) {
  const geometry = mesh.geometry;
  const position = geometry.getAttribute("position");
  if (!position) {
    return;
  }

  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) {
    return;
  }

  const sizeX = Math.max(box.max.x - box.min.x, 0.001);
  const sizeY = Math.max(box.max.y - box.min.y, 0.001);
  const sizeZ = Math.max(box.max.z - box.min.z, 0.001);
  const palette = [
    new Color(cell.color),
    new Color(cell.accent),
    ...cell.organelles.map((organelle) => new Color(organelle.color)),
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
    const color = new Color(cell.color).lerp(palette[paletteIndex], 0.48);
    color.lerp(highlight, Math.max(0, nz - 0.24) * 0.22);
    color.lerp(shadow, Math.max(0, 0.32 - nz) * 0.12);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
}

export function createAssetMaterial({
  original,
  cell,
  viewMode,
  crossSection,
}: {
  original: Mesh["material"];
  cell: CellItem;
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
    emissive: new Color(cell.accent).lerp(new Color("#ffffff"), 0.58),
    emissiveIntensity: viewMode === "focus" ? 0.045 : 0.016,
  });

  material.envMapIntensity = 0.75 * (cell.modelAsset?.exposure ?? 1);
  material.needsUpdate = true;
  return material;
}

export function createSolidAssetMaterial({
  original,
  cell,
  viewMode,
  crossSection,
}: {
  original: Mesh["material"];
  cell: CellItem;
  viewMode: ViewMode;
  crossSection: boolean;
}) {
  const source = Array.isArray(original) ? original[0] : original;
  const sourceMaterial = source as Partial<MeshStandardMaterial>;
  const baseColor = new Color(cell.color);
  const accentColor = new Color(cell.accent);
  // Punch the saturation and brightness so anatomical models read clearly.
  const hsl = { h: 0, s: 0, l: 0 };
  baseColor.getHSL(hsl);
  baseColor.setHSL(hsl.h, Math.min(1, hsl.s * 1.45 + 0.05), Math.max(0.42, Math.min(0.64, hsl.l)));
  const material = new MeshStandardMaterial({
    color: baseColor,
    side: DoubleSide,
    vertexColors: false,
    transparent: crossSection || viewMode === "focus",
    opacity: crossSection ? 0.86 : viewMode === "focus" ? 0.95 : 1,
    roughness: Math.min(0.5, sourceMaterial.roughness ?? 0.38),
    metalness: Math.min(0.04, sourceMaterial.metalness ?? 0.02),
    emissive: baseColor.clone().multiplyScalar(0.55),
    emissiveIntensity: viewMode === "focus" ? 0.18 : 0.12,
  });
  material.envMapIntensity = 0.95 * (cell.modelAsset?.exposure ?? 1);
  // Subtle vertical gradient: lighter accent tone on top, deeper base on bottom.
  // Implemented via onBeforeCompile so we avoid altering geometry attributes.
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTop = { value: accentColor };
    shader.uniforms.uBottom = { value: baseColor.clone().multiplyScalar(0.78) };
    shader.uniforms.uGradStrength = { value: 0.35 };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWorldPos;")
      .replace(
        "#include <fog_vertex>",
        "#include <fog_vertex>\nvWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vWorldPos;\nuniform vec3 uTop;\nuniform vec3 uBottom;\nuniform float uGradStrength;",
      )
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        "float gradT = clamp(vWorldPos.y * 0.18 + 0.5, 0.0, 1.0);\nvec3 gradTint = mix(uBottom, uTop, smoothstep(0.0, 1.0, gradT));\nvec4 diffuseColor = vec4(mix(diffuse, gradTint, uGradStrength), opacity);",
      );
  };
  material.needsUpdate = true;
  return material;
}

export function createNativeAssetMaterial({
  original,
  cell,
  asset,
  crossSection,
}: {
  original: Mesh["material"];
  cell: CellItem;
  asset: CellModelAsset;
  crossSection: boolean;
}) {
  const baseColor = new Color(cell.color);
  const accentColor = new Color(cell.accent);
  // Procedural deep-shadow tone derived from the base — slightly darker + cooler
  const deepColor = baseColor.clone().multiplyScalar(0.62);

  const cloneMaterial = (source: Material) => {
    // Always clone the original so we preserve every special attribute
    // (vertexColors, alpha test, custom shader chunks, etc).
    const material = source.clone();
    material.side = DoubleSide;
    material.transparent = crossSection || material.transparent;
    material.opacity = crossSection ? Math.min(material.opacity, 0.86) : material.opacity;

    if (!(material instanceof MeshStandardMaterial)) {
      material.needsUpdate = true;
      return material;
    }

    const displayMap = material.map ?? null;
    if (displayMap) {
      displayMap.anisotropy = 8;
      displayMap.needsUpdate = true;
    }

    material.envMapIntensity = 0.7 * (asset.exposure ?? 1);
    material.roughness = Math.max(0.32, Math.min(material.roughness, 0.58));
    material.metalness = Math.min(material.metalness, 0.08);

    if (displayMap) {
      // Textured GLB (heart, lung, etc.) — keep the texture, just polish lighting.
      material.color.setRGB(1.04, 1.035, 1.02);
      material.emissive = new Color("#fff8eb");
      material.emissiveMap = displayMap;
      material.emissiveIntensity = 0.07 * (asset.exposure ?? 1);
      material.needsUpdate = true;
      return material;
    }

    // No diffuse texture: this is a flat anatomical scan (brain, kidney, bone).
    // Inject procedural color modulation so the surface reads as layered tissue.
    material.color = baseColor.clone();
    material.emissive = baseColor.clone().multiplyScalar(0.35);
    material.emissiveIntensity = 0.18;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uAccent = { value: accentColor };
      shader.uniforms.uDeep = { value: deepColor };
      shader.uniforms.uHighlightBoost = { value: 0.42 };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vWorldPos;\nvarying vec3 vWorldNormal;")
        .replace(
          "#include <worldpos_vertex>",
          "#include <worldpos_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWorldNormal = normalize(mat3(modelMatrix) * objectNormal);",
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nuniform vec3 uAccent;\nuniform vec3 uDeep;\nuniform float uHighlightBoost;\nvarying vec3 vWorldPos;\nvarying vec3 vWorldNormal;",
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
            // Vertical gradient: upper surface accent-tinted, lower surface in deep base
            float vMix = clamp((vWorldPos.y + 1.4) / 2.8, 0.0, 1.0);
            vec3 grad = mix(uDeep, uAccent, vMix);
            // Procedural noise modulation for "tissue marbling"
            float noise = sin(vWorldPos.x * 5.2 + vWorldPos.y * 3.6) * 0.5 + 0.5;
            noise = mix(0.92, 1.08, noise);
            diffuseColor.rgb = mix(diffuseColor.rgb, grad, 0.55);
            diffuseColor.rgb *= noise;
            // Rim highlight on geometry edges — fake subsurface scattering
            float rim = pow(1.0 - max(dot(normalize(vWorldNormal), vec3(0.0, 0.0, 1.0)), 0.0), 1.8);
            diffuseColor.rgb += uAccent * rim * uHighlightBoost;
            `,
        );
    };

    material.needsUpdate = true;
    return material;
  };

  return Array.isArray(original) ? original.map(cloneMaterial) : cloneMaterial(original);
}
