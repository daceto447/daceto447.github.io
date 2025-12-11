import * as T from "../three/build/three.module.js";

let tl = new T.TextureLoader();
let t_door2 = tl.load("../textures/door2.jpg");

const default_material = new T.MeshStandardMaterial({
    color: 0x555555,
    side: T.DoubleSide
});

export function make_door1(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        5, 0, 0,
        5, 10, 0,
        5, 10, 0,
        0, 10, 0,
        0, 0, 0,
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0, 0.6,
        0.175, 0.6,
        0.175, 1,
        0.175, 1,
        0, 1,
        0, 0.6
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: T.DoubleSide,
        map: t_door2
    })

    return new T.Mesh(geometry, material);
}

export function make_closet1_leftdoor(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0,
        3, 0, 0,
        3, 8, 0,
        3, 8, 0,
        0, 8, 0,
        0, 0, 0,
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0.69, 0.002,
        0.84, 0.002,
        0.84, 0.61,
        0.84, 0.61,
        0.69, 0.61,
        0.69, 0.002,
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: T.DoubleSide,
        map: t_door2
    })

    return new T.Mesh(geometry, material);
}

export function make_closet1_rightdoor(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0,
        3, 0, 0,
        3, 8, 0,
        3, 8, 0,
        0, 8, 0,
        0, 0, 0,
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0.84, 0.002,
        0.995, 0.002,
        0.995, 0.61,
        0.995, 0.61,
        0.84, 0.61,
        0.84, 0.002,
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: T.DoubleSide,
        map: t_door2
    })

    return new T.Mesh(geometry, material);
}