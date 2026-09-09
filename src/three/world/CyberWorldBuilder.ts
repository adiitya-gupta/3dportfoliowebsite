import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PhysicsWorld } from '../PhysicsWorld';
import { PROJECTS, SKILLS, MILESTONES, CERTIFICATIONS } from '../../data/portfolio';
import {
  createSkillBoxTexture,
  createBillboardTexture,
  createNitroArrowTexture,
  createRoadGridTexture
} from '../../utils/textureGenerator';

export interface InteractiveTrigger {
  id: string;
  type: 'project' | 'contact' | 'milestone' | 'nitro' | 'about' | 'resume' | 'easteregg';
  position: THREE.Vector3;
  radius: number;
  data?: unknown;
}

// Procedural Triangular Prism (Wedge) Visual Geometry Generator
export function createWedgeGeometry(width: number, height: number, length: number): THREE.BufferGeometry {
  const hw = width / 2;

  // 6 vertices of triangular prism (wedge)
  // Low front edge at z=0 (y=0) -> High back lip at z=-length (y=height)
  // Counter-clockwise vertex winding for outward-facing normals
  const positions = new Float32Array([
    // Sloped Top Face (2 triangles: 0-1-5, 0-5-4)
    -hw, 0, 0,
     hw, 0, 0,
     hw, height, -length,

    -hw, 0, 0,
     hw, height, -length,
    -hw, height, -length,

    // Back Vertical Face (2 triangles: 2-5-3, 2-4-5)
    -hw, 0, -length,
     hw, height, -length,
     hw, 0, -length,

    -hw, 0, -length,
    -hw, height, -length,
     hw, height, -length,

    // Bottom Face (2 triangles: 0-3-1, 0-2-3)
    -hw, 0, 0,
     hw, 0, -length,
     hw, 0, 0,

    -hw, 0, 0,
    -hw, 0, -length,
     hw, 0, -length,

    // Left Side Triangle (0-4-2)
    -hw, 0, 0,
    -hw, height, -length,
    -hw, 0, -length,

    // Right Side Triangle (1-3-5)
     hw, 0, 0,
     hw, 0, -length,
     hw, height, -length
  ]);

  // Texture UV Coordinates for Sloped Top Face & Back
  const uvs = new Float32Array([
    // Sloped Top Face UVs
    0, 0,   1, 0,   1, 1,
    0, 0,   1, 1,   0, 1,

    // Back Face UVs
    0, 0,   1, 1,   1, 0,
    0, 0,   0, 1,   1, 1,

    // Bottom Face UVs
    0, 0,   1, 1,   1, 0,
    0, 0,   0, 1,   1, 1,

    // Left Side UVs
    0, 0,   1, 1,   0, 1,

    // Right Side UVs
    0, 0,   1, 0,   1, 1
  ]);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

// Solid Triangular Prism (Wedge) Physics Body Generator in Cannon-es
export function createWedgePhysicsBody(
  width: number,
  height: number,
  length: number,
  position: [number, number, number],
  rotationY: number = 0,
  material?: CANNON.Material
): CANNON.Body {
  const hw = width / 2;

  // 6 vertices of the triangular prism in local space
  const vertices = [
    new CANNON.Vec3(-hw, 0, 0),         // 0: low front left
    new CANNON.Vec3(hw, 0, 0),          // 1: low front right
    new CANNON.Vec3(-hw, 0, -length),   // 2: low back left
    new CANNON.Vec3(hw, 0, -length),    // 3: low back right
    new CANNON.Vec3(-hw, height, -length), // 4: high back left
    new CANNON.Vec3(hw, height, -length)   // 5: high back right
  ];

  // 5 faces of the wedge with outward-pointing normals
  const faces = [
    [0, 1, 3, 2], // Bottom face
    [2, 3, 5, 4], // Back face
    [0, 2, 4],    // Left triangle
    [1, 5, 3],    // Right triangle
    [0, 4, 5, 1]  // Sloped top face
  ];

  const shape = new CANNON.ConvexPolyhedron({ vertices, faces });
  const body = new CANNON.Body({
    mass: 0, // Solid static body
    shape,
    material,
    position: new CANNON.Vec3(...position)
  });

  if (rotationY !== 0) {
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotationY);
  }

  return body;
}

export class CyberWorldBuilder {
  private scene: THREE.Scene;
  private physicsWorld: PhysicsWorld;
  public triggers: InteractiveTrigger[] = [];
  public skillCrates: { mesh: THREE.Mesh; body: CANNON.Body; initialPos: [number, number, number] }[] = [];

  constructor(scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;

    this.buildTerrainAndRoads();
    this.buildRoadLightingAndCurbs();
    this.buildCitySkyscrapers();
    this.buildTreesAndDecoration();
    this.buildSpawnPlaza();
    this.buildAboutBuilding();
    this.buildResumeTerminal();
    this.buildProjectsShowroom();
    this.buildSkillsZone();
    this.buildExperienceZone();
    this.buildContactZone();
    this.buildEasterEggPortal();
    this.buildPlaygroundZone();
  }

  private buildTerrainAndRoads() {
    // 1. Massive 600x600 Main Ground Terrain
    const roadTexture = createRoadGridTexture();
    roadTexture.repeat.set(24, 24);
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;

    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshStandardMaterial({
      map: roadTexture,
      roughness: 0.8,
      metalness: 0.1
    });

    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);

    // 2. Perimeter Walls (600x600 bounds)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const createWall = (x: number, z: number, w: number, d: number) => {
      const geo = new THREE.BoxGeometry(w, 4, d);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(x, 2, z);
      mesh.castShadow = true;
      this.scene.add(mesh);
      this.physicsWorld.createBoxBody(w, 4, d, 0, [x, 2, z]);
    };

    createWall(0, -300, 600, 4);
    createWall(0, 300, 600, 4);
    createWall(-300, 0, 4, 600);
    createWall(300, 0, 4, 600);

    // 3. Wide Asphalt Road Highways connecting districts
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const createRoad = (x: number, z: number, w: number, d: number) => {
      const geo = new THREE.PlaneGeometry(w, d);
      const mesh = new THREE.Mesh(geo, roadMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0.02, z);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    };

    // Central Highways
    createRoad(0, 0, 40, 600); // North-South Spine
    createRoad(0, 0, 600, 40); // East-West Spine
    createRoad(-100, -100, 300, 30); // Highway to Projects
    createRoad(100, -100, 300, 30);  // Highway to Skills
    createRoad(-100, 100, 300, 30);  // Highway to Internships
    createRoad(100, 100, 300, 30);   // Highway to Contact
  }

  private buildRoadLightingAndCurbs() {
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });

    // Raised sidewalk curbs framing main highways parallel to roads (leaving all driving lanes 100% flat)
    const createCurb = (x: number, z: number, w: number, d: number) => {
      const geo = new THREE.BoxGeometry(w, 0.25, d);
      const mesh = new THREE.Mesh(geo, curbMat);
      mesh.position.set(x, 0.125, z);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    };

    createCurb(-20.5, 0, 0.8, 600);
    createCurb(20.5, 0, 0.8, 600);
    createCurb(-160, -20.5, 280, 0.8);
    createCurb(160, -20.5, 280, 0.8);
    createCurb(-160, 20.5, 280, 0.8);
    createCurb(160, 20.5, 280, 0.8);

    // 3D Street Lamps along main roads
    const lampPoleGeo = new THREE.CylinderGeometry(0.15, 0.2, 7, 8);
    const lampArmGeo = new THREE.BoxGeometry(1.8, 0.12, 0.12);
    const lampCapGeo = new THREE.BoxGeometry(0.6, 0.1, 0.4);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const spawnStreetLamp = (x: number, z: number, rotationY: number) => {
      const lampGroup = new THREE.Group();
      const pole = new THREE.Mesh(lampPoleGeo, poleMat);
      pole.position.y = 3.5;
      pole.castShadow = true;
      lampGroup.add(pole);

      const arm = new THREE.Mesh(lampArmGeo, poleMat);
      arm.position.set(0.6, 6.8, 0);
      lampGroup.add(arm);

      const cap = new THREE.Mesh(lampCapGeo, lampGlowMat);
      cap.position.set(1.4, 6.7, 0);
      lampGroup.add(cap);

      const spotLight = new THREE.SpotLight(0x38bdf8, 8);
      spotLight.position.set(1.4, 6.5, 0);
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.5;
      spotLight.distance = 25;
      lampGroup.add(spotLight);

      lampGroup.position.set(x, 0, z);
      lampGroup.rotation.y = rotationY;
      this.scene.add(lampGroup);

      // Solid static streetlight pole collider (height 7m) - stops car 100% dead on impact!
      this.physicsWorld.createBoxBody(0.8, 7, 0.8, 0, [x, 3.5, z]);
    };

    // Spawn row of street lamps along N-S and E-W highways
    for (let z = -240; z <= 240; z += 40) {
      if (Math.abs(z) > 30) {
        spawnStreetLamp(-22, z, 0);
        spawnStreetLamp(22, z, Math.PI);
        spawnStreetLamp(z, -22, Math.PI / 2);
        spawnStreetLamp(z, 22, -Math.PI / 2);
      }
    }
  }

  private buildCitySkyscrapers() {
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, emissive: 0x0284c7, emissiveIntensity: 0.4 });
    const roofBeaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    const buildingCoords: [number, number, number, number, number][] = [
      // Outer Perimeter City Towers (x, z, width, depth, height)
      [-220, -220, 24, 24, 45], [-180, -240, 20, 20, 38], [-240, -180, 22, 22, 42],
      [220, -220, 24, 24, 48],  [180, -240, 20, 20, 35],  [240, -180, 22, 22, 40],
      [-220, 220, 24, 24, 42],  [-180, 240, 20, 20, 36],  [-240, 180, 22, 22, 44],
      [220, 220, 24, 24, 50],   [180, 240, 20, 20, 38],   [240, 180, 22, 22, 46],

      // Mid-District Skyscrapers framing zones
      [-160, -80, 18, 18, 30], [-160, 80, 18, 18, 32],
      [160, -80, 18, 18, 28],  [160, 80, 18, 18, 34],
      [-80, -160, 18, 18, 32], [80, -160, 18, 18, 30],
      [-80, 160, 18, 18, 34],  [80, 160, 18, 18, 36]
    ];

    buildingCoords.forEach(([bx, bz, bw, bd, bh]) => {
      const towerGroup = new THREE.Group();

      // Main tower block
      const geo = new THREE.BoxGeometry(bw, bh, bd);
      const mesh = new THREE.Mesh(geo, buildingMat);
      mesh.position.y = bh / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      towerGroup.add(mesh);

      // Glass window strips facade
      const winGeo = new THREE.BoxGeometry(bw + 0.1, bh * 0.7, bd + 0.1);
      const winMesh = new THREE.Mesh(winGeo, windowMat);
      winMesh.position.y = bh / 2;
      towerGroup.add(winMesh);

      // Rooftop antenna spike + red beacon
      const antennaGeo = new THREE.CylinderGeometry(0.1, 0.25, 6, 8);
      const antenna = new THREE.Mesh(antennaGeo, buildingMat);
      antenna.position.set(0, bh + 3, 0);
      towerGroup.add(antenna);

      const beaconGeo = new THREE.SphereGeometry(0.4, 8, 8);
      const beacon = new THREE.Mesh(beaconGeo, roofBeaconMat);
      beacon.position.set(0, bh + 6, 0);
      towerGroup.add(beacon);

      towerGroup.position.set(bx, 0, bz);
      this.scene.add(towerGroup);

      // Solid Cannon.js physics body for realistic collision
      this.physicsWorld.createBoxBody(bw, bh, bd, 0, [bx, bh / 2, bz]);
    });
  }

  private buildTreesAndDecoration() {
    const treeGeo = new THREE.ConeGeometry(2.5, 6, 6);
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.6, 2, 6);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

    // Cyber Palm Tree Geometry & Materials
    const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, emissive: 0x0891b2, emissiveIntensity: 0.3 });
    const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

    const spawnPineTree = (x: number, z: number) => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1;
      trunk.castShadow = true;
      group.add(trunk);

      const foliage = new THREE.Mesh(treeGeo, leafMat);
      foliage.position.y = 4;
      foliage.castShadow = true;
      group.add(foliage);

      group.position.set(x, 0, z);
      this.scene.add(group);

      // Solid static tree trunk collider (height 8m) - stops car 100% dead on impact!
      this.physicsWorld.createBoxBody(1.4, 8, 1.4, 0, [x, 4, z]);
    };

    const spawnCyberPalm = (x: number, z: number) => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 7, 8), palmTrunkMat);
      trunk.position.y = 3.5;
      trunk.castShadow = true;
      group.add(trunk);

      // 4 Fronds
      for (let i = 0; i < 4; i++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4, 4), palmFrondMat);
        frond.rotation.z = Math.PI / 3;
        frond.rotation.y = (i * Math.PI) / 2;
        frond.position.set(0, 6.8, 0);
        frond.castShadow = true;
        group.add(frond);
      }

      group.position.set(x, 0, z);
      this.scene.add(group);

      // Solid static tree trunk collider (height 8m) - stops car 100% dead on impact!
      this.physicsWorld.createBoxBody(1.4, 8, 1.4, 0, [x, 4, z]);
    };

    // Decorative tree rows along main avenues
    for (let i = -240; i <= 240; i += 30) {
      if (Math.abs(i) > 25) {
        if (Math.abs(i) % 60 === 0) {
          spawnCyberPalm(-25, i);
          spawnCyberPalm(25, i);
          spawnCyberPalm(i, -25);
          spawnCyberPalm(i, 25);
        } else {
          spawnPineTree(-25, i);
          spawnPineTree(25, i);
          spawnPineTree(i, -25);
          spawnPineTree(i, 25);
        }
      }
    }
  }

  private buildSpawnPlaza() {
    // 1. Centered 3D Extruded Text Sculpture "ADITYA GUPTA"
    const titleGroup = new THREE.Group();
    const titleMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      metalness: 0.9,
      roughness: 0.1
    });

    const letterBlocks: [number, number, number, number, number][] = [
      // A
      [-16, 4, 0, 0.7, 3.5], [-14, 4, 0, 0.7, 3.5], [-15, 5.5, 0, 1.8, 0.7], [-15, 3.8, 0, 1.8, 0.7],
      // D
      [-11, 4, 0, 0.7, 3.5], [-9.5, 5.5, 0, 1.6, 0.7], [-9.5, 2.5, 0, 1.6, 0.7], [-8.8, 4, 0, 0.7, 2.5],
      // I
      [-6, 4, 0, 0.7, 3.5], [-6, 5.5, 0, 1.8, 0.7], [-6, 2.5, 0, 1.8, 0.7],
      // T
      [-2, 4, 0, 0.7, 3.5], [-2, 5.5, 0, 2.5, 0.7],
      // Y
      [1.5, 4.8, 0, 0.7, 1.8], [3.2, 4.8, 0, 0.7, 1.8], [2.3, 3.0, 0, 0.7, 1.8],
      // A
      [6, 4, 0, 0.7, 3.5], [8, 4, 0, 0.7, 3.5], [7, 5.5, 0, 1.8, 0.7], [7, 3.8, 0, 1.8, 0.7],

      // G U P T A
      [-12, -0.5, 0, 0.7, 3], [-10.5, 0.8, 0, 2.2, 0.7], [-10.5, -1.8, 0, 2.2, 0.7], [-9.5, -0.7, 0, 0.7, 1.5], [-10.2, -0.7, 0, 1.2, 0.6],
      [-6.5, -0.5, 0, 0.7, 3], [-4.5, -0.5, 0, 0.7, 3], [-5.5, -1.8, 0, 1.7, 0.7],
      [-1.5, -0.5, 0, 0.7, 3], [0, 0.8, 0, 1.8, 0.7], [0, -0.3, 0, 1.8, 0.7], [0.6, 0.25, 0, 0.7, 1.3],
      [4, -0.5, 0, 0.7, 3], [4, 0.8, 0, 2.2, 0.7],
      [7.5, -0.5, 0, 0.7, 3], [9.5, -0.5, 0, 0.7, 3], [8.5, 0.8, 0, 1.7, 0.7], [8.5, -0.6, 0, 1.7, 0.7]
    ];

    letterBlocks.forEach(([x, y, z, w, h]) => {
      const geo = new THREE.BoxGeometry(w, h, 1.2);
      const mesh = new THREE.Mesh(geo, titleMat);
      mesh.position.set(x, y + 1.5, z);
      mesh.castShadow = true;
      titleGroup.add(mesh);
    });

    titleGroup.position.set(0, 0, -25);
    this.scene.add(titleGroup);
    this.physicsWorld.createBoxBody(30, 8, 2, 0, [0, 4, -25]);

    // Welcome Billboard (2:1 aspect ratio plane)
    const bbTex = createBillboardTexture(
      'ADITYA GUPTA',
      'Data Scientist | Machine Learning Engineer | Lovely Professional University',
      '#06b6d4'
    );
    const bbGeo = new THREE.PlaneGeometry(18, 9);
    const bbMat = new THREE.MeshBasicMaterial({ map: bbTex, side: THREE.DoubleSide });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.position.set(0, 6, -12);
    this.scene.add(bbMesh);

    // Solid physics colliders for Welcome Billboard frame and support posts
    this.physicsWorld.createBoxBody(18, 9, 1.5, 0, [0, 6, -12]);
    this.physicsWorld.createBoxBody(1.2, 7, 1.2, 0, [-8, 3.5, -12]);
    this.physicsWorld.createBoxBody(1.2, 7, 1.2, 0, [8, 3.5, -12]);

  }

  private buildAboutBuilding() {
    const x = -90;
    const z = -15;

    // About Terminal Building
    const geo = new THREE.BoxGeometry(10, 7, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 3.5, z);
    mesh.castShadow = true;
    this.scene.add(mesh);

    // Large Glass Screen (2:1 aspect ratio plane)
    const screenTex = createBillboardTexture('ABOUT ADITYA GUPTA', 'B.Tech CSE (Data Science & ML) | Lovely Professional University', '#38bdf8');
    const screenGeo = new THREE.PlaneGeometry(16, 8);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.DoubleSide });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(x, 4.2, z + 4.05);
    this.scene.add(screenMesh);

    // Glowing Interactive Target Ring
    const ringGeo = new THREE.RingGeometry(3.5, 4.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(x, 0.05, z + 12);
    this.scene.add(ringMesh);

    this.triggers.push({
      id: 'about-trigger',
      type: 'about',
      position: new THREE.Vector3(x, 1, z + 12),
      radius: 5.0
    });

    this.physicsWorld.createBoxBody(10, 7, 8, 0, [x, 3.5, z]);
  }

  private buildResumeTerminal() {
    const x = -90;
    const z = 30;

    const geo = new THREE.BoxGeometry(6, 6, 4);
    const mat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 3, z);
    mesh.castShadow = true;
    this.scene.add(mesh);

    // 2:1 aspect ratio plane
    const screenTex = createBillboardTexture('RESUME TERMINAL', 'View & Download Official Curriculum Vitae', '#a78bfa');
    const screenGeo = new THREE.PlaneGeometry(14, 7);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.DoubleSide });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(x, 3.8, z + 2.05);
    this.scene.add(screenMesh);

    const ringGeo = new THREE.RingGeometry(3.2, 4.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(x, 0.05, z + 8);
    this.scene.add(ringMesh);

    this.triggers.push({
      id: 'resume-trigger',
      type: 'resume',
      position: new THREE.Vector3(x, 1, z + 8),
      radius: 4.5
    });

    this.physicsWorld.createBoxBody(6, 6, 4, 0, [x, 3, z]);
  }

  private buildProjectsShowroom() {
    const centerPos: [number, number] = [-100, -100];

    // Elevated Cyber Plaza Platform (70x70)
    const plazaGeo = new THREE.BoxGeometry(75, 0.4, 75);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.position.set(centerPos[0], 0.2, centerPos[1]);
    plazaMesh.receiveShadow = true;
    this.scene.add(plazaMesh);

    // 2:1 aspect ratio billboard plane
    const bbTexture = createBillboardTexture('FEATURED PROJECTS SHOWROOM', 'Drive onto glowing target rings to open project details', '#3b82f6');
    const bbGeo = new THREE.PlaneGeometry(20, 10);
    const bbMat = new THREE.MeshBasicMaterial({ map: bbTexture, side: THREE.DoubleSide });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.position.set(centerPos[0], 8, centerPos[1] - 30);
    this.scene.add(bbMesh);

    // 4 Project Kiosks spaced wide apart
    const projectPositions: [number, number][] = [
      [centerPos[0] - 25, centerPos[1] - 10],
      [centerPos[0] - 8,  centerPos[1] - 10],
      [centerPos[0] + 8,  centerPos[1] - 10],
      [centerPos[0] + 25, centerPos[1] - 10]
    ];

    PROJECTS.forEach((project, idx) => {
      const [x, z] = projectPositions[idx];

      const ringGeo = new THREE.RingGeometry(3.0, 3.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: project.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(x, 0.45, z + 6);
      this.scene.add(ringMesh);

      const pillarGeo = new THREE.BoxGeometry(4, 5, 1);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
      pillarMesh.position.set(x, 2.7, z);
      pillarMesh.castShadow = true;
      this.scene.add(pillarMesh);

      const signTex = createSkillBoxTexture(project.title, project.category, project.color);
      const signGeo = new THREE.PlaneGeometry(6, 3.6);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(x, 5.2, z + 0.55);
      this.scene.add(signMesh);

      this.triggers.push({
        id: project.id,
        type: 'project',
        position: new THREE.Vector3(x, 1, z + 6),
        radius: 4.0,
        data: project
      });

      this.physicsWorld.createBoxBody(4, 5, 1, 0, [x, 2.7, z]);
    });
  }

  private buildSkillsZone() {
    const centerPos: [number, number] = [100, -100];

    // 2:1 aspect ratio billboard plane
    const bbTexture = createBillboardTexture('SKILLS LABORATORY & ARENA', 'Crash into skill crates to test physics strength!', '#8b5cf6');
    const bbGeo = new THREE.PlaneGeometry(20, 10);
    const bbMat = new THREE.MeshBasicMaterial({ map: bbTexture, side: THREE.DoubleSide });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.position.set(centerPos[0], 7.5, centerPos[1] - 20);
    this.scene.add(bbMesh);

    const crateWidth = 2.8;
    const crateHeight = 2.8;
    const crateDepth = 2.8;

    SKILLS.forEach((skill, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);

      const x = centerPos[0] + (col - 1.5) * (crateWidth + 0.6);
      const y = 1.4 + row * (crateHeight + 0.2);
      const z = centerPos[1];

      const tex = createSkillBoxTexture(skill.name, skill.experienceDuration, skill.color);
      const geo = new THREE.BoxGeometry(crateWidth, crateHeight, crateDepth);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.3,
        metalness: 0.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);

      const body = this.physicsWorld.createBoxBody(crateWidth, crateHeight, crateDepth, 5, [x, y, z], this.physicsWorld.crateMaterial);

      this.skillCrates.push({
        mesh,
        body,
        initialPos: [x, y, z]
      });
    });
  }

  private buildExperienceZone() {
    const centerPos: [number, number] = [-100, 100];

    MILESTONES.forEach((ms, idx) => {
      const z = centerPos[1] + idx * 24;
      const x = centerPos[0];

      const postGeo = new THREE.BoxGeometry(1.2, 9, 1.2);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8 });

      const leftPost = new THREE.Mesh(postGeo, postMat);
      leftPost.position.set(x - 9, 4.5, z);
      this.scene.add(leftPost);

      const rightPost = new THREE.Mesh(postGeo, postMat);
      rightPost.position.set(x + 9, 4.5, z);
      this.scene.add(rightPost);

      const beamGeo = new THREE.BoxGeometry(19.2, 1.8, 1.4);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(x, 9, z);
      this.scene.add(beamMesh);

      // 2:1 aspect ratio billboard plane matching 2048x1024 text texture
      const bannerTex = createBillboardTexture(`${ms.year} - ${ms.role}`, `${ms.organization}: ${ms.description}`, '#10b981');
      const bannerGeo = new THREE.PlaneGeometry(18, 9);
      const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide });
      const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
      bannerMesh.position.set(x, 9, z + 0.75);
      this.scene.add(bannerMesh);

      this.physicsWorld.createBoxBody(1.2, 9, 1.2, 0, [x - 9, 4.5, z]);
      this.physicsWorld.createBoxBody(1.2, 9, 1.2, 0, [x + 9, 4.5, z]);
    });

    // 2:1 aspect ratio certifications billboard
    const certTex = createBillboardTexture(
      'GOOGLE CLOUD CERTIFICATIONS',
      CERTIFICATIONS.join(' | '),
      '#4285f4'
    );
    const certGeo = new THREE.PlaneGeometry(20, 10);
    const certMat = new THREE.MeshBasicMaterial({ map: certTex, side: THREE.DoubleSide });
    const certMesh = new THREE.Mesh(certGeo, certMat);
    certMesh.position.set(centerPos[0], 6, centerPos[1] + MILESTONES.length * 24 + 10);
    this.scene.add(certMesh);
  }

  private buildContactZone() {
    const x = 100;
    const z = 100;

    const kioskGeo = new THREE.BoxGeometry(5, 10, 5);
    const kioskMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const kioskMesh = new THREE.Mesh(kioskGeo, kioskMat);
    kioskMesh.position.set(x, 5, z);
    kioskMesh.castShadow = true;
    this.scene.add(kioskMesh);

    const windowGeo = new THREE.BoxGeometry(4.2, 4.5, 4.2);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, opacity: 0.7, transparent: true });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.position.set(x, 5.5, z);
    this.scene.add(windowMesh);

    // 2:1 aspect ratio plane
    const bannerTex = createBillboardTexture('CONTACT ADITYA GUPTA', 'Email: adityaofficial9918@gmail.com | Phone: +91-7355583185', '#ef4444');
    const bannerGeo = new THREE.PlaneGeometry(18, 9);
    const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide });
    const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
    bannerMesh.position.set(x, 12, z);
    this.scene.add(bannerMesh);

    const ringGeo = new THREE.RingGeometry(4.0, 5.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(x, 0.05, z + 8);
    this.scene.add(ringMesh);

    this.triggers.push({
      id: 'contact-trigger',
      type: 'contact',
      position: new THREE.Vector3(x, 1, z + 8),
      radius: 5.5
    });

    this.physicsWorld.createBoxBody(5, 10, 5, 0, [x, 5, z]);
  }

  private buildEasterEggPortal() {
    const x = 180;
    const z = -180;

    const portalRingGeo = new THREE.TorusGeometry(4.5, 0.6, 16, 32);
    const portalMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const portalMesh = new THREE.Mesh(portalRingGeo, portalMat);
    portalMesh.position.set(x, 4.5, z);
    this.scene.add(portalMesh);

    // 2:1 aspect ratio plane
    const screenTex = createBillboardTexture('SECRET VAULT', 'Easter Egg Unlocked! Developer Matrix', '#10b981');
    const screenGeo = new THREE.PlaneGeometry(12, 6);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.DoubleSide });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(x, 4.5, z);
    this.scene.add(screenMesh);

    this.triggers.push({
      id: 'easter-egg-trigger',
      type: 'easteregg',
      position: new THREE.Vector3(x, 1, z),
      radius: 5.0
    });
  }

  private buildPlaygroundZone() {
    const rampX = 0;
    const rampStartZ = -195; // Low front entrance of ramp
    const rampLength = 22;
    const rampHeight = 5.0;
    const rampWidth = 14;
    const travelDir = new THREE.Vector3(0, 0, -1); // Travel direction towards -Z

    // 1. Triple Consecutive Nitro Boost Runway Pads (x=0, z=-155 to z=-195)
    const boostTex = createNitroArrowTexture();
    const padGeo = new THREE.PlaneGeometry(10, 36);
    const padMat = new THREE.MeshBasicMaterial({ map: boostTex, side: THREE.DoubleSide });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.rotation.x = -Math.PI / 2;
    padMesh.position.set(rampX, 0.06, rampStartZ + 22);
    this.scene.add(padMesh);

    this.triggers.push({
      id: 'nitro-boost-runway',
      type: 'nitro',
      position: new THREE.Vector3(rampX, 1, rampStartZ + 22),
      radius: 8.0
    });

    // 2. AAA STUNT RAMP VISUAL ASSEMBLY (Centered x=0)
    const rampGroup = new THREE.Group();

    // A. Main Treaded Slope Wedge
    const rampGeo = createWedgeGeometry(rampWidth, rampHeight, rampLength);
    const rampMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.8,
      side: THREE.DoubleSide
    });
    const rampMesh = new THREE.Mesh(rampGeo, rampMat);
    rampMesh.castShadow = true;
    rampMesh.receiveShadow = true;
    rampGroup.add(rampMesh);

    // B. Sloped Arrow Texture Overlay on Top Face
    const slopeOverlayGeo = createWedgeGeometry(rampWidth - 0.2, rampHeight + 0.05, rampLength);
    const slopeArrowMat = new THREE.MeshBasicMaterial({
      map: boostTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const slopeOverlayMesh = new THREE.Mesh(slopeOverlayGeo, slopeArrowMat);
    rampGroup.add(slopeOverlayMesh);

    // C. Glowing Neon Cyan Side Guardrails (Left and Right edges)
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x00f3ff,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });

    [-rampWidth / 2, rampWidth / 2].forEach((xSide) => {
      // Sloped side beam
      const railGeo = new THREE.CylinderGeometry(0.3, 0.3, Math.hypot(rampHeight, rampLength), 16);
      const railMesh = new THREE.Mesh(railGeo, railMat);
      const angle = Math.atan2(rampHeight, rampLength);
      railMesh.rotation.x = angle;
      railMesh.position.set(xSide, rampHeight / 2 + 0.3, -rampLength / 2);
      rampGroup.add(railMesh);
    });

    // D. Steel Support Pillars Underneath High Back Lip
    const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, rampHeight, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    [-rampWidth / 2 + 0.8, rampWidth / 2 - 0.8].forEach((xPillar) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(xPillar, rampHeight / 2, -rampLength);
      pillar.castShadow = true;
      rampGroup.add(pillar);
    });

    // E. Glowing White Takeoff Bar across the top lip
    const lipGeo = new THREE.BoxGeometry(rampWidth + 0.4, 0.4, 0.6);
    const lipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lipMesh = new THREE.Mesh(lipGeo, lipMat);
    lipMesh.position.set(0, rampHeight + 0.2, -rampLength);
    rampGroup.add(lipMesh);

    rampGroup.position.set(rampX, 0, rampStartZ);
    rampGroup.userData = { isUplifter: true };
    this.scene.add(rampGroup);

    // 3. Solid Cannon-es Wedge Physics Collider (Exact 1:1 match with visual wedge)
    const rampBody = createWedgePhysicsBody(
      rampWidth,
      rampHeight,
      rampLength,
      [rampX, 0, rampStartZ],
      0,
      this.physicsWorld.defaultMaterial
    );
    (rampBody as unknown as { userData: { isUplifter: boolean } }).userData = { isUplifter: true };
    this.physicsWorld.world.addBody(rampBody);

    // 4. Dedicated Airborne Launch Trigger (Positioned near the high takeoff lip at z = -215)
    const launchLipZ = rampStartZ - rampLength * 0.85; // ~ z = -214
    this.triggers.push({
      id: 'ramp-launch-trigger',
      type: 'nitro',
      position: new THREE.Vector3(rampX, rampHeight * 0.7, launchLipZ),
      radius: 7.5,
      data: {
        isRampLaunch: true,
        direction: travelDir,
        forwardForce: 42,
        upwardForce: 24
      }
    });

    // 5. Giant Bouncing Soccer & Beach Balls
    const spawnBall = (radius: number, color: number, bx: number, bz: number) => {
      const ballGeo = new THREE.SphereGeometry(radius, 32, 32);
      const ballMat = new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.3 });
      const ballMesh = new THREE.Mesh(ballGeo, ballMat);
      ballMesh.position.set(bx, radius, bz);
      ballMesh.castShadow = true;
      this.scene.add(ballMesh);

      const ballBody = this.physicsWorld.createSphereBody(radius, 12, [bx, radius, bz]);
      this.skillCrates.push({ mesh: ballMesh, body: ballBody, initialPos: [bx, radius, bz] });
    };

    spawnBall(3.5, 0x3b82f6, 25, -240);   // Giant Blue Beachball
    spawnBall(4.0, 0xef4444, -25, -240);  // Giant Red Soccer Ball
    spawnBall(3.0, 0x10b981, 0, -290);    // Giant Green Emerald Ball

    // 6. Destructible Pyramid Crate Stack (10 crates)
    const pCrateWidth = 2.4;
    const pCrateHeight = 2.4;
    const pCrateDepth = 2.4;

    const crateLevels = [
      // Base Level (4 crates)
      [-3.6, 1.2, -265], [-1.2, 1.2, -265], [1.2, 1.2, -265], [3.6, 1.2, -265],
      // Level 2 (3 crates)
      [-2.4, 3.6, -265], [0, 3.6, -265], [2.4, 3.6, -265],
      // Level 3 (2 crates)
      [-1.2, 6.0, -265], [1.2, 6.0, -265],
      // Top (1 crate)
      [0, 8.4, -265]
    ];

    crateLevels.forEach(([cx, cy, cz]) => {
      const geo = new THREE.BoxGeometry(pCrateWidth, pCrateHeight, pCrateDepth);
      const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cx, cy, cz);
      mesh.castShadow = true;
      this.scene.add(mesh);

      const body = this.physicsWorld.createBoxBody(pCrateWidth, pCrateHeight, pCrateDepth, 4, [cx, cy, cz], this.physicsWorld.crateMaterial);
      this.skillCrates.push({ mesh, body, initialPos: [cx, cy, cz] });
    });

    // 7. Full 10-Pin Bowling Alley Setup
    const pinGeo = new THREE.CylinderGeometry(0.3, 0.6, 2.0, 16);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const pinRedMat = new THREE.MeshStandardMaterial({ color: 0xff0033 });

    const bowlingPins = [
      [0, 1.0, -300],
      [-1.0, 1.0, -302], [1.0, 1.0, -302],
      [-2.0, 1.0, -304], [0, 1.0, -304], [2.0, 1.0, -304],
      [-3.0, 1.0, -306], [-1.0, 1.0, -306], [1.0, 1.0, -306], [3.0, 1.0, -306]
    ];

    bowlingPins.forEach(([px, py, pz]) => {
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      const ringMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16), pinRedMat);
      ringMesh.position.y = 0.4;
      pinMesh.add(ringMesh);

      pinMesh.position.set(px, py, pz);
      pinMesh.castShadow = true;
      this.scene.add(pinMesh);

      const pinBody = this.physicsWorld.createPropBody(0.35, 1.5, 0.35, 0.2, [px, py, pz]);
      this.skillCrates.push({ mesh: pinMesh, body: pinBody, initialPos: [px, py, pz] });
    });
  }

  public resetSkillCrates() {
    this.skillCrates.forEach(({ mesh, body, initialPos }) => {
      body.position.set(...initialPos);
      body.velocity.set(0, 0, 0);
      body.angularVelocity.set(0, 0, 0);
      body.quaternion.set(0, 0, 0, 1);
      mesh.position.set(...initialPos);
      mesh.quaternion.set(0, 0, 0, 1);
    });
  }

  public updateCrateMeshes() {
    this.skillCrates.forEach(({ mesh, body, initialPos }) => {
      // Auto-recover any object if it falls off the map boundaries or launches out of bounds
      if (body.position.y < -3 || body.position.y > 45 || Math.abs(body.position.x) > 350 || Math.abs(body.position.z) > 400) {
        body.position.set(...initialPos);
        body.velocity.set(0, 0, 0);
        body.angularVelocity.set(0, 0, 0);
        body.quaternion.set(0, 0, 0, 1);
      }
      mesh.position.copy(body.position as unknown as THREE.Vector3);
      mesh.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
    });
  }
}
