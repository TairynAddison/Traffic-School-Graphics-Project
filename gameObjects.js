import * as THREE from 'three';
import OrbitControls from 'threejs-orbit-controls';
import * as TWEEN from '@tweenjs/tween.js';

/// Obstacles "Traffic Cones" etc 

class Trafcone {
    constructor(pos, color) {
    
            this.x = pos.x;
            this.y = pos.y;
            this.z = pos.z;
            this.color = color;

    }
    
        
    

}
//trafvel = 1;
function createTrafcone(x, y, z){
    const trafcone = new THREE.Group();

    

    const conetop = new THREE.Mesh(
        new THREE.ConeGeometry(1, 2.5, 6),
        new THREE.MeshBasicMaterial({ color: 0xE9A200 })
    )
    conetop.position.set(x, y, z);

    const conebottom = new THREE.Mesh(
        new THREE.BoxGeometry(2, .5, 2),
        new THREE.MeshBasicMaterial({ color: 0xE9A200 }));
    // clips into ground, i like it that way
    conebottom.position.set(x, y - 1.5, z);
    conebottom.castShadow = true;


    trafcone.add(conetop, conebottom);

    return trafcone;

}

//Place Traffic Cones handler
function placetrafs(slots, zcord){
    for (let i = 0; i <= 10; i++) {
        var trafx = slots[Math.floor(Math.random() * slots.length)];
        // "this traf's x" to use, at random
        scene.add(trafcone(trafx, 1, (zcord -= 10)));        
        console.log("added one at ", trafx, 1, zcord -= 10)
    }

}