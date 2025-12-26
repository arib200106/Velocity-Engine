import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

export function createWeapon(camera) {
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 });
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 0.7), gunMat);
    gun.position.set(0.35, -0.3, -0.6);
    camera.add(gun);
}

export function shoot(camera, enemies, walls, onHit) {
    raycaster.setFromCamera(center, camera);
    
    // Combine enemies and walls
    const enemyMeshes = enemies.map(e => e.mesh);
    const intersects = raycaster.intersectObjects([...enemyMeshes, ...walls]);

    if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        const targetEnemy = enemies.find(e => e.mesh === hitObject);

        if (targetEnemy) {
            targetEnemy.takeDamage(50, onHit);
        }
    }
}