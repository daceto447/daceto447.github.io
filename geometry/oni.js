import * as T from "../three/build/three.module.js";

let tl = new T.TextureLoader();
let tl_head = tl.load("../textures/oni_face.jpg");
let tl_body = tl.load("../textures/oni_body.png");

const default_material = new T.MeshStandardMaterial({
    color: "#592184"
});

export function make_oni(prototype_mode) {
    const oni = new T.Object3D();
    
    let body_material;
    let head_material;
    if (prototype_mode) {
        body_material = default_material; 
        head_material = default_material;
    } else {
        body_material = new T.MeshStandardMaterial({
            color: 0x443344,
            map: tl_body
        });
        head_material = new T.MeshStandardMaterial({
            color: 0x443344,
            map: tl_head
        });
    }

    const leg_geometry = new T.CapsuleGeometry(0.45, 2);
    const leg_r = new T.Object3D(); // pivot point for leg
    oni.add(leg_r);
    leg_r.name = "leg_r";
    leg_r.position.set(-0.5, 2, 0);
    const leg_r_mesh = new T.Mesh(leg_geometry, body_material);
    leg_r.add(leg_r_mesh);
    leg_r_mesh.position.y = -1;
    const leg_l = new T.Object3D(); // pivot point for leg
    oni.add(leg_l);
    leg_l.name = "leg_l";
    leg_l.position.set(0.5, 2, 0);
    const leg_l_mesh = new T.Mesh(leg_geometry, body_material);
    leg_l.add(leg_l_mesh);
    leg_l_mesh.position.y = -1;
    const torso = new T.Mesh(new T.CapsuleGeometry(1, 0.5), body_material);
    oni.add(torso);
    torso.name = "torso";
    torso.position.y = 2.8;
    const arm_geometry = new T.CapsuleGeometry(0.3, 1.3);
    const arm_r = new T.Object3D(); // pivot point for arm
    oni.add(arm_r);
    arm_r.name = "arm_r";
    arm_r.position.set(-0.7, 3.5, 0);
    arm_r.rotateZ(-Math.PI/6);
    const arm_r_mesh = new T.Mesh(arm_geometry, body_material);
    arm_r.add(arm_r_mesh);
    arm_r_mesh.position.set(0, -0.7, 0);
    const arm_l = new T.Object3D(); // pivot point for arm
    oni.add(arm_l);
    arm_l.name = "arm_l";
    arm_l.position.set(0.7, 3.5, 0);
    arm_l.rotateZ(Math.PI/6);
    const arm_l_mesh = new T.Mesh(arm_geometry, body_material);
    arm_l.add(arm_l_mesh);
    arm_l_mesh.position.set(0, -0.7, 0);
    const head = new T.Mesh(new T.CapsuleGeometry(0.8, 0.8), head_material);
    oni.add(head);
    head.position.y = 4.5;
    head.rotateY(-1.5);

    return oni;
}