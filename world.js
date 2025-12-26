import * as THREE from 'three';

export function createWorld(scene) {
    const loader = new THREE.TextureLoader();
    const walls = [];

    // Textures
    const floorTex = loader.load('assets/textures/PavingStones116_1K-JPG_Color.jpg');
    const brickTex = loader.load('assets/textures/Bricks047_1K-JPG_Color.jpg');
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(100, 100);

    // 1. HUGE FLOOR
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshStandardMaterial({ map: floorTex })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 2. STREET LAYOUT (0 = Street, 1 = Building)
    // 10x10 Grid - We leave the middle rows as 0 for a wide main road
    const map = [
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Wide horizontal "Main Street"
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // (Double 0s = Wider road)
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    ];

    const blockSize = 15; // Bigger blocks feel less like a maze

    map.forEach((row, z) => {
        row.forEach((cell, x) => {
            if (cell === 1) {
                // Randomize building height for realism
                const h = 5 + Math.random() * 15; 
                const wallGeo = new THREE.BoxGeometry(blockSize, h, blockSize);
                const wallMat = new THREE.MeshStandardMaterial({ map: brickTex });
                
                const wall = new THREE.Mesh(wallGeo, wallMat);
                const posX = (x - map[0].length / 2) * blockSize;
                const posZ = (z - map.length / 2) * blockSize;
                
                wall.position.set(posX, h / 2, posZ);
                scene.add(wall);
                walls.push(wall);
            }
        });
    });

    // 3. REALISTIC LIGHTING (Daylight)
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(50, 100, 50);
    sun.castShadow = true; // Shadows make the streets look real
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x404040, 0.5)); // Soften shadows

    return walls;
}