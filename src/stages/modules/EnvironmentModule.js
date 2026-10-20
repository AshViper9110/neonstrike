import * as THREE from 'three';
import { StageModule } from '../StageModule.js';
import { stageModules } from '../StageModule.js';
import { NEON_COLORS } from '../stageKit.js';

class EnvironmentModule extends StageModule {
  build(ctx) {
    const scene = ctx.scene;
    scene.fog = new THREE.FogExp2(0x05030f, 0.0115);
    scene.background = new THREE.Color(0x03020a);
    this.group = new THREE.Group();
    this.group.name = 'environment';
    scene.add(this.group);

    const skyGeo = new THREE.SphereGeometry(220, 32, 20);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x020107) },
        midColor: { value: new THREE.Color(0x14082b) },
        horizonColor: { value: new THREE.Color(0x081b2e) },
        glowColor: { value: new THREE.Color(0x3b0b54) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vWorldPosition;
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        uniform vec3 glowColor;
        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
          vec3 col = mix(horizonColor, midColor, smoothstep(0.42, 0.68, h));
          col = mix(col, topColor, smoothstep(0.68, 1.0, h));
          float horizon = exp(-abs(dir.y - 0.02) * 14.0);
          col += glowColor * horizon * 0.33;
          float band = smoothstep(0.16, 0.18, abs(dir.y)) - smoothstep(0.2, 0.3, abs(dir.y));
          col += vec3(0.0, 0.05, 0.07) * band;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.frustumCulled = false;
    this.group.add(sky);
    this.skyMat = skyMat;

    // Stars.
    const starCount = 850;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const palette = [new THREE.Color(0x9defff), new THREE.Color(0xffa4ef), new THREE.Color(0xb9b6ff), new THREE.Color(0xffffff)];
    for (let i = 0; i < starCount; i++) {
      const radius = 150 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.92 + 0.04);
      positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius * 0.9 + 12;
      positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      toneMapped: false,
      sizeAttenuation: true,
    });
    this.stars = new THREE.Points(starGeo, starMat);
    this.group.add(this.stars);

    // Floating motes inside the arena.
    const moteCount = 180;
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePositions[i * 3] = (Math.random() - 0.5) * 56;
      motePositions[i * 3 + 1] = Math.random() * 13 + 0.4;
      motePositions[i * 3 + 2] = (Math.random() - 0.5) * 56;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0x75f6ff,
      size: 0.07,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      fog: false,
    });
    this.motes = new THREE.Points(moteGeo, moteMat);
    this.group.add(this.motes);

    // Lighting.
    const hemi = new THREE.HemisphereLight(0x6b87ff, 0x09040f, 1.5);
    this.group.add(hemi);
    const dir = new THREE.DirectionalLight(0x9ecfff, 1.4);
    dir.position.set(12, 24, 8);
    this.group.add(dir);
    const pointA = new THREE.PointLight(NEON_COLORS.cyan, 260, 52, 1.8);
    pointA.position.set(-18, 8, -18);
    this.group.add(pointA);
    const pointB = new THREE.PointLight(NEON_COLORS.magenta, 300, 52, 1.8);
    pointB.position.set(18, 8, 18);
    this.group.add(pointB);
    const pointC = new THREE.PointLight(0x7347ff, 220, 44, 2);
    pointC.position.set(0, 11, 0);
    this.group.add(pointC);
  }

  update(dt, time) {
    if (this.stars) this.stars.rotation.y = time * 0.004;
    if (this.motes) {
      this.motes.rotation.y = time * 0.008;
      this.motes.position.y = Math.sin(time * 0.22) * 0.18;
    }
  }
}

stageModules.register('environment', EnvironmentModule);
export { EnvironmentModule };
