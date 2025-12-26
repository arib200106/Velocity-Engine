import * as THREE from 'three';

export class Enemy {
    constructor(scene, position) {
        this.scene = scene;
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            new THREE.MeshStandardMaterial({ color: 0xff4444 })
        );
        this.mesh.position.copy(position);
        scene.add(this.mesh);
        this.health = 100;
        this.isDead = false;
        this.speed = 3 + Math.random() * 2;
    }

    takeDamage(amount, onDie) {
        this.health -= amount;
        this.mesh.material.color.set(0xffffff);
        setTimeout(() => { if(!this.isDead) this.mesh.material.color.set(0xff4444); }, 100);
        if (this.health <= 0) {
            this.isDead = true;
            this.scene.remove(this.mesh);
            onDie();
        }
    }

    update(playerPos, delta) {
        const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
        dir.y = 0;
        if (dir.length() > 1.2) {
            dir.normalize();
            this.mesh.position.addScaledVector(dir, this.speed * delta);
            this.mesh.lookAt(playerPos.x, this.mesh.position.y, playerPos.z);
        }
    }
}

export function spawnEnemy(scene, playerPos, enemies) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 25; 
    const x = playerPos.x + Math.cos(angle) * distance;
    const z = playerPos.z + Math.sin(angle) * distance;
    enemies.push(new Enemy(scene, new THREE.Vector3(x, 1, z)));
}