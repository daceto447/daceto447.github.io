import * as T from "./three/build/three.module.js";
import { PointerLockControls } from "./three/examples/jsm/controls/PointerLockControls.js";
import { 
    make_wall1,
    make_wall2,
    make_wall3,
    make_wall4,
    make_wall5,
} from "./geometry/wall.js";
import {
    make_floor1,
    make_floor3,
    make_floor4,
} from "./geometry/floor.js";
import {
    make_door1,
    make_closet1_leftdoor,
    make_closet1_rightdoor,
} from "./geometry/door.js";
import {
    make_oni
} from "./geometry/oni.js";
import {
    make_grass,
    make_key
} from "./geometry/environment.js";

const renderer = new T.WebGLRenderer();
const canvas = renderer.domElement;
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("div1").appendChild(canvas);

let prototype_mode = false;

const scene = new T.Scene();
let aspect = window.innerWidth/window.innerHeight;
const camera = new T.PerspectiveCamera(60, aspect, 0.1, 2000);
scene.add(camera);
const camera_height = 5.8;
const oni_height = 0.8;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const player = new T.Mesh(
    new T.BoxGeometry(1, 5, 1),
    new T.MeshStandardMaterial()
);
camera.add(player);
player.visible = false;
const camera_box = new T.Box3().setFromObject(player);

const hud_window = document.getElementById("hud_window");
const hud_text = document.getElementById("hud_text");
const menu = document.getElementById("menu");
const start_button = document.getElementById("start_button");
const menu_button = document.getElementById("menu_button");
const prototype_button = document.getElementById("prototype_button");

const point_light_intensity = 0.2;
const point_light = new T.PointLight(0xffffff, 0, 20, 0.3);
point_light.position.y = 5
camera.add(point_light);

const bgm = new Audio("../audio/bgm.mp3");
const radio = new Audio("../audio/radio.mp3");

class CollisionObject {
    constructor(obj, collision) {
        this.obj = obj;
        this.box = new T.Box3().setFromObject(obj);
        this.collision = collision ? collision : true;
    }
}

let collision_objects = [];

class Door {
    constructor(door, dir, speed) {
        this.mesh = door;
        this.dir = dir ? dir : 1;
        this.openable = true;
        this.speed = speed ? speed : 0.02;
        this.start_time = null;
        this.collision_obj = new CollisionObject(door);
        this.open = false;
    }
}

class ClosetDoor extends Door {
    constructor(door, interior, dir, speed) {
        super(door, dir, speed);
        this.interior = interior;
    }
}

class Key {
    constructor(mesh, door) {
        this.mesh = mesh;
        this.door = door;
        this.collected = false;
        this.box = new T.Box3().setFromObject(this.mesh);
    }
}

let items = [];
let doors = [];
let keys_inv = [];
let keys_down = [];
let bars = [];

class Oni {
    constructor(scale) {
        this.scale = scale ? scale : 1.5;
        this.mesh = make_oni(prototype_mode);
        this.mesh.scale.setScalar(this.scale);
        this.moving = false;
        this.speed = 0.17;
    }

    animate(time) {
        this.mesh.getObjectByName("arm_l").rotation.x = Math.sin(0.009*time);
        this.mesh.getObjectByName("arm_r").rotation.x = -Math.sin(0.009*time);
        this.mesh.getObjectByName("leg_l").rotation.x = Math.sin(0.009*time);
        this.mesh.getObjectByName("leg_r").rotation.x = -Math.sin(0.009*time);
    }

    lookAt_camera() {
        const dir_vector = direction_vector(this.mesh, camera);
        dir_vector.y = 0; 
        this.mesh.rotation.y = Math.atan2(dir_vector.x, dir_vector.z);
        return dir_vector;
    }

    move(time) {
        const dir_vector = this.lookAt_camera();
        // if not moving, just rotate about y axis to look at player, 
        // and set limb rotations to 0
        if (!this.moving) {
            this.animate(0);
        // if moving, animate and move towards player
        } else {
            if (in_closet && event_flag < 3) {
                this.mesh.position.set(0, -10, 0);
                this.moving = false;
            }
            this.animate(time)
            let movement = dir_vector.normalize().multiplyScalar(this.speed);
            this.mesh.position.add(movement);
        }
    }

}

document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase()
    keys_down[key] = true;
    switch(key) {
        case 't': 
            console.log(camera.position);
            break;
        case 'f': 
            if (control) {
                flashlight.visible = !flashlight.visible;
            }
            break;
        case 'e': 
            interact();
            break;
        case 'r':
            radio_on = !radio_on;
            break;
        case 'l':
            debug_mode = !debug_mode;
            break;
    }
});
document.addEventListener("keyup", e => {
    keys_down[e.key.toLowerCase()] = false;
});

let mouseX_delta = 0;
let mouseY_delta = 0;
let cam_phi = 0;
let cam_theta = 0;

let mouse_sens = 0.5;
let isPointerLocked = true;
let debug_mode = false;

document.addEventListener("mousemove", e => {
    mouseX_delta = e.movementX * mouse_sens;
    mouseY_delta = e.movementY * mouse_sens;
  
});

renderer.domElement.addEventListener("click", () => {
    if (running) {
        renderer.domElement.requestPointerLock({ unadjustedMovement: true }); // raw input
    }
});
document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === renderer.domElement;
});


function handle_collision(obj, obj_box, forward, left) {
    const next_box = obj_box.clone().translate(forward).translate(left);
    for (let collision_obj of collision_objects) {
        if (next_box.intersectsBox(collision_obj.box) && collision_obj.collision) {
            obj.position.add(forward.multiplyScalar(-1));
            obj.position.add(left.multiplyScalar(-1));
            break;
        }
    }
}

function direction_vector(obj1, obj2) {
    const dir_vector = new T.Vector3();
    dir_vector.subVectors(obj2.position, obj1.position);
    return dir_vector;
}


function handle_movement(time) {
    let speed = debug_mode ? 0.8 : 0.2;
    speed = keys_down['shift'] ? speed * 1.5 : speed;

    const forward_vel = (keys_down['w'] ? 1 : 0) + (keys_down['s'] ? -1 : 0);
    const strafe_vel = (keys_down['a'] ? 1 : 0) + (keys_down['d'] ? -1 : 0);
    const fly_vel = (keys_down[' '] ? 1 : 0) + (keys_down['control'] ? -1 : 0);

    const qx = new T.Quaternion();
    qx.setFromAxisAngle(new T.Vector3(0, 1, 0), cam_phi);

    const forward = new T.Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forward_vel * speed);

    const left = new T.Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafe_vel * speed);

    camera.position.add(forward);
    camera.position.add(left);

    if (debug_mode) {
        const up = new T.Vector3(0, 1, 0);
        up.applyQuaternion(qx);
        up.multiplyScalar(fly_vel * speed);
        camera.position.add(up);
    }

    if (!debug_mode) {
        handle_collision(camera, camera_box, forward, left);
    }
}

function animate_door(time, door) {
    door.openable = false;
    if (door.start_time == null) door.start_time = time;
    door.mesh.rotateY(door.speed * door.dir);
    const end_time = 24 / door.speed;
    if (time - door.start_time < end_time) {
        requestAnimationFrame(time => animate_door(time, door));
    } else { 
        door.open = !door.open;
        door.start_time = null;
        door.dir = -door.dir;
        door.openable = true;
        door.collision = true;
        if (door instanceof ClosetDoor && door.open) {
            enter_closet(door);
        }
    }
}

function enter_closet(closet_door) {
    if (running) {
        in_closet = true;
        control = false;
        camera.lookAt(closet_door.mesh);
        camera.position.copy(closet_door.interior.position);
        camera.position.y = camera_height;
        hud_window.style.visibility = "visible";
        hud_text.innerHTML = "Hiding...";
    }
}

function exit_closet() {
    in_closet = false;
    control = true;
    camera.position.z -= 5;
    hud_window.style.visibility = "hidden";
}

function animate_item(time, item) {
    item.position.y += 0.01 * Math.sin(0.003 * time);
    item.rotation.y += 0.015;
    item.rotation.z = 0.1 * Math.sin(0.003 * time);
    if (in_pickup) {
        requestAnimationFrame(time => animate_item(time, item));
    } else {
        item.visible = false; 
        hud_window.style.visibility = "hidden";
    }
}

function collect_key(key) {
    in_pickup = true;
    control = false;
    const mesh = key.mesh;
    mesh.position.copy(camera.position);
    mesh.position.z -= 3;
    mesh.rotation.set(0, 0, 0);
    camera.lookAt(mesh.position);
    requestAnimationFrame(time => animate_item(time, mesh))
    hud_window.style.visibility = "visible";
    hud_text.innerHTML = "Obtained entrance key.";
    key.door.openable = true;
    keys_inv.pop(key);
    event_flag = 3; // whateva
    setup_end()
}

function interact() {
    if (in_closet) {
        exit_closet();
        return;
    }
    if (in_pickup) {
        in_pickup = false;
        control = true;
    }

    let cam_dir = new T.Vector3();
    camera.getWorldDirection(cam_dir);
    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.copy(cam_dir).normalize();

    // check if picking up key
    for (let key of keys_inv) {
        if (raycaster.ray.intersectsBox(key.box)) {
            collect_key(key);
            return;
        }
    }

    // then check doors, open door if touching
    for (let door of doors) {
        if (door.openable) {
            const intersects = raycaster.intersectObject(door.mesh);
            if (intersects.length > 0) {
                let c = door.collision_obj.collision;
                door.collision_obj.collision = !c;
                requestAnimationFrame(time => animate_door(time, door));
                break;
            }
        }
    }
}

function setup_end() {
    for (let bar of bars) {
        bar.visible = false;
    }
    oni1.mesh.position.set(87.5, oni_height, -65);
    oni1.lookAt_camera;
}

const flashlight = new T.SpotLight("#fcf5ba", 0.9, 30, Math.PI/9, 0.8, 0);
camera.add(flashlight);
flashlight.castShadow = true;

camera.add(flashlight.target);
flashlight.target.position.set(0, 0.9, -1);
flashlight.visible = false;

const raycaster = new T.Raycaster();

const map = new T.Object3D();
function make_map() {
    scene.add(map);
    // outside grass
    for (let x of [70, 80, 90, 100]) {
        for (let z of [95, 105, 115, 125]) {
            const grass = make_grass(prototype_mode);
            grass.scale.setScalar(10);
            grass.position.set(x, 0, z);
            map.add(grass);
        }
    }

    // ceiling covering the whole building
    const ceiling = make_wall3(prototype_mode);
    ceiling.scale.setScalar(15);
    ceiling.position.set(100, 9.7, -100);
    ceiling.rotation.set(Math.PI/2, 0, Math.PI/2);
    map.add(ceiling);

    // entrance door
    const door0 = make_door1(prototype_mode);
    door0.position.set(90, 0, 90);
    door0.rotateY(Math.PI);
    map.add(door0);
    const door0_obj = new Door(door0);
    door0_obj.openable = false;
    doors.push(door0_obj);
    collision_objects.push(door0_obj.collision_obj); 

    // hallway 1
    for (let i = 0; i < 11; i++) {
        // dumb bullshit
        let l_wall_z = 90 - i * 15;
        if (i > 8) l_wall_z -= 5;
        let r_wall_z = 75 - i * 15;
        let floor_z = 72 - i * 18;

        const wall_l = make_wall3(prototype_mode);
        wall_l.position.set(85, -0.5, l_wall_z);
        wall_l.rotateY(Math.PI/2);
        map.add(wall_l);
        collision_objects.push(new CollisionObject(wall_l));

        const floor = make_floor1(prototype_mode);
        floor.position.set(85, 0, floor_z);
        floor.rotateY(-Math.PI/2);
        map.add(floor);

        const wall_r = make_wall3(prototype_mode);
        wall_r.position.set(90, -0.5, r_wall_z)
        wall_r.rotateY(-Math.PI/2);
        map.add(wall_r);
        collision_objects.push(new CollisionObject(wall_r));
    }
    // hallway 1 door
    const door1 = make_door1(prototype_mode);
    door1.position.set(85, 0, -45);
    door1.rotateY(Math.PI/2);
    map.add(door1);
    const door1_obj = new Door(door1);
    doors.push(door1_obj);
    collision_objects.push(door1_obj.collision_obj);

    // hallway 1 bars
    for (let i = 0; i < 4; i++) {
        const bar = new T.Mesh(
            new T.CylinderGeometry(0.1, 0.1, 10),
            new T.MeshStandardMaterial({ color: 0x444444, roughness: 0.2 })
        );
        map.add(bar);
        bar.position.set(86 + i, 5, -55);
        collision_objects.push(new CollisionObject(bar));
        bars.push(bar);
    }

    // hallway 2
    for (let i = 0; i < 2; i++) {
        const l_wall_x = 85 - i * 40;
        const r_wall_x = 45 - i * 40;
        const floor_x = 75 - i * 40;

        const wall_l = make_wall1(prototype_mode); 
        wall_l.position.set(l_wall_x, 0, -40);
        wall_l.rotateY(Math.PI);
        map.add(wall_l);
        collision_objects.push(new CollisionObject(wall_l));

        for (let j = 0; j < 4; j++) {
            const floor_offset = j * 10;
            const floor_l = make_floor3(prototype_mode);
            floor_l.position.set(floor_x - floor_offset, 0, -45);
            map.add(floor_l);
            const floor_r = make_floor3(prototype_mode);
            floor_r.position.set(floor_x - floor_offset, 0, -40);
            map.add(floor_r);
        }

        const wall_r = make_wall1(prototype_mode); 
        wall_r.position.set(r_wall_x, 0, -50);
        map.add(wall_r);
        collision_objects.push(new CollisionObject(wall_r));
    }

    // first closet:
    // space inside closet
    const closet_int = new T.Mesh(
        new T.BoxGeometry(6, 8, 4),
        new T.MeshBasicMaterial({ color: 0x000000, side: T.DoubleSide })
    );
    map.add(closet_int);
    closet_int.position.set(63, 4, -38.1);
    const closet1_l = make_closet1_leftdoor(prototype_mode);
    closet1_l.position.set(60, 0, -40.2);
    map.add(closet1_l);
    doors.push(new ClosetDoor(closet1_l, closet_int, 1, 0.05));
    const closet1_r = make_closet1_rightdoor(prototype_mode);
    closet1_r.position.set(66, 0, -40.2);
    closet1_r.rotateY(Math.PI);
    map.add(closet1_r);
    doors.push(new ClosetDoor(closet1_r, closet_int, -1, 0.05));
    
    const door2 = make_door1(prototype_mode);
    door2.position.set(5, 0, -40);
    door2.rotateY(Math.PI/2);
    map.add(door2);
    const door2_obj = new Door(door2);
    doors.push(door2_obj);
    collision_objects.push(door2_obj.collision_obj);

    // end wall hallway 2
    const hallway2_end = make_wall1(prototype_mode);
    hallway2_end.position.set(5, 0, -45);
    hallway2_end.rotateY(Math.PI/2);
    map.add(hallway2_end);
    collision_objects.push(new CollisionObject(hallway2_end));

    // key room
    // floors
    for (let x of [-1, -7]) {
        for (let z of [-40, -44, -48]) {
            const key_floor = make_floor4(prototype_mode);
            key_floor.position.set(x, 0, z);
            map.add(key_floor);
        }
    }
    // walls
    const key_wall1 = new make_wall4(prototype_mode);
    key_wall1.position.set(-5, 0, -40);
    map.add(key_wall1);
    collision_objects.push(new CollisionObject(key_wall1));
    const key_wall2 = new make_wall4(prototype_mode);
    key_wall2.position.set(-5, 0, -40);
    key_wall2.rotateY(Math.PI/2);
    map.add(key_wall2);
    collision_objects.push(new CollisionObject(key_wall2));
    const key_wall3 = new make_wall4(prototype_mode);
    key_wall3.position.set(-5, 0, -50);
    map.add(key_wall3);
    collision_objects.push(new CollisionObject(key_wall3));
    const key_wall4 = new make_wall4(prototype_mode);
    key_wall4.position.set(4.9, 0, -45);
    key_wall4.rotateY(Math.PI/2);
    map.add(key_wall4);
    collision_objects.push(new CollisionObject(key_wall4));
    const key_ceil = new make_wall4(prototype_mode);
    key_ceil.scale.setScalar(1.5);
    key_ceil.position.set(-10, 9.5, -50);
    key_ceil.rotateX(Math.PI/2);
    map.add(key_ceil);

    // key!
    const entrance_key = make_key();
    entrance_key.position.set(-3, 0.1, -47);
    entrance_key.rotation.set(-Math.PI/2, 0, Math.PI/6);
    entrance_key.scale.setScalar(2);
    map.add(entrance_key);
    const entrance_key_obj = new Key(entrance_key, door0_obj);
    keys_inv.push(entrance_key_obj);

    map_generated = true;
}

let cam_rotation = new T.Quaternion();

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function update_camera(cam_rotation) {
    const xh = mouseX_delta / canvas.width;
    const yh = mouseY_delta / canvas.height;

    cam_phi += -xh * 5;
    cam_theta = clamp(cam_theta + -yh * 5, -Math.PI/3, Math.PI/3);

    const qx = new T.Quaternion();
    qx.setFromAxisAngle(new T.Vector3(0, 1, 0), cam_phi);
    const qz = new T.Quaternion();
    qz.setFromAxisAngle(new T.Vector3(1, 0, 0), cam_theta);

    const q = new T.Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    mouseX_delta = 0;
    mouseY_delta = 0;

    return q;
}

function fade_out() {
    if (point_light.intensity > 0) {
        point_light.intensity -= 0.01;
        requestAnimationFrame(fade_out);
    }
}

function fade_in() {
    if (point_light.intensity < point_light_intensity) {
        point_light.intensity += 0.001;
        requestAnimationFrame(fade_in);
    }
}

function end_game() {
    bgm.volume = 0;
    radio.volume = 0;
    flashlight.visible = false;
    oni1.moving = false;
    control = false;
    running = false;
    requestAnimationFrame(fade_out);
    document.exitPointerLock();
    menu_button.style.visibility = "visible";
}

function lose_game() {
    end_game();
    hud_window.style.visibility = "visible";
    hud_text.innerHTML = "Game Over"; 
}

function win_game() {
    end_game();
    hud_window.style.visibility = "visible";
    hud_text.innerHTML = "You escaped!"; 

}


let event_flag;
let running = false;
let in_closet = false;
let in_pickup = false;
let control = true;
let map_generated = false;
let radio_on = true;

let oni1;
function setup() {
    camera.position.set(87.5, camera_height, 80);
    camera.lookAt(new T.Vector3(87, camera_height, 72));
    oni1 = new Oni();
    scene.add(oni1.mesh);
    oni1.mesh.position.set(87.5, oni_height, -60);

    control = true;
    running = true;
    event_flag = 0;
    make_map();
}

function open_menu() {
    menu.style.visibility = "visible";
    start_button.style.visibility = "visible";
    menu_button.style.visibility = "hidden";
}

function run(time) {

    if (running) {
        camera_box.setFromObject(player);
        if (isPointerLocked) {
            if (control) {
                handle_movement(time);
                camera.quaternion.copy(update_camera(cam_rotation));
            }
        }

        const oni_dir_vector = direction_vector(oni1.mesh, camera);
        const oni_dist = oni_dir_vector.length();
        if (oni_dist < 7) {
            lose_game();
        } else {
            radio.volume = radio_on ? 7 / oni_dist : 0;
        }

        if (event_flag == 0 && camera.position.x < 75 && camera.position.z < -42) {
            event_flag = 1;
            oni1.mesh.position.set(20, oni_height, -45);
        }

        if (event_flag == 1 && camera.position.x < 45) {
            event_flag = 2;
            oni1.moving = true;
        }

        if (event_flag == 3 && camera.position.x > 85 && camera.position.z < -40) {
            event_flag = 4;
            oni1.moving = true;
        }

        if (event_flag == 4 && camera.position.z > 95) {
            win_game();
        }

        oni1.move(time);
    }

    renderer.render(scene, camera);

    requestAnimationFrame(run);
}

open_menu();

function start() {
    menu.style.visibility = "hidden";
    start_button.style.visibility = "hidden";
    prototype_button.style.visibility = "hidden";
    setup();
    if (map_generated) {
        requestAnimationFrame(fade_in);
        requestAnimationFrame(run);
    }
    bgm.loop = true;
    bgm.play();
    radio.loop = true;
    radio.volume = 0;
    radio.play();
}

start_button.addEventListener("click", function() {
    prototype_mode = false;
    start();
});

prototype_button.addEventListener("click", function() {
    prototype_mode = true;
    start();
});

menu_button.addEventListener("click", function() {
    menu_button.style.visibility = "hidden";
    hud_window.style.visibility = "hidden";
    location.reload();
});