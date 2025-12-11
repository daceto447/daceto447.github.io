import * as T from "../three/build/three.module.js";

let tl = new T.TextureLoader();
let t_floor1 = tl.load("../textures/floor1.jpg");
let t_floor3_4 = tl.load("../textures/floor3_4.jpg");

const default_material = new T.MeshStandardMaterial({
    color: 0x333333,
    side: T.DoubleSide
});

export function make_floor1(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        18, 0, 0,
        18, 0, -5,
        18, 0, -5,
        0, 0, -5,
        0, 0, 0
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0, 0.68,
        0.93, 0.68,
        0.93, 1,
        0.93, 1,
        0, 1,
        0, 0.68,
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: t_floor1
    });

    return new T.Mesh(geometry, material);
}

export function make_floor3(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        10, 0, 0,
        10, 0, -5,
        10, 0, -5,
        0, 0, -5,
        0, 0, 0
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0, 1,
        0, 0.1,
        0.5, 0.1,
        0.5, 0.1,
        0.5, 1,
        0, 1
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }
    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: t_floor3_4
    })

    return new T.Mesh(geometry, material);
}

export function make_floor4(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        6, 0, 0,
        6, 0, -4,
        6, 0, -4,
        0, 0, -4,
        0, 0, 0
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0.63, 1,
        0.63, 0.53,
        0.935, 0.53,
        0.935, 0.53,
        0.935, 1,
        0.63, 1
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: t_floor3_4
    })

    return new T.Mesh(geometry, material);
}