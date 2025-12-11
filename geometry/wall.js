import * as T from "../three/build/three.module.js";

let tl = new T.TextureLoader();
let t_wall1 = tl.load("../textures/wall1.jpg");
let t_wall2 = tl.load("../textures/wall2.jpg");
let t_wall3 = tl.load("../textures/wall3.jpg");
let t_wall4 = tl.load("../textures/wall4.jpg");
let t_wall5 = tl.load("../textures/wall5.jpg");

const default_material = new T.MeshStandardMaterial({
    color: 0xAAAAAA,
    side: T.DoubleSide
});

export function make_wall1(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        20, 0, 0,
        20, 10, 0,
        20, 10, 0,
        0, 10, 0,
        0, 0, 0,

        20, 0, 0, 
        40, 0, 0,
        40 ,10, 0,
        40, 10, 0,
        20, 10, 0,
        20, 0, 0
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0, 0.55,
        0.9, 0.55,
        0.9, 1,
        0.9, 1,
        0, 1,
        0, 0.55,

        0, 0.09,
        0.9, 0.09,
        0.9, 0.52,
        0.9, 0.52,
        0, 0.52,
        0, 0.09
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: t_wall1,
        side: T.DoubleSide
    })

    return new T.Mesh(geometry, material);
}

export function make_wall2(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        10, 0, 0,
        10, 10, 0,
        10, 10, 0,
        0, 10, 0,
        0, 0, 0,
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0.05, 0.35,
        0.8, 0.35,
        0.8, 1,
        0.8, 1,
        0.05, 1,
        0.05, 0.35
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: t_wall2
    })

    return new T.Mesh(geometry, material);
}

export function make_wall3(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        15, 0, 0,
        15, 10, 0,
        15, 10, 0,
        0, 10, 0,
        0, 0, 0,
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0.4, 0.4,
        0.94, 0.4,
        0.94, 1,
        0.94, 1,
        0.4, 1,
        0.4, 0.4
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }
    
    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: T.DoubleSide,
        map: t_wall3
    })

    return new T.Mesh(geometry, material);
}

export function make_wall4(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        10, 0, 0,
        10, 10, 0,
        10, 10, 0,
        0, 10, 0,
        0, 0, 0,
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        1, 1,
        0, 1,
        0, 0
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: T.DoubleSide,
        map: t_wall4
    })

    return new T.Mesh(geometry, material);
}

export function make_wall5(prototype_mode) {
    const geometry = new T.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 0, 
        20, 0, 0,
        20, 10, 0,
        20, 10, 0,
        0, 10, 0,
        0, 0, 0,
    ]);

    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));

    const uvs = new Float32Array([
        0.1, 0.1,
        0.98, 0.1,
        0.98, 0.5,
        0.98, 0.5,
        0.1, 0.5,
        0.1, 0.1
    ]);

    geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    if (prototype_mode) {
        return new T.Mesh(geometry, default_material);
    }

    const material = new T.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: T.DoubleSide,
        map: t_wall5
    })

    return new T.Mesh(geometry, material);
}