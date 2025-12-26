import * as THREE from 'three';
import { keys } from './input.js';
import { handleWallCollisions } from './physics.js';

let prevTime = performance.now();
let bobTimer = 0;

export function update(renderer, scene, camera, controls, velocity, direction, walls, enemies) {
    function loop() {
        requestAnimationFrame(loop);
        if (!controls.isLocked) return;

        const time = performance.now();
        let delta = (time - prevTime) / 1000;
        if (delta > 0.1) delta = 0.1; 

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 35.0 * delta; 

        direction.z = Number(keys.forward) - Number(keys.backward);
        direction.x = Number(keys.right) - Number(keys.left);
        direction.normalize();

        const speed = keys.sprint ? 250.0 : 120.0;
        if (keys.forward || keys.backward) velocity.z -= direction.z * speed * delta;
        if (keys.left || keys.right) velocity.x -= direction.x * speed * delta;

        if (keys.jump && velocity.canJump) {
            velocity.y = 13.0;
            velocity.canJump = false;
        }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        handleWallCollisions(camera, walls, velocity);

        camera.position.y += (velocity.y * delta);
        const targetHeight = keys.crouch ? 0.8 : 1.6;

        if (camera.position.y <= targetHeight) {
            if (velocity.y < 0) {
                velocity.y = 0;
                velocity.canJump = true;
            }
            camera.position.y += (targetHeight - camera.position.y) * 0.2;
        }

        const targetFOV = keys.sprint ? 85 : 75;
        camera.fov += (targetFOV - camera.fov) * 0.1;
        camera.updateProjectionMatrix();

        if (velocity.canJump && (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.z) > 0.1)) {
            bobTimer += delta * (keys.sprint ? 15 : 10);
            camera.position.y += Math.sin(bobTimer) * 0.02;
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].isDead) enemies.splice(i, 1);
            else enemies[i].update(camera.position, delta);
        }

        prevTime = time;
        renderer.render(scene, camera);
    }
    loop();
}