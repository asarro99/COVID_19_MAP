import * as THREE from "three";
import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useLoader, useFrame } from "react-three-fiber";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

RectAreaLightUniformsLib.init();

const makeUrl = file =>
  `https://raw.githubusercontent.com/flowers1225/threejs-earth/master/src/img/${file}.jpg`;

function ll2xyz(radius, lat, lon) {
  const phi = lat * (Math.PI / 180),
    theta = -(90 - lon) * (Math.PI / 180),
    x = -(radius * Math.sin(phi) * Math.cos(theta)),
    z = radius * Math.sin(phi) * Math.sin(theta),
    y = radius * Math.cos(phi);
  return [x, y, z];
}

function Earth(props) {
  const cPoints = props.cPoints;

  const GetCPoints = cPoints => {
    const cPointsJSX = (cPoints || []).map(cPoint => {
      const radius = 2;
      const phi = (90 - cPoint.place.lat) * (Math.PI / 180),
        theta = (cPoint.place.lon + 180) * (Math.PI / 180),
        x = -(radius * Math.sin(phi) * Math.cos(theta)),
        z = radius * Math.sin(phi) * Math.cos(theta),
        y = radius * Math.cos(phi);
      const color =
        cPoint.cases.slice(-1)[0].n > 500
          ? cPoint.cases.slice(-1)[0].n > 1000
            ? "red"
            : "rgb(255, 110, 0)"
          : "green";
      return (
        <mesh
          position={ll2xyz(2, 90 - cPoint.place.lat, cPoint.place.lon - 90)}
        >
          <sphereBufferGeometry
            attach="geometry"
            args={[
              Math.log10(1.1 + parseFloat(cPoint.cases.slice(-1)[0].n)) * 0.022,
              16,
              16
            ]}
          />
          <meshStandardMaterial attach="material" color={color} />
        </mesh>
      );
    });
    return <>{cPointsJSX}</>;
  };

  const ref = useRef();
  const [texture, bump, moon] = useLoader(THREE.TextureLoader, [
    "https://raw.githubusercontent.com/MattLoftus/threejs-space-simulations/master/images/earth_texture_2.jpg",
    makeUrl("earth_bump"),
    "http://jaanga.github.io/moon/heightmaps/WAC_GLD100_E000N1800_004P-1024x512.png"
  ]);
  useFrame(
    ({ clock }) =>
      (ref.current.rotation.y = Math.cos(clock.getElapsedTime() / 8) * Math.PI)
  );
  return (
    <group ref={ref}>
      <Stars />
      <rectAreaLight
        intensity={1}
        position={[10, 10, 10]}
        width={10}
        height={1000}
        onUpdate={self => self.lookAt(new THREE.Vector3(0, 0, 0))}
      />
      <rectAreaLight
        intensity={1}
        position={[-10, -10, -10]}
        width={1000}
        height={10}
        onUpdate={self => self.lookAt(new THREE.Vector3(0, 0, 0))}
      />
      <mesh>
        <sphereBufferGeometry attach="geometry" args={[2, 64, 64]} />
        <meshStandardMaterial
          attach="material"
          map={texture}
          bumpMap={bump}
          bumpScale={0.05}
        />
      </mesh>
      <mesh position={[5, 0, -10]}>
        <sphereBufferGeometry attach="geometry" args={[0.5, 64, 64]} />
        <meshStandardMaterial attach="material" color="gray" map={moon} />
      </mesh>
      {GetCPoints(cPoints)}
    </group>
  );
}

function Stars({ count = 5000 }) {
  const positions = useMemo(() => {
    let positions = [];
    for (let i = 0; i < count; i++) {
      positions.push(
        Math.random() * 10 * (Math.round(Math.random()) ? -40 : 40)
      );
      positions.push(
        Math.random() * 10 * (Math.round(Math.random()) ? -40 : 40)
      );
      positions.push(
        Math.random() * 10 * (Math.round(Math.random()) ? -40 : 40)
      );
    }
    return new Float32Array(positions);
  }, [count]);
  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={1}
        sizeAttenuation
        color="white"
        transparent
        opacity={0.8}
      />
    </points>
  );
}

export default props => (
  <Canvas
    style={{
      background:
        "radial-gradient(at 50% 70%, #200f20 40%, #090b1f 80%, #050523 100%)",
      zIndex: 1
    }}
    camera={{ position: [0, 0, 7], fov: 35 }}
    onCreated={({ gl }) => {
      gl.gammaInput = true;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
    }}
  >
    <pointLight intensity={0.4} position={[10, 10, 10]} />
    <rectAreaLight
      intensity={3}
      position={[0, 10, -10]}
      width={30}
      height={30}
      onUpdate={self => self.lookAt(new THREE.Vector3(0, 0, 0))}
    />
    <Suspense fallback={null}>
      <Earth {...props} />
    </Suspense>
  </Canvas>
);
