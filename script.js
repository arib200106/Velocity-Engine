import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { initInput } from './input.js';
import { update } from './animation.js';
import { createWorld } from './world.js'; 

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const walls = createWorld(scene);

const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());

const velocity = new THREE.Vector3();
velocity.canJump = false;
const direction = new THREE.Vector3();

camera.position.y = 1.6; 
initInput();
renderer.render(scene, camera); 

update(renderer, scene, camera, controls, velocity, direction, walls);