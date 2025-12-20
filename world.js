import * as THREE from 'three';

export function createWorld(scene) {
    const loader = new THREE.TextureLoader();

    // 1. Load Textures
    const floorTex = loader.load('assets/textures/PavingStones116_1K-JPG_Color.jpg');
    const brickTex = loader.load('assets/textures/Bricks047_1K-JPG_Color.jpg');

    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(200, 200); 

    brickTex.wrapS = brickTex.wrapT = THREE.RepeatWrapping;
    brickTex.repeat.set(10, 2); 

    // 2. Create Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshStandardMaterial({ map: floorTex })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 3. Create Walls
    const wallMat = new THREE.MeshStandardMaterial({ map: brickTex });

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 40), wallMat);
    leftWall.position.set(-10, 3, -10);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 40), wallMat);
    rightWall.position.set(10, 3, -10);
    scene.add(rightWall);

    return [leftWall, rightWall];
}