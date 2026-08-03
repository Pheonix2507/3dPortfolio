import type * as THREE from "three";

/** Every primitive `AnimatedShape` knows how to render. */
export const SHAPE_TYPES = [
  "box",
  "sphere",
  "cone",
  "torus",
  "octahedron",
  "cylinder",
] as const;

export type ShapeType = (typeof SHAPE_TYPES)[number];

/**
 * A single particle travelling between two points in a scene. Used by both the
 * exploding cubes on the landing scene and the letter-morph scene.
 */
export interface ScenePiece {
  id: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  /** Stagger in milliseconds before this piece starts moving. */
  delay: number;
  shape: ShapeType;
}
