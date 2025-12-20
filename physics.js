import * as THREE from 'three';

export function handleWallCollisions(camera, walls, velocity) {
    const playerBox = new THREE.Box3().setFromCenterAndSize(
        camera.position, 
        new THREE.Vector3(1.2, 2, 1.2)
    );

    walls.forEach(wall => {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) {
            const overlap = new THREE.Box3().copy(playerBox).intersect(wallBox);
            const size = new THREE.Vector3();
            overlap.getSize(size);

            if (size.x < size.z) {
                camera.position.x += (camera.position.x > wallBox.getCenter(new THREE.Vector3()).x) ? size.x : -size.x;
                velocity.x = 0;
            } else {
                camera.position.z += (camera.position.z > wallBox.getCenter(new THREE.Vector3()).z) ? size.z : -size.z;
                velocity.z = 0;
            }
        }
    });
}