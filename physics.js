import * as THREE from 'three';

export function handleWallCollisions(camera, walls, velocity) {
    const playerBox = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(camera.position.x, camera.position.y - 0.8, camera.position.z),
        new THREE.Vector3(0.6, 1.6, 0.6)
    );

    for (const wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) {
            const overlapX = Math.min(playerBox.max.x - wallBox.min.x, wallBox.max.x - playerBox.min.x);
            const overlapZ = Math.min(playerBox.max.z - wallBox.min.z, wallBox.max.z - playerBox.min.z);
            const wallCenter = new THREE.Vector3();
            wallBox.getCenter(wallCenter);

            if (overlapX < overlapZ) {
                camera.position.x += overlapX * (camera.position.x > wallCenter.x ? 1 : -1);
            } else {
                camera.position.z += overlapZ * (camera.position.z > wallCenter.z ? 1 : -1);
            }
        }
    }
}