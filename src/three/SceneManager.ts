import * as THREE from 'three';
import { PhysicsWorld } from './PhysicsWorld';
import { VehicleController } from './VehicleController';
import { CyberWorldBuilder } from './world/CyberWorldBuilder';
import type { VehicleControls, VehicleStats, Project, EnvironmentTheme } from '../types/index';
import { TELEPORT_TARGETS } from '../data/portfolio';
import { soundManager } from '../utils/sound';

export interface SceneCallbacks {
  onVehicleStatsUpdate: (stats: VehicleStats) => void;
  onProjectTrigger: (project: Project | null) => void;
  onContactTrigger: (active: boolean) => void;
  onAboutTrigger: (active: boolean) => void;
  onResumeTrigger: (active: boolean) => void;
  onEasterEggTrigger: (active: boolean) => void;
}

export class SceneManager {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private physicsWorld: PhysicsWorld;
  public vehicleController: VehicleController;
  public worldBuilder: CyberWorldBuilder;

  private clock: THREE.Clock;
  private callbacks: SceneCallbacks;

  // Active Triggers State
  private currentActiveProject: Project | null = null;
  private isContactActive: boolean = false;
  private isAboutActive: boolean = false;
  private isResumeActive: boolean = false;
  private isEasterEggActive: boolean = false;
  private currentZoneName: string = 'Start Plaza';

  // Environmental Day/Night Lighting
  private sunLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private currentTheme: EnvironmentTheme = 'night';

  // Physics Debug Mode Visualization
  public isDebugMode: boolean = false;
  private debugGroup: THREE.Group;

  constructor(canvas: HTMLCanvasElement, callbacks: SceneCallbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Three.js Scene
    this.scene = new THREE.Scene();

    // Debug Group
    this.debugGroup = new THREE.Group();
    this.scene.add(this.debugGroup);

    this.applyTheme(this.currentTheme);

    // Camera
    const aspect = window.innerWidth / window.innerHeight;
    const initialFov = this.calculateFov(aspect);
    this.camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 800);
    this.camera.position.set(0, 12, 18);

    // Lighting
    this.setupLighting();

    // Physics & Cyber World
    this.physicsWorld = new PhysicsWorld();
    this.vehicleController = new VehicleController(this.scene, this.physicsWorld, [0, 0.5, 5]);
    this.worldBuilder = new CyberWorldBuilder(this.scene, this.physicsWorld);

    window.addEventListener('resize', this.onWindowResize.bind(this));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.onWindowResize.bind(this));
    }
  }

  private setupLighting() {
    this.hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0xfef08a, 1.2);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    this.sunLight.position.set(80, 140, 60);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 400;
    this.sunLight.shadow.camera.left = -150;
    this.sunLight.shadow.camera.right = 150;
    this.sunLight.shadow.camera.top = 150;
    this.sunLight.shadow.camera.bottom = -150;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);
  }

  public applyTheme(theme: EnvironmentTheme) {
    this.currentTheme = theme;
    if (theme === 'night') {
      this.scene.background = new THREE.Color(0x020617);
      this.scene.fog = new THREE.FogExp2(0x020617, 0.003);
      if (this.hemiLight) this.hemiLight.intensity = 0.6;
      if (this.sunLight) this.sunLight.intensity = 0.9;
    } else {
      this.scene.background = new THREE.Color(0x7dd3fc); // Vibrant Bright Blue Sky
      this.scene.fog = new THREE.FogExp2(0x7dd3fc, 0.001);
      if (this.hemiLight) {
        this.hemiLight.color.setHex(0x7dd3fc);
        this.hemiLight.groundColor.setHex(0xfef08a);
        this.hemiLight.intensity = 1.4;
      }
      if (this.sunLight) {
        this.sunLight.color.setHex(0xfffbeb);
        this.sunLight.intensity = 2.2;
      }
    }
  }

  public toggleDebugMode(): boolean {
    this.isDebugMode = !this.isDebugMode;
    if (!this.isDebugMode) {
      this.debugGroup.clear();
    }
    return this.isDebugMode;
  }

  public update(controls: VehicleControls) {
    const deltaTime = this.clock.getDelta();

    this.physicsWorld.update(deltaTime);
    this.vehicleController.update(deltaTime, controls);
    this.worldBuilder.updateCrateMeshes();

    this.updateCamera();
    this.checkTriggers();

    if (this.isDebugMode) {
      this.updateDebugVisuals();
    }

    this.callbacks.onVehicleStatsUpdate({
      speedKmh: this.vehicleController.getSpeedKmh(),
      nitroLevel: this.vehicleController.nitroLevel,
      isBoosting: this.vehicleController.isBoosting,
      currentZone: this.currentZoneName
    });

    this.renderer.render(this.scene, this.camera);
  }

  private updateCamera() {
    const carPos = this.vehicleController.mesh.position;
    const carQuat = this.vehicleController.mesh.quaternion;

    const aspect = window.innerWidth / window.innerHeight;
    const isMobilePortrait = aspect < 1.0;

    // Dynamically adjust camera height & distance for mobile aspect ratios
    const offsetY = isMobilePortrait ? 9.5 : 7.5;
    const offsetZ = isMobilePortrait ? -18.5 : -15.0;

    const cameraOffset = new THREE.Vector3(0, offsetY, offsetZ).applyQuaternion(carQuat);
    const targetCamPos = carPos.clone().add(cameraOffset);

    this.camera.position.lerp(targetCamPos, 0.08);

    const lookTarget = carPos.clone().add(new THREE.Vector3(0, 1.8, 3.5).applyQuaternion(carQuat));
    this.camera.lookAt(lookTarget);
  }

  private updateDebugVisuals() {
    this.debugGroup.clear();

    const carPos = this.vehicleController.mesh.position;
    const carQuat = this.vehicleController.mesh.quaternion;

    // 1. CAR COMPOUND BOX COLLIDER WIREFRAME (Cyan Wireframe Box 1.8m x 0.7m x 3.7m)
    const carBoxGeo = new THREE.BoxGeometry(1.8, 0.7, 3.7);
    const carWireGeo = new THREE.WireframeGeometry(carBoxGeo);
    const carWireMat = new THREE.LineBasicMaterial({ color: 0x00f3ff, linewidth: 2 });
    const carWireMesh = new THREE.LineSegments(carWireGeo, carWireMat);
    carWireMesh.position.copy(carPos).add(new THREE.Vector3(0, 0.45, 0).applyQuaternion(carQuat));
    carWireMesh.quaternion.copy(carQuat);
    this.debugGroup.add(carWireMesh);

    // 2. CAR FORWARD VECTOR (Cyan Arrow)
    const carForward = new THREE.Vector3(0, 0, 1).applyQuaternion(carQuat).normalize();
    const carArrow = new THREE.ArrowHelper(carForward, carPos.clone().add(new THREE.Vector3(0, 1.2, 0)), 7, 0x00f3ff, 1.4, 0.7);
    this.debugGroup.add(carArrow);

    // 3. RAMP UPHILL VECTOR (Yellow Arrow at z = 20)
    const rampEntrance = new THREE.Vector3(0, 0.2, 20);
    const rampUphill = new THREE.Vector3(0, 3.5, 15).normalize();
    const rampArrow = new THREE.ArrowHelper(rampUphill, rampEntrance, 10, 0xf59e0b, 1.8, 0.8);
    this.debugGroup.add(rampArrow);

    // 4. LAUNCH DIRECTION VECTOR (Red Arrow at takeoff lip z = 35)
    const launchLipPos = new THREE.Vector3(0, 3.8, 35);
    const launchDir = new THREE.Vector3(0, 24, 42).normalize();
    const launchArrow = new THREE.ArrowHelper(launchDir, launchLipPos, 12, 0xff0033, 2.0, 0.9);
    this.debugGroup.add(launchArrow);

    // 5. RAMP COLLIDER BOUNDING BOX (Green Wireframe Box)
    const rampBoxGeo = new THREE.BoxGeometry(12, 3.5, 15);
    const wireGeo = new THREE.WireframeGeometry(rampBoxGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    wireMesh.position.set(0, 1.75, 27.5);
    this.debugGroup.add(wireMesh);

    // 6. LAUNCH TRIGGER ZONE (Yellow Wireframe Sphere)
    const triggerSphereGeo = new THREE.SphereGeometry(6.5, 16, 16);
    const triggerWireGeo = new THREE.WireframeGeometry(triggerSphereGeo);
    const triggerWireMat = new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 1.5 });
    const triggerWireMesh = new THREE.LineSegments(triggerWireGeo, triggerWireMat);
    triggerWireMesh.position.set(0, 3.5, 35);
    this.debugGroup.add(triggerWireMesh);
  }

  private checkTriggers() {
    const carPos = this.vehicleController.mesh.position;

    let closestZone = 'Start Plaza';
    let minZoneDist = Infinity;

    TELEPORT_TARGETS.forEach((target) => {
      const zoneVec = new THREE.Vector3(...target.position);
      const dist = carPos.distanceTo(zoneVec);
      if (dist < minZoneDist) {
        minZoneDist = dist;
        closestZone = target.label;
      }
    });
    this.currentZoneName = closestZone;

    let foundProject: Project | null = null;
    let contactHit = false;
    let aboutHit = false;
    let resumeHit = false;
    let easterEggHit = false;

    this.worldBuilder.triggers.forEach((trigger) => {
      const dist = carPos.distanceTo(trigger.position);
      if (dist <= trigger.radius) {
        if (trigger.type === 'project') {
          foundProject = trigger.data as Project;
        } else if (trigger.type === 'contact') {
          contactHit = true;
        } else if (trigger.type === 'about') {
          aboutHit = true;
        } else if (trigger.type === 'resume') {
          resumeHit = true;
        } else if (trigger.type === 'easteregg') {
          easterEggHit = true;
        } else if (trigger.type === 'nitro') {
          const data = trigger.data as { isRampLaunch?: boolean; direction?: THREE.Vector3; forwardForce?: number; upwardForce?: number } | undefined;
          if (data?.isRampLaunch && data.direction) {
            this.vehicleController.triggerRampLaunch(data.direction, data.forwardForce || 38, data.upwardForce || 22);
          } else {
            this.vehicleController.nitroLevel = 100;
            soundManager.playBoost();
          }
        }
      }
    });

    if (foundProject !== this.currentActiveProject) {
      this.currentActiveProject = foundProject;
      this.callbacks.onProjectTrigger(foundProject);
      if (foundProject) soundManager.playZoneChime();
    }

    if (contactHit !== this.isContactActive) {
      this.isContactActive = contactHit;
      this.callbacks.onContactTrigger(contactHit);
      if (contactHit) soundManager.playZoneChime();
    }

    if (aboutHit !== this.isAboutActive) {
      this.isAboutActive = aboutHit;
      this.callbacks.onAboutTrigger(aboutHit);
      if (aboutHit) soundManager.playZoneChime();
    }

    if (resumeHit !== this.isResumeActive) {
      this.isResumeActive = resumeHit;
      this.callbacks.onResumeTrigger(resumeHit);
      if (resumeHit) soundManager.playZoneChime();
    }

    if (easterEggHit !== this.isEasterEggActive) {
      this.isEasterEggActive = easterEggHit;
      this.callbacks.onEasterEggTrigger(easterEggHit);
      if (easterEggHit) soundManager.playZoneChime();
    }
  }

  public teleportToZone(zoneId: string) {
    const target = TELEPORT_TARGETS.find((t) => t.id === zoneId);
    if (target) {
      this.vehicleController.teleport(target.position[0], target.position[1], target.position[2], target.rotationY);
      soundManager.playClick();
    }
  }

  public setCarColor(hex: number) {
    this.vehicleController.setColor(hex);
  }

  public resetVehicle() {
    this.vehicleController.reset();
  }

  public resetCrates() {
    this.worldBuilder.resetSkillCrates();
  }

  private calculateFov(aspect: number): number {
    if (aspect < 1.2) {
      // Dynamic vertical FOV expansion for portrait & narrow mobile screens
      return Math.min(85, Math.max(60, 60 / (aspect * 0.85)));
    }
    return 60;
  }

  private onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    this.camera.aspect = aspect;
    this.camera.fov = this.calculateFov(aspect);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.onWindowResize.bind(this));
    }
    this.renderer.dispose();
  }
}
