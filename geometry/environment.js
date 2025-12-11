import * as T from "../three/build/three.module.js";

let tl = new T.TextureLoader();
let tl_grass = tl.load("../textures/grass.jpg");

const grass_default_material = new T.MeshStandardMaterial({ color: "#075c06" });
const key_default_material = new T.MeshStandardMaterial({ 
    color: "#f5cd77",
    roughness: 0.2,
    metalness: 0.8
});

export function make_grass(prototype_mode) {
    const geometry = new T.PlaneGeometry(1, 1);
    let material;
    material = prototype_mode ? 
        grass_default_material : 
        new T.MeshStandardMaterial({
            color: 0xFFFFFF,
            map: tl_grass
        }); 
    const mesh = new T.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI/2;
    return mesh;
}

export function make_key(prototype_mode) {
    const key = new T.Object3D();
    const key1 = new T.Mesh(
        new T.TorusGeometry(0.1, 0.05),
        key_default_material
    );
    key.add(key1);
    const key2 = new T.Mesh(
        new T.CylinderGeometry(0.05, 0.05, 0.3),
        key_default_material
    );
    key.add(key2);
    key2.position.x = 0.25;
    key2.rotateZ(Math.PI/2);
    const tooth_geometry = new T.CylinderGeometry(0.03, 0.03, 0.1);
    const key3 = new T.Mesh(
        tooth_geometry,
        key_default_material
    );
    key.add(key3);
    key3.position.set(0.25, -0.05, 0);
    const key4 = new T.Mesh(
        tooth_geometry,
        key_default_material
    );
    key.add(key4);
    key4.position.set(0.35, -0.08, 0);
    return key;
}