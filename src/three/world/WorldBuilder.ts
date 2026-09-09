import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PhysicsWorld } from '../PhysicsWorld';
import { PROJECTS, SKILLS, MILESTONES, CERTIFICATIONS } from '../../data/portfolioData';
import {
  createSkillBoxTexture,
  createBillboardTexture,
  createNitroArrowTexture,
  createRoadGridTexture
} from '../../utils/textureGenerator';

export interface InteractiveTrigger {
  id: string;
  type: 'project' | 'contact' | 'milestone' | 'nitro';
  position: THREE.Vector3;
  radius: number;
  data?: unknown;
}

export class WorldBuilder {
  private scene: THREE.Scene;
  private physicsWorld: PhysicsWorld;
  public triggers: InteractiveTrigger[] = [];
  public skillCrates: { mesh: THREE.Mesh; body: CANNON.Body; initialPos: [number, number, number] }[] = [];

  constructor(scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;

    this.buildTerrainAndRoads();
    this.buildTreesAndProps();
    this.buildSpawnPlaza();
    this.buildProjectsShowroom();
    this.buildSkillsZone();
    this.buildExperienceZone();
    this.buildContactZone();
    this.buildPlaygroundZone();
  }

  private buildTerrainAndRoads() {
    const roadTexture = createRoadGridTexture();
    const groundGeo = new THREE.PlaneGeometry(250, 250);
    const groundMat = new THREE.MeshStandardMaterial({
      map: roadTexture,
      roughness: 0.8,
      metalness: 0.1
    });

    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);

    // Outer Fence Perimeter
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const createFence = (x: number, z: number, w: number, d: number) => {
      const geo = new THREE.BoxGeometry(w, 2, d);
      const mesh = new THREE.Mesh(geo, fenceMat);
      mesh.position.set(x, 1, z);
      mesh.castShadow = true;
      this.scene.add(mesh);
      this.physicsWorld.createBoxBody(w, 2, d, 0, [x, 1, z]);
    };

    createFence(0, -125, 250, 2); // North
    createFence(0, 125, 250, 2);  // South
    createFence(-125, 0, 2, 250); // West
    createFence(125, 0, 2, 250);  // East
  }

  private buildTreesAndProps() {
    const treeGeo = new THREE.ConeGeometry(2, 5, 5);
    const trunkGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.5, 5);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

    const spawnTree = (x: number, z: number) => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.75;
      trunk.castShadow = true;
      group.add(trunk);

      const foliage = new THREE.Mesh(treeGeo, leafMat);
      foliage.position.y = 3.5;
      foliage.castShadow = true;
      group.add(foliage);

      group.position.set(x, 0, z);
      this.scene.add(group);
      this.physicsWorld.createSphereBody(0.6, 0, [x, 0.75, z]);
    };

    const treePositions: [number, number][] = [
      [-15, -15], [15, -15], [-15, 15], [15, 15],
      [-50, -40], [50, -40], [-50, 40], [50, 40],
      [-80, -80], [80, -80], [-80, 80], [80, 80],
      [-100, 0], [100, 0], [0, -100]
    ];

    treePositions.forEach(([x, z]) => spawnTree(x, z));
  }

  private buildSpawnPlaza() {
    // 3D Text Header Sculpture "ADITYA GUPTA"
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

      // G U P T A (Row 2 below)
      // G
      [-12, -0.5, 0, 0.7, 3], [-10.5, 0.8, 0, 2.2, 0.7], [-10.5, -1.8, 0, 2.2, 0.7], [-9.5, -0.7, 0, 0.7, 1.5], [-10.2, -0.7, 0, 1.2, 0.6],
      // U
      [-6.5, -0.5, 0, 0.7, 3], [-4.5, -0.5, 0, 0.7, 3], [-5.5, -1.8, 0, 1.7, 0.7],
      // P
      [-1.5, -0.5, 0, 0.7, 3], [0, 0.8, 0, 1.8, 0.7], [0, -0.3, 0, 1.8, 0.7], [0.6, 0.25, 0, 0.7, 1.3],
      // T
      [4, -0.5, 0, 0.7, 3], [4, 0.8, 0, 2.2, 0.7],
      // A
      [7.5, -0.5, 0, 0.7, 3], [9.5, -0.5, 0, 0.7, 3], [8.5, 0.8, 0, 1.7, 0.7], [8.5, -0.6, 0, 1.7, 0.7]
    ];

    letterBlocks.forEach(([x, y, z, w, h]) => {
      const geo = new THREE.BoxGeometry(w, h, 1.2);
      const mesh = new THREE.Mesh(geo, titleMat);
      mesh.position.set(x, y + 1.5, z);
      mesh.castShadow = true;
      titleGroup.add(mesh);
    });

    titleGroup.position.set(0, 0, -12);
    this.scene.add(titleGroup);

    // Welcome Road Billboard
    const bbTex = createBillboardTexture(
      'ADITYA GUPTA',
      'Data Scientist | Machine Learning Engineer | B.Tech CSE (2024-2028)',
      '#06b6d4'
    );
    const bbGeo = new THREE.PlaneGeometry(16, 7);
    const bbMat = new THREE.MeshBasicMaterial({ map: bbTex, side: THREE.DoubleSide });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.position.set(0, 5, 2);
    this.scene.add(bbMesh);

    // Starter Bowling Pins
    const pinGeo = new THREE.CylinderGeometry(0.2, 0.4, 1.4, 12);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const pinRedMat = new THREE.MeshStandardMaterial({ color: 0xff0033 });

    const pinRows = [
      [0, 0.7, 10],
      [-0.6, 0.7, 11.2], [0.6, 0.7, 11.2],
      [-1.2, 0.7, 12.4], [0, 0.7, 12.4], [1.2, 0.7, 12.4]
    ];

    pinRows.forEach(([px, py, pz]) => {
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      const ringMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.2, 12), pinRedMat);
      ringMesh.position.y = 0.3;
      pinMesh.add(ringMesh);

      pinMesh.position.set(px, py, pz);
      pinMesh.castShadow = true;
      this.scene.add(pinMesh);

      const pinBody = this.physicsWorld.createSphereBody(0.4, 2, [px, py, pz]);
      this.skillCrates.push({ mesh: pinMesh, body: pinBody, initialPos: [px, py, pz] });
    });
  }

  private buildProjectsShowroom() {
    const centerPos: [number, number] = [-28, -20];

    const bbTexture = createBillboardTexture('FEATURED PROJECTS', 'Drive onto glowing target rings to open project details', '#3b82f6');
    const bbGeo = new THREE.PlaneGeometry(16, 8);
    const bbMat = new THREE.MeshBasicMaterial({ map: bbTexture, side: THREE.DoubleSide });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.position.set(centerPos[0], 5, centerPos[1] - 12);
    this.scene.add(bbMesh);

    PROJECTS.forEach((project, idx) => {
      const angle = (idx / PROJECTS.length) * Math.PI * 2;
      const x = centerPos[0] + Math.cos(angle) * 12;
      const z = centerPos[1] + Math.sin(angle) * 12;

      // Ground Target Ring
      const ringGeo = new THREE.RingGeometry(2.5, 3.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: project.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(x, 0.05, z);
      this.scene.add(ringMesh);

      // Kiosk Pillar
      const pillarGeo = new THREE.BoxGeometry(2, 4, 0.5);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
      pillarMesh.position.set(x, 2, z - 2);
      pillarMesh.castShadow = true;
      this.scene.add(pillarMesh);

      // Project Sign
      const signTex = createSkillBoxTexture(project.title, project.category, project.color);
      const signGeo = new THREE.PlaneGeometry(3.6, 2.2);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(x, 4.2, z - 1.9);
      this.scene.add(signMesh);

      this.triggers.push({
        id: project.id,
        type: 'project',
        position: new THREE.Vector3(x, 1, z),
        radius: 3.5,
        data: project
      });

      this.physicsWorld.createBoxBody(2, 4, 0.5, 0, [x, 2, z - 2]);
    });
  }

  private buildSkillsZone() {
    const centerPos: [number, number] = [28, -20];

    const bbTexture = createBillboardTexture('TECHNICAL SKILLS', 'Crash into the skill crates to test strength!', '#8b5cf6');
    const bbGeo = new THREE.PlaneGeometry(14, 7);
    const bbMat = new THREE.MeshBasicMaterial({ map: bbTexture, side: THREE.DoubleSide });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.position.set(centerPos[0], 4.5, centerPos[1] - 8);
    this.scene.add(bbMesh);

    const crateWidth = 2.0;
    const crateHeight = 2.0;
    const crateDepth = 2.0;

    SKILLS.forEach((skill, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);

      const x = centerPos[0] + (col - 1.5) * (crateWidth + 0.3);
      const y = 1.0 + row * (crateHeight + 0.1);
      const z = centerPos[1];

      const tex = createSkillBoxTexture(skill.name, skill.category, skill.color);
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
    const centerPos: [number, number] = [-25, 25];

    // Milestone Highway Arches
    MILESTONES.forEach((ms, idx) => {
      const z = centerPos[1] + idx * 12;
      const x = centerPos[0];

      // Arch Posts
      const postGeo = new THREE.BoxGeometry(0.8, 6, 0.8);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8 });

      const leftPost = new THREE.Mesh(postGeo, postMat);
      leftPost.position.set(x - 5, 3, z);
      this.scene.add(leftPost);

      const rightPost = new THREE.Mesh(postGeo, postMat);
      rightPost.position.set(x + 5, 3, z);
      this.scene.add(rightPost);

      const beamGeo = new THREE.BoxGeometry(10.8, 1.2, 1.0);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(x, 6, z);
      this.scene.add(beamMesh);

      const bannerTex = createBillboardTexture(`${ms.year} - ${ms.role}`, `${ms.organization}: ${ms.description}`, '#10b981');
      const bannerGeo = new THREE.PlaneGeometry(10, 2.5);
      const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide });
      const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
      bannerMesh.position.set(x, 6, z + 0.55);
      this.scene.add(bannerMesh);

      this.physicsWorld.createBoxBody(0.8, 6, 0.8, 0, [x - 5, 3, z]);
      this.physicsWorld.createBoxBody(0.8, 6, 0.8, 0, [x + 5, 3, z]);
    });

    // Google Cloud Certifications Billboard next to experience
    const certTex = createBillboardTexture(
      'GOOGLE CLOUD CERTIFICATIONS',
      CERTIFICATIONS.join(' | '),
      '#4285f4'
    );
    const certGeo = new THREE.PlaneGeometry(14, 5);
    const certMat = new THREE.MeshBasicMaterial({ map: certTex, side: THREE.DoubleSide });
    const certMesh = new THREE.Mesh(certGeo, certMat);
    certMesh.position.set(centerPos[0], 4, centerPos[1] + MILESTONES.length * 12 + 4);
    this.scene.add(certMesh);
  }

  private buildContactZone() {
    const x = 25;
    const z = 25;

    const kioskGeo = new THREE.BoxGeometry(3, 6, 3);
    const kioskMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const kioskMesh = new THREE.Mesh(kioskGeo, kioskMat);
    kioskMesh.position.set(x, 3, z);
    kioskMesh.castShadow = true;
    this.scene.add(kioskMesh);

    const windowGeo = new THREE.BoxGeometry(2.6, 3, 2.6);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, opacity: 0.7, transparent: true });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.position.set(x, 3.5, z);
    this.scene.add(windowMesh);

    const bannerTex = createBillboardTexture('CONTACT ADITYA GUPTA', 'Email: adityaofficial9918@gmail.com | Phone: +91-7355583185', '#ef4444');
    const bannerGeo = new THREE.PlaneGeometry(10, 3.5);
    const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide });
    const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
    bannerMesh.position.set(x, 8, z);
    this.scene.add(bannerMesh);

    const ringGeo = new THREE.RingGeometry(3.0, 4.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(x, 0.05, z + 4);
    this.scene.add(ringMesh);

    this.triggers.push({
      id: 'contact-trigger',
      type: 'contact',
      position: new THREE.Vector3(x, 1, z + 4),
      radius: 4.5
    });

    this.physicsWorld.createBoxBody(3, 6, 3, 0, [x, 3, z]);
  }

  private buildPlaygroundZone() {
    const x = 0;
    const z = -45;

    const boostTex = createNitroArrowTexture();
    const padGeo = new THREE.PlaneGeometry(6, 16);
    const padMat = new THREE.MeshBasicMaterial({ map: boostTex, side: THREE.DoubleSide });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.rotation.x = -Math.PI / 2;
    padMesh.position.set(x, 0.06, z);
    this.scene.add(padMesh);

    this.triggers.push({
      id: 'nitro-boost',
      type: 'nitro',
      position: new THREE.Vector3(x, 1, z),
      radius: 5.0
    });

    const rampGeo = new THREE.BoxGeometry(8, 3, 10);
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
    const rampMesh = new THREE.Mesh(rampGeo, rampMat);
    rampMesh.rotation.x = -Math.PI / 8;
    rampMesh.position.set(x, 1.2, z - 18);
    rampMesh.castShadow = true;
    this.scene.add(rampMesh);

    const rampShape = new CANNON.Box(new CANNON.Vec3(4, 1.5, 5));
    const rampBody = new CANNON.Body({ mass: 0, shape: rampShape });
    rampBody.position.set(x, 1.2, z - 18);
    rampBody.quaternion.setFromEuler(-Math.PI / 8, 0, 0);
    this.physicsWorld.world.addBody(rampBody);

    const ballRadius = 2.5;
    const ballGeo = new THREE.SphereGeometry(ballRadius, 24, 24);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2, metalness: 0.3 });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.position.set(x + 12, ballRadius, z - 10);
    ballMesh.castShadow = true;
    this.scene.add(ballMesh);

    const ballBody = this.physicsWorld.createSphereBody(ballRadius, 10, [x + 12, ballRadius, z - 10]);
    this.skillCrates.push({ mesh: ballMesh, body: ballBody, initialPos: [x + 12, ballRadius, z - 10] });
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
    this.skillCrates.forEach(({ mesh, body }) => {
      mesh.position.copy(body.position as unknown as THREE.Vector3);
      mesh.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
    });
  }
}
