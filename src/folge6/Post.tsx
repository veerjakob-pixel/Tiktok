// Eigene Einbindung von "postprocessing" (Leuchten + Vignette), direkt in der Render-Schleife.
import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { BloomEffect, EffectComposer, EffectPass, RenderPass, VignetteEffect } from "postprocessing";

export const Post: React.FC<{ bloom: number; vignette: number }> = ({ bloom, vignette }) => {
  const { gl, scene, camera, size } = useThree();
  const composer = React.useMemo(() => {
    const c = new EffectComposer(gl, { frameBufferType: THREE.HalfFloatType, multisampling: 4 });
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new EffectPass(camera, new BloomEffect({ intensity: bloom, luminanceThreshold: 0.75, luminanceSmoothing: 0.2, mipmapBlur: true }), new VignetteEffect({ offset: 0.3, darkness: vignette })));
    return c;
  }, [gl, scene, camera, bloom, vignette]);
  React.useLayoutEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);
  React.useEffect(() => () => composer.dispose(), [composer]);
  useFrame(() => {
    composer.render();
  }, 1);
  return null;
};
