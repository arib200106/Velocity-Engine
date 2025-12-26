import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { initInput } from './input.js';
import { update } from './animation.js';
import { createWorld } from './world.js';
import { spawnEnemy } from './enemies.js';
import { createWeapon, shoot } from './combat.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Fallback Sky

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const walls = createWorld(scene);
let enemies = [];
let kills = 0;
const WIN_COUNT = 5;
let isWon = false; 

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const controls = new PointerLockControls(camera, document.body);
const ui = document.getElementById('ui');
const overlay = document.getElementById('overlay');

createWeapon(camera);
scene.add(camera);

function handleScore() {
    kills++;
    ui.innerText = `Kills: ${kills} / ${WIN_COUNT}`;
    if (kills >= WIN_COUNT) {
        isWon = true; 
        controls.unlock();
        overlay.style.display = 'flex';
        overlay.style.pointerEvents = 'auto'; 
        overlay.innerHTML = `
            <div class="menu" style="pointer-events: auto;">
                <h1 style="color: #00ff00;">VICTORY</h1>
                <p>City Cleared</p>
                <button onclick="window.location.reload()" style="padding: 15px 30px; cursor: pointer; font-weight: bold; background: #00ff00; border: none; border-radius: 5px;">
                    PLAY AGAIN
                </button>
            </div>
        `;
    }
}

document.addEventListener('click', (e) => {
    if (isWon) return; 
    if (controls.isLocked) {
        shoot(camera, enemies, walls, handleScore);
    } else {
        controls.lock();
    }
}, true);

controls.addEventListener('lock', () => { if (!isWon) overlay.style.display = 'none'; });
controls.addEventListener('unlock', () => { overlay.style.display = 'flex'; });

for (let i = 0; i < WIN_COUNT; i++) spawnEnemy(scene, camera.position, enemies);

initInput();
update(renderer, scene, camera, controls, velocity, direction, walls, enemies);

new RGBELoader().load('assets/textures/rosendal_plains_2_1k.hdr', (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = tex;
    scene.environment = tex;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});