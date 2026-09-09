import * as CANNON from 'cannon-es';

export const COLLISION_GROUPS = {
  CAR: 1 << 0,         // 1
  GROUND: 1 << 1,      // 2
  ENVIRONMENT: 1 << 2, // 4 (Buildings, Trees, Streetlamps, Walls, Barriers)
  DYNAMIC: 1 << 3,     // 8 (Crates)
  TRIGGERS: 1 << 4,    // 16 (Zone Sensors)
  PROPS: 1 << 5        // 32 (Bowling Pins, Roadside Cones)
};

export class PhysicsWorld {
  public world: CANNON.World;
  public defaultMaterial: CANNON.Material;
  public carMaterial: CANNON.Material;
  public environmentMaterial: CANNON.Material;
  public crateMaterial: CANNON.Material;
  public propMaterial: CANNON.Material;

  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -18, 0); // Enhanced gravity for snappy arcade vehicle physics
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    (this.world.solver as CANNON.GSSolver).iterations = 15;

    // Materials
    this.defaultMaterial = new CANNON.Material('default');
    this.carMaterial = new CANNON.Material('car');
    this.environmentMaterial = new CANNON.Material('environment');
    this.crateMaterial = new CANNON.Material('crate');
    this.propMaterial = new CANNON.Material('prop');

    // Contact rules: Car vs Environment (Buildings, Trees, Walls, Streetlamps)
    const carEnvContact = new CANNON.ContactMaterial(
      this.carMaterial,
      this.environmentMaterial,
      {
        friction: 0.6,
        restitution: 0.1,
        contactEquationStiffness: 1e9,
        contactEquationRelaxation: 2
      }
    );
    this.world.addContactMaterial(carEnvContact);

    // Contact rules: Car vs Ground
    const carGroundContact = new CANNON.ContactMaterial(
      this.carMaterial,
      this.defaultMaterial,
      {
        friction: 0.5,
        restitution: 0.05,
        contactEquationStiffness: 1e9,
        contactEquationRelaxation: 2
      }
    );
    this.world.addContactMaterial(carGroundContact);

    // Contact rules: Car vs Dynamic Crates
    const carCrateContact = new CANNON.ContactMaterial(
      this.carMaterial,
      this.crateMaterial,
      {
        friction: 0.1,
        restitution: 0.0,
        contactEquationStiffness: 1e4,
        contactEquationRelaxation: 10
      }
    );
    this.world.addContactMaterial(carCrateContact);

    // Contact rules: Car vs Small Props / Pins (ultra-low stiffness so props tumble without affecting car Y height)
    const carPropContact = new CANNON.ContactMaterial(
      this.carMaterial,
      this.propMaterial,
      {
        friction: 0.05,
        restitution: 0.0,
        contactEquationStiffness: 1e3,
        contactEquationRelaxation: 20
      }
    );
    this.world.addContactMaterial(carPropContact);

    // Ground Plane Body
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: this.defaultMaterial,
      collisionFilterGroup: COLLISION_GROUPS.GROUND,
      collisionFilterMask: COLLISION_GROUPS.CAR | COLLISION_GROUPS.DYNAMIC
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(groundBody);
  }

  public update(deltaTime: number) {
    // Step simulation with fixed 60Hz timestep & capped delta time
    const clampedDelta = Math.min(deltaTime, 0.05);
    this.world.step(1 / 60, clampedDelta, 5);
  }

  public createBoxBody(
    width: number,
    height: number,
    depth: number,
    mass: number = 0,
    position: [number, number, number] = [0, 0, 0],
    material: CANNON.Material = mass === 0 ? this.environmentMaterial : this.defaultMaterial
  ): CANNON.Body {
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const isStatic = mass === 0;
    const body = new CANNON.Body({
      mass,
      type: isStatic ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC,
      shape,
      material,
      position: new CANNON.Vec3(...position),
      collisionFilterGroup: isStatic ? COLLISION_GROUPS.ENVIRONMENT : COLLISION_GROUPS.DYNAMIC,
      collisionFilterMask: isStatic ? (COLLISION_GROUPS.CAR | COLLISION_GROUPS.DYNAMIC) : (COLLISION_GROUPS.CAR | COLLISION_GROUPS.GROUND | COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.DYNAMIC)
    });
    this.world.addBody(body);
    return body;
  }

  public createSphereBody(
    radius: number,
    mass: number = 1,
    position: [number, number, number] = [0, 0, 0]
  ): CANNON.Body {
    const shape = new CANNON.Sphere(radius);
    const isStatic = mass === 0;
    const body = new CANNON.Body({
      mass,
      type: isStatic ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC,
      shape,
      material: this.crateMaterial,
      position: new CANNON.Vec3(...position),
      linearDamping: 0.1,
      angularDamping: 0.1,
      collisionFilterGroup: isStatic ? COLLISION_GROUPS.ENVIRONMENT : COLLISION_GROUPS.DYNAMIC,
      collisionFilterMask: COLLISION_GROUPS.CAR | COLLISION_GROUPS.GROUND | COLLISION_GROUPS.ENVIRONMENT | COLLISION_GROUPS.DYNAMIC
    });
    this.world.addBody(body);
    return body;
  }

  public createPropBody(
    width: number,
    height: number,
    depth: number,
    mass: number = 0.2,
    position: [number, number, number] = [0, 0, 0]
  ): CANNON.Body {
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const body = new CANNON.Body({
      mass,
      type: CANNON.Body.DYNAMIC,
      shape,
      material: this.propMaterial,
      position: new CANNON.Vec3(...position),
      linearDamping: 0.5,
      angularDamping: 0.6,
      collisionFilterGroup: COLLISION_GROUPS.PROPS,
      collisionFilterMask: COLLISION_GROUPS.CAR | COLLISION_GROUPS.GROUND | COLLISION_GROUPS.PROPS
    });
    this.world.addBody(body);
    return body;
  }

  public removeBody(body: CANNON.Body) {
    this.world.removeBody(body);
  }
}
