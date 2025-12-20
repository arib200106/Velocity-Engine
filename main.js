import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(10, 20, 10);
scene.add(sunLight);

const loader = new THREE.TextureLoader();

const floorTexture = loader.load('assets/textures/PavingStones116_1K-JPG_Color.jpg');
const brickTexture = loader.load('assets/textures/Bricks047_1K-JPG_Color.jpg');

floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(200, 200); 

brickTexture.wrapS = brickTexture.wrapT = THREE.RepeatWrapping;
brickTexture.repeat.set(10, 2); 

const floorGeo = new THREE.PlaneGeometry(1000, 1000);
const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const wallMat = new THREE.MeshStandardMaterial({ map: brickTexture });

const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 40), wallMat);
leftWall.position.set(-10, 3, -10);
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 40), wallMat);
rightWall.position.set(10, 3, -10);
scene.add(rightWall);

const controls = new PointerLockControls(camera, document.body);

document.addEventListener('click', () => {
    controls.lock();
});

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let isSprinting = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const onKeyDown = (e) => {
    if (e.code === 'KeyW') moveForward = true;
    if (e.code === 'KeyS') moveBackward = true;
    if (e.code === 'KeyA') moveLeft = true;
    if (e.code === 'KeyD') moveRight = true;
    if (e.shiftKey) isSprinting = true;
};

const onKeyUp = (e) => {
    if (e.code === 'KeyW') moveForward = false;
    if (e.code === 'KeyS') moveBackward = false;
    if (e.code === 'KeyA') moveLeft = false;
    if (e.code === 'KeyD') moveRight = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') isSprinting = false;
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

camera.position.y = 1.6;

let prevTime = performance.now();
function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked) {
        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        let currentSpeed = isSprinting ? 250.0 : 120.0; 
        if (moveForward || moveBackward) velocity.z -= direction.z * currentSpeed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * currentSpeed * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        const wallBoxes = [
            new THREE.Box3().setFromObject(leftWall),
            new THREE.Box3().setFromObject(rightWall)
        ];

        let playerBox = new THREE.Box3().setFromCenterAndSize(
            camera.position, 
            new THREE.Vector3(1.2, 2, 1.2)
        );

        for (const wallBox of wallBoxes) {
            if (playerBox.intersectsBox(wallBox)) {
                const overlap = new THREE.Box3().copy(playerBox).intersect(wallBox);
                const size = new THREE.Vector3();
                overlap.getSize(size);

                if (size.x < size.z) {
                    if (camera.position.x > wallBox.getCenter(new THREE.Vector3()).x) {
                        camera.position.x += size.x;
                    } else {
                        camera.position.x -= size.x;
                    }
                    velocity.x = 0;
                } else {
                    if (camera.position.z > wallBox.getCenter(new THREE.Vector3()).z) {
                        camera.position.z += size.z;
                    } else {
                        camera.position.z -= size.z;
                    }
                    velocity.z = 0;
                }
            }
        }
    }

    prevTime = performance.now();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});