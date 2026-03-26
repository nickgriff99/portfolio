import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function GlassStrip() {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = state.pointer.x * 0.06;
    ref.current.rotation.x = -state.pointer.y * 0.03;
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[16, 1.1, 0.3]} radius={0.22} smoothness={4}>
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0}
          thickness={0.9}
          ior={1.15}
          chromaticAberration={0.05}
          anisotropy={0.3}
          color="#ffffff"
          attenuationColor="#6082B6"
          attenuationDistance={0.4}
        />
      </RoundedBox>
    </group>
  );
}

export default function FluidGlassScene() {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 9.6], fov: 32 }}
      gl={{ alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} />
      <GlassStrip />
    </Canvas>
  );
}
