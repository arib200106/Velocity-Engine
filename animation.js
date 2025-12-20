import * as THREE from 'three';
import { keys } from './input.js';
import { handleWallCollisions } from './physics.js';

let prevTime = performance.now();
let bobTimer = 0; 

export function update(renderer, scene, camera, controls, velocity, direction, walls) {
    function loop() {
        requestAnimationFrame(loop);

        if (controls.isLocked) {
            const time = performance.now();
            const delta = (time - prevTime) / 1000;

            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 30.0 * delta; 

            direction.z = Number(keys.forward) - Number(keys.backward);
            direction.x = Number(keys.right) - Number(keys.left);
            direction.normalize();

            let currentSpeed = keys.sprint ? 250.0 : 120.0;
            if (keys.forward || keys.backward) velocity.z -= direction.z * currentSpeed * delta;
            if (keys.left || keys.right) velocity.x -= direction.x * currentSpeed * delta;

            if (keys.jump && velocity.canJump) {
                velocity.y += 18.0;
                velocity.canJump = false;
            }

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);

            const targetHeight = keys.crouch ? 0.8 : 1.6;
            camera.position.y += (targetHeight - camera.position.y) * 0.1;
            camera.position.y += (velocity.y * delta);

            if (camera.position.y < targetHeight && velocity.y <= 0) {
                velocity.y = 0;
                camera.position.y = targetHeight;
                velocity.canJump = true;
            }

            const horizontalSpeed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);
            
            if (velocity.canJump && horizontalSpeed > 0.1) {
                // Increase timer: faster speed = faster bobbing
                bobTimer += delta * (keys.sprint ? 15 : 10);
                // Apply a sine wave to the Y position
                camera.position.y += Math.sin(bobTimer) * 0.05;
            } else {
                bobTimer = 0;
            }

            handleWallCollisions(camera, walls, velocity);
            prevTime = time;
        }

        renderer.render(scene, camera);
    }
    loop();
}