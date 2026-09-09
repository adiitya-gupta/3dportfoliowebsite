import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PhysicsWorld, COLLISION_GROUPS } from './PhysicsWorld';
import type { VehicleControls } from '../types';
import { soundManager } from '../utils/sound';

export class VehicleController {
  public mesh: THREE.Group;
  public chassisBody: CANNON.Body;
  private wheels: THREE.Group[] = [];
  private bodyMaterial: THREE.MeshStandardMaterial;
  private headlightLights: THREE.SpotLight[] = [];

  // Speed & Movement Parameters
  private currentSpeed = 0; // m/s
  private maxSpeed = 36; // ~130 km/h
  private nitroMaxSpeed = 55; // ~200 km/h
  private reverseMaxSpeed = -14; // ~50 km/h
  private accelerationRate = 28; // Rapid snappy acceleration
  private decelerationRate = 20; // Friction coasting
  private brakeRate = 50; // Braking
  private currentYaw = 0; // Orientation angle
  private turnSpeed = 2.5; // Steering sensitivity
  private currentSteer = 0;

  public nitroLevel = 100;
  public isBoosting = false;

  // Airborne & Ramp State Machine
  public isAirborne = false;
  public isOnRamp = false;
  public hasLaunched = false;
  private airborneTimer = 0;

  // Particle Effects
  private smokeParticles: THREE.Mesh[] = [];
  private particleGroup: THREE.Group;

  constructor(scene: THREE.Scene, physicsWorld: PhysicsWorld, initialPos: [number, number, number] = [0, 0.5, 5]) {
    this.mesh = new THREE.Group();
    this.particleGroup = new THREE.Group();
    scene.add(this.particleGroup);

    // 1. Create Full Physical Vehicle Compound Box Shape (Width 2.16m, Height 0.84m, Length 4.44m)
    // Matches the visual mesh bounds 1:1 so bumper, fenders, and roof collide with strict 0mm penetration
    const mainShellShape = new CANNON.Box(new CANNON.Vec3(1.08, 0.42, 2.22));
    const cabinRoofShape = new CANNON.Box(new CANNON.Vec3(0.84, 0.3, 1.14));

    this.chassisBody = new CANNON.Body({
      mass: 450,
      material: physicsWorld.carMaterial,
      position: new CANNON.Vec3(initialPos[0], 0.5, initialPos[2]),
      linearDamping: 0.15,
      angularDamping: 0.95,
      collisionFilterGroup: COLLISION_GROUPS.CAR,
      collisionFilterMask: COLLISION_GROUPS.GROUND | COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.DYNAMIC | COLLISION_GROUPS.TRIGGERS
    });

    this.chassisBody.addShape(mainShellShape, new CANNON.Vec3(0, 0.5, 0));
    this.chassisBody.addShape(cabinRoofShape, new CANNON.Vec3(0, 1.0, -0.15));

    // Lock X & Z rotation axes on ground to prevent random flipping while allowing Y steering yaw
    this.chassisBody.angularFactor.set(0, 1, 0);
    this.chassisBody.allowSleep = false;

    physicsWorld.world.addBody(this.chassisBody);

    // 2. Visual Material
    this.bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f3ff, // Neon Cyan default
      roughness: 0.15,
      metalness: 0.85,
      envMapIntensity: 1.2
    });

    this.createCarVisuals();
    this.mesh.scale.set(1.2, 1.2, 1.2); // Scaled car size for realistic presence
    scene.add(this.mesh);

    // Collision sound, camera impact, & physical impulse listener
    this.chassisBody.addEventListener('collide', (e: { body: CANNON.Body; contact: { getImpactVelocityAlongNormal: () => number } }) => {
      const impact = Math.abs(e.contact.getImpactVelocityAlongNormal());
      if (impact > 1.5) {
        soundManager.playCrash(impact / 12);
        // Instantly reduce car speed on solid collision impact so it doesn't continuously grind
        if (!e.body || e.body.mass === 0) {
          this.currentSpeed *= 0.15;
        }
      }
      // Push dynamic objects (crates, beach balls, bowling pins) when hit - tumble & fall naturally without skyward launch
      if (e.body && e.body.mass > 0) {
        const pushDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion);
        const speed = Math.abs(this.currentSpeed);
        const impulseMag = Math.min(Math.max(6, speed * 5), 25);
        const impulseForce = pushDir.multiplyScalar(impulseMag);
        
        // Realistic momentum transfer: ground-aligned impulse with slight off-center contact point to induce natural fall/tumble
        const contactOffset = new CANNON.Vec3(
          e.body.position.x,
          e.body.position.y + 0.35,
          e.body.position.z
        );
        e.body.applyImpulse(
          new CANNON.Vec3(impulseForce.x, 0.4, impulseForce.z),
          contactOffset
        );
      }
    });
  }

  private createCarVisuals() {
    const bodyGroup = new THREE.Group();

    // 1. Main Lower Body Shell
    const baseGeo = new THREE.BoxGeometry(1.8, 0.45, 3.8);
    const baseMesh = new THREE.Mesh(baseGeo, this.bodyMaterial);
    baseMesh.position.y = 0.4;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    bodyGroup.add(baseMesh);

    // 2. Cabin / Glass Windshield
    const cabinGeo = new THREE.BoxGeometry(1.4, 0.5, 2.0);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.1, metalness: 0.95 });
    const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
    cabinMesh.position.set(0, 0.82, -0.15);
    cabinMesh.castShadow = true;
    bodyGroup.add(cabinMesh);

    // Cabin Roof Accent
    const roofGeo = new THREE.BoxGeometry(1.35, 0.08, 1.9);
    const roofMesh = new THREE.Mesh(roofGeo, this.bodyMaterial);
    roofMesh.position.set(0, 1.08, -0.15);
    bodyGroup.add(roofMesh);

    // 3. Front Hood & Bumper
    const hoodGeo = new THREE.BoxGeometry(1.75, 0.12, 1.2);
    const hoodMesh = new THREE.Mesh(hoodGeo, this.bodyMaterial);
    hoodMesh.position.set(0, 0.58, 1.1);
    bodyGroup.add(hoodMesh);

    const bumperGeo = new THREE.BoxGeometry(1.82, 0.22, 0.3);
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5 });
    const bumperMesh = new THREE.Mesh(bumperGeo, darkMat);
    bumperMesh.position.set(0, 0.28, 1.85);
    bodyGroup.add(bumperMesh);

    // 4. Rear Spoiler Wing
    const wingPostGeo = new THREE.BoxGeometry(0.1, 0.35, 0.2);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8 });
    [-0.5, 0.5].forEach((xPos) => {
      const post = new THREE.Mesh(wingPostGeo, wingMat);
      post.position.set(xPos, 0.75, -1.7);
      bodyGroup.add(post);
    });

    const wingBladeGeo = new THREE.BoxGeometry(1.7, 0.06, 0.4);
    const wingBlade = new THREE.Mesh(wingBladeGeo, this.bodyMaterial);
    wingBlade.position.set(0, 0.95, -1.7);
    wingBlade.castShadow = true;
    bodyGroup.add(wingBlade);

    // 5. Wheel Fenders / Wheel Arches
    const fenderGeo = new THREE.BoxGeometry(0.2, 0.45, 0.9);
    const fenderOffsets: [number, number, number][] = [
      [0.92, 0.4, 1.15],   // FL
      [-0.92, 0.4, 1.15],  // FR
      [0.92, 0.4, -1.15],  // RL
      [-0.92, 0.4, -1.15]   // RR
    ];
    fenderOffsets.forEach(([fx, fy, fz]) => {
      const fender = new THREE.Mesh(fenderGeo, darkMat);
      fender.position.set(fx, fy, fz);
      bodyGroup.add(fender);
    });

    // 6. Headlights (Spotlights)
    const lightGeo = new THREE.BoxGeometry(0.35, 0.12, 0.08);
    const neonWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    [-0.6, 0.6].forEach((xPos) => {
      const headlightMesh = new THREE.Mesh(lightGeo, neonWhiteMat);
      headlightMesh.position.set(xPos, 0.42, 1.91);
      bodyGroup.add(headlightMesh);

      const spotLight = new THREE.SpotLight(0xffffff, 25);
      spotLight.position.set(xPos, 0.42, 1.95);
      spotLight.angle = Math.PI / 5;
      spotLight.penumbra = 0.3;
      spotLight.distance = 35;
      spotLight.castShadow = true;

      const targetObject = new THREE.Object3D();
      targetObject.position.set(xPos, 0, 12);
      bodyGroup.add(targetObject);
      spotLight.target = targetObject;

      bodyGroup.add(spotLight);
      this.headlightLights.push(spotLight);
    });

    // Tail Lights
    const tailLightGeo = new THREE.BoxGeometry(0.5, 0.1, 0.08);
    const redNeonMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    [-0.55, 0.55].forEach((xPos) => {
      const tailMesh = new THREE.Mesh(tailLightGeo, redNeonMat);
      tailMesh.position.set(xPos, 0.45, -1.91);
      bodyGroup.add(tailMesh);
    });

    // Neon Underglow
    const underglowGeo = new THREE.PlaneGeometry(1.6, 3.4);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const underglowMesh = new THREE.Mesh(underglowGeo, underglowMat);
    underglowMesh.rotation.x = Math.PI / 2;
    underglowMesh.position.y = 0.08;
    bodyGroup.add(underglowMesh);

    this.mesh.add(bodyGroup);

    // 7. 4 Visual Wheels
    const tireRadius = 0.38;
    const tireWidth = 0.28;
    const wheelGeo = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 24);
    wheelGeo.rotateZ(Math.PI / 2);

    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });

    const wheelOffsets: [number, number, number][] = [
      [0.85, 0.38, 1.15],   // Front Left
      [-0.85, 0.38, 1.15],  // Front Right
      [0.85, 0.38, -1.15],  // Back Left
      [-0.85, 0.38, -1.15]   // Back Right
    ];

    wheelOffsets.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      const tireMesh = new THREE.Mesh(wheelGeo, wheelMat);
      tireMesh.castShadow = true;
      wheelGroup.add(tireMesh);

      const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, tireWidth + 0.02, 12);
      rimGeo.rotateZ(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      wheelGroup.add(rimMesh);

      this.mesh.add(wheelGroup);
      this.wheels.push(wheelGroup);
    });
  }

  public triggerRampLaunch(direction: THREE.Vector3, forwardForce: number = 38, upwardForce: number = 22) {
    if (this.hasLaunched) return;

    this.isAirborne = true;
    this.hasLaunched = true;
    this.isOnRamp = false;
    this.airborneTimer = 0;

    // Calculate launch velocity vector dynamically from ramp direction + upward velocity
    const launchVec = direction.clone().normalize().multiplyScalar(forwardForce);
    launchVec.y = upwardForce;

    this.chassisBody.velocity.set(launchVec.x, launchVec.y, launchVec.z);
    this.currentSpeed = forwardForce;
    soundManager.playBoost();
  }

  public update(deltaTime: number, controls: VehicleControls) {
    const clampedDelta = Math.min(deltaTime, 0.05);

    // 1. Nitro Boost
    this.isBoosting = controls.boost && this.nitroLevel > 0;
    const targetTopSpeed = this.isBoosting ? this.nitroMaxSpeed : this.maxSpeed;

    if (this.isBoosting) {
      this.nitroLevel = Math.max(0, this.nitroLevel - clampedDelta * 40);
      soundManager.playBoost();
      this.spawnSmokeParticle(true);
    } else if (!controls.boost && this.nitroLevel < 100) {
      this.nitroLevel = Math.min(100, this.nitroLevel + clampedDelta * 18);
    }

    // 2. Speed Control Integration
    if (controls.forward) {
      this.currentSpeed += this.accelerationRate * (this.isBoosting ? 1.8 : 1.0) * clampedDelta;
      if (this.currentSpeed > targetTopSpeed) {
        this.currentSpeed = targetTopSpeed;
      }
    } else if (controls.backward) {
      this.currentSpeed -= this.accelerationRate * clampedDelta;
      if (this.currentSpeed < this.reverseMaxSpeed) {
        this.currentSpeed = this.reverseMaxSpeed;
      }
    } else {
      // Natural Coasting Deceleration
      if (this.currentSpeed > 0) {
        this.currentSpeed = Math.max(0, this.currentSpeed - this.decelerationRate * clampedDelta);
      } else if (this.currentSpeed < 0) {
        this.currentSpeed = Math.min(0, this.currentSpeed + this.decelerationRate * clampedDelta);
      }
    }

    if (controls.brake) {
      // Handbrake
      if (this.currentSpeed > 0) {
        this.currentSpeed = Math.max(0, this.currentSpeed - this.brakeRate * clampedDelta);
      } else if (this.currentSpeed < 0) {
        this.currentSpeed = Math.min(0, this.currentSpeed + this.brakeRate * clampedDelta);
      }
    }

    // 3. Steering & Orientation Integration
    let targetSteer = 0;
    if (controls.left) targetSteer = 1;
    else if (controls.right) targetSteer = -1;

    this.currentSteer = THREE.MathUtils.lerp(this.currentSteer, targetSteer, 0.25);

    if (Math.abs(this.currentSteer) > 0.01) {
      const turnDirection = this.currentSpeed >= -0.5 ? 1 : -1;
      const speedFactor = Math.min(1.0, Math.abs(this.currentSpeed) / 3.0);
      this.currentYaw += this.currentSteer * this.turnSpeed * turnDirection * (speedFactor > 0.1 ? speedFactor : 0.4) * clampedDelta;
    }

    const quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.currentYaw);
    const forwardVector = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);

    // 4. AIRBORNE TRAJECTORY & LANDING STATE MACHINE
    // 4. AIRBORNE TRAJECTORY & LANDING STATE MACHINE
    if (this.isAirborne) {
      this.airborneTimer += clampedDelta;

      const currentVy = this.chassisBody.velocity.y;
      this.chassisBody.velocity.set(
        forwardVector.x * this.currentSpeed,
        currentVy, // Gravity operates on Vy naturally!
        forwardVector.z * this.currentSpeed
      );

      // Pitch visual angle dynamically (pitch up on ascent, level off on descent)
      const pitchAngle = THREE.MathUtils.clamp(currentVy * 0.015, -0.25, 0.35);
      const airborneQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(pitchAngle, this.currentYaw, 0, 'YXZ')
      );

      this.mesh.position.copy(this.chassisBody.position as unknown as THREE.Vector3);
      this.mesh.quaternion.copy(airborneQuat);

      // Landing detection after minimum flight time
      if (this.airborneTimer > 0.25 && this.chassisBody.position.y <= 0.55 && currentVy <= 0) {
        this.chassisBody.position.y = 0.5;
        this.chassisBody.velocity.y = 0;
        this.isAirborne = false;
        this.hasLaunched = false;
        this.isOnRamp = false;
        soundManager.playCrash(0.4); // Subtle landing impact
      }

      // Wheel Animations during airborne flight
      const wheelRollDelta = this.currentSpeed * clampedDelta * 3.5;
      this.wheels.forEach((wheelGroup, idx) => {
        const tireMesh = wheelGroup.children[0];
        if (tireMesh) tireMesh.rotation.x += wheelRollDelta;
        if (idx === 0 || idx === 1) wheelGroup.rotation.y = this.currentSteer * 0.45;
      });

      return;
    }

    // 5. NORMAL GROUND MOVEMENT INTEGRATION (STRICT CANNON PHYSICS VELOCITY MOVEMENT)
    const posX = this.chassisBody.position.x;
    const posZ = this.chassisBody.position.z;

    // Dynamic vehicle body pitch & roll suspension physics (accel pitch, brake dive, cornering roll)
    let dynamicPitch = 0;
    let dynamicRoll = 0;
    if (controls.forward) dynamicPitch = -0.04; // Rear squat on acceleration
    else if (controls.backward || controls.brake) dynamicPitch = 0.06; // Front dive on braking

    if (Math.abs(this.currentSteer) > 0.05) {
      dynamicRoll = -0.07 * this.currentSteer * (Math.abs(this.currentSpeed) / this.maxSpeed);
    }

    // Check if car is on the Stunt Speed Ramp incline in Playground Sector (x: [-6.5, 6.5], z: [-222, -198])
    const isOverRampX = Math.abs(posX) <= 6.5;
    const isOverRampZ = posZ <= -198 && posZ >= -222;

    if (isOverRampX && isOverRampZ) {
      this.isOnRamp = true;
      
      // Calculate ramp incline progress (ramp starts at z = -200 and slopes up to z = -220)
      const blendProgress = THREE.MathUtils.clamp((-198 - posZ) / 2.0, 0, 1);
      const rampProgress = THREE.MathUtils.clamp((-200 - posZ) / 18.0, 0, 1);
      const rampSurfaceY = rampProgress * 4.5;

      const targetChassisY = rampSurfaceY + 0.62 * blendProgress + 0.5 * (1 - blendProgress);

      this.chassisBody.position.y = targetChassisY;
      if (this.chassisBody.velocity.y < 0) this.chassisBody.velocity.y = 0;

      this.chassisBody.velocity.x = forwardVector.x * this.currentSpeed;
      this.chassisBody.velocity.z = forwardVector.z * this.currentSpeed;

      const rampPitchAngle = -0.2287 * blendProgress + dynamicPitch;
      const rampOrientQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(rampPitchAngle, this.currentYaw, dynamicRoll, 'YXZ')
      );

      this.mesh.position.copy(this.chassisBody.position as unknown as THREE.Vector3);
      this.mesh.quaternion.copy(rampOrientQuat);

      // Takeoff threshold at high lip (z <= -218)
      if (posZ <= -218 && this.currentSpeed > 4 && !this.hasLaunched) {
        this.triggerRampLaunch(forwardVector, 42, 24);
      }
    } else if (!this.isAirborne) {
      this.isOnRamp = false;

      // Lock ground chassis position to y = 0.5 and force zero vertical velocity when on ground
      this.chassisBody.position.y = 0.5;
      this.chassisBody.velocity.y = 0;

      // DRIVE X & Z STRICTLY VIA VELOCITY
      this.chassisBody.velocity.set(
        forwardVector.x * this.currentSpeed,
        0,
        forwardVector.z * this.currentSpeed
      );

      // Ground orientation with dynamic body pitch and lean roll
      const groundQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(dynamicPitch, this.currentYaw, dynamicRoll, 'YXZ')
      );

      this.chassisBody.quaternion.copy(quat as unknown as CANNON.Quaternion);

      // Sync Visual Mesh Position & Orientation
      this.mesh.position.copy(this.chassisBody.position as unknown as THREE.Vector3);
      this.mesh.quaternion.copy(groundQuat);
    }

    // 6. Visual Wheel Animations (Rolling & Steering)
    const wheelRollDelta = this.currentSpeed * clampedDelta * 3.5;
    this.wheels.forEach((wheelGroup, idx) => {
      const tireMesh = wheelGroup.children[0];
      if (tireMesh) {
        tireMesh.rotation.x += wheelRollDelta;
      }
      if (idx === 0 || idx === 1) {
        wheelGroup.rotation.y = this.currentSteer * 0.45;
      }
    });

    // 7. Sound & Smoke Particles
    const speedKmh = this.getSpeedKmh();
    soundManager.updateEngine(speedKmh, controls.forward || controls.backward);

    if ((controls.forward || controls.backward || speedKmh > 10) && Math.random() < 0.35) {
      this.spawnSmokeParticle(false);
    }
    this.updateSmokeParticles(clampedDelta);
  }

  private spawnSmokeParticle(isNitro: boolean) {
    if (isNitro) {
      // Spawn dual glowing cyan nitro flames from exhaust pipes
      [-0.45, 0.45].forEach((xOffset) => {
        const flameGeo = new THREE.ConeGeometry(0.2, 0.8, 8);
        flameGeo.rotateX(-Math.PI / 2);
        const flameMat = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0x00f3ff : 0x38bdf8,
          transparent: true,
          opacity: 0.9
        });
        const flameMesh = new THREE.Mesh(flameGeo, flameMat);
        const carPos = this.mesh.position;
        const pipePos = new THREE.Vector3(xOffset, 0.3, -1.95).applyQuaternion(this.mesh.quaternion);
        flameMesh.position.copy(carPos).add(pipePos);

        this.particleGroup.add(flameMesh);
        this.smokeParticles.push(flameMesh);
      });
    } else {
      const geo = new THREE.SphereGeometry(0.15, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.4
      });
      const mesh = new THREE.Mesh(geo, mat);
      const carPos = this.mesh.position;
      const backwardVector = new THREE.Vector3(0, 0.3, -1.9).applyQuaternion(this.mesh.quaternion);
      mesh.position.copy(carPos).add(backwardVector);

      this.particleGroup.add(mesh);
      this.smokeParticles.push(mesh);
    }

    if (this.smokeParticles.length > 40) {
      const old = this.smokeParticles.shift();
      if (old) this.particleGroup.remove(old);
    }
  }

  private updateSmokeParticles(deltaTime: number) {
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.position.y += deltaTime * 0.8;
      p.scale.multiplyScalar(1.03);
      const mat = p.material as THREE.MeshBasicMaterial;
      mat.opacity -= deltaTime * 1.4;

      if (mat.opacity <= 0) {
        this.particleGroup.remove(p);
        this.smokeParticles.splice(i, 1);
      }
    }
  }

  public getSpeedKmh(): number {
    return Math.round(Math.abs(this.currentSpeed) * 3.6);
  }

  public teleport(x: number, y: number, z: number, rotationY: number = 0) {
    this.currentSpeed = 0;
    this.currentYaw = rotationY;
    this.isAirborne = false;
    this.hasLaunched = false;

    const posY = y > 0 ? y : 0.5;
    this.chassisBody.position.set(x, posY, z);
    this.chassisBody.velocity.set(0, 0, 0);
    this.chassisBody.angularVelocity.set(0, 0, 0);

    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    this.chassisBody.quaternion.copy(q as unknown as CANNON.Quaternion);
    this.mesh.position.set(x, posY, z);
    this.mesh.quaternion.copy(q);
  }

  public reset() {
    const pos = this.chassisBody.position;
    this.teleport(pos.x, 0.5, pos.z, this.currentYaw);
  }

  public setColor(hex: number) {
    this.bodyMaterial.color.setHex(hex);
  }
}
