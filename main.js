import * as THREE from 'three';
import OrbitControls from 'threejs-orbit-controls';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 9, 21);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

const renderer = new THREE.WebGLRenderer({ antialias: true }, { alpha: true });
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth/1, window.innerHeight/1.1 );
renderer.setClearColor(0xA3A3A3);
document.body.appendChild( renderer.domElement );

// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

//// Ground
const ground = new THREE.Mesh(
    new THREE.BoxGeometry(50, 1, 200), 
    new THREE.MeshLambertMaterial({ color: 0x333333 }));
ground.position.set(0,-1, -75)
ground.receiveShadow = true;
//ground.castShadow = true;
scene.add(ground);
  
/////// Lighting
const ambLight = new THREE.AmbientLight(0xffffff,.8);
ambLight.position.set(500, 500, 300);
scene.add(ambLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-200, 200, 100);
dirLight.castShadow = true;
scene.add(dirLight); 

///// Sky,tbd- removed


////// Car
const car1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2.2, 2.5),
    new THREE.MeshLambertMaterial({color:0x78b14b}))
car1.castShadow = true;
scene.add(car1);
car1.position.set(0,0,15)


//// Event Listeners
window.addEventListener('keydown', (event)=> {
    switch(event.code){
        case'KeyA':
            car1.position.x += -1.5
            // i want this smoother, animate later?
            break
        case'KeyD':
            car1.position.x += 1.5            

            break
        case 'KeyW':
            car1.position.z += -1.5            
            
            break
        case 'KeyS':
            car1.position.z += 1.5
           //console.log('s key down')
            break

        //Other keys
        case 'KeyM':
            //const running = true;
            //to start and stop game, add later.
            camera.position.x += 20;
            break
        case 'KeyI':
            //Camera IJKL = WASD, added during quick debugging
            // Use with orbitcontrols
            camera.position.z -= 20;
            break
        case 'KeyK':
            //Camera Z back
            camera.position.z += 20;
            break
       
    }
});

/// Collision
//  BBoxes


/// Obstacles "Traffic Cones" etc 
var trafz = -135; // all trafcone's initial z cord (relative?)
const torange = 0xE9A200;
const trafcone1 = createTrafcone(0,1,trafz, torange); // initial tcone
scene.add(trafcone1); 
    //clips into ground on purpose bc i like how it looks

var xslotstraf = [-15, -10, -5, 0, 5, 10, 15] // "x slots trafcones"

function createTrafcone(x, y, z, color) {
    const trafcone = new THREE.Group();
    //this is all one traffic cone
    const conetop = new THREE.Mesh(
        new THREE.ConeGeometry(1, 2.5, 6),
        new THREE.MeshBasicMaterial({ color: color })
    )
    conetop.castShadow = true;
    conetop.position.set(x, y, z);

    const conebottom = new THREE.Mesh(
        new THREE.BoxGeometry(2, .5, 2),
        new THREE.MeshBasicMaterial({ color: color }));
    // clips into ground, i like it that way
    conebottom.position.set(x, y - 1.5, z);
    conebottom.castShadow = true;

    trafcone.add(conetop, conebottom);

    return trafcone;

}

//// The Big Lot of cones (create the many at once)
const theLot = new THREE.Group();
function createLot(group, color){
    var trafx = xslotstraf[Math.floor(Math.random() * xslotstraf.length)];
    // "this traf's x" to use, at random
    for (let i = 0; i <= 15; i++){
        //generate 10+ at once
        group.add(createTrafcone(trafx, 1, (trafz -= 10), color));
        console.log("added tcone at ", trafx, 1, trafz -= 10);
        trafx = xslotstraf[Math.floor(Math.random() * xslotstraf.length)];
    }
    console.log("end of this lot")
}
const lt1initialz = theLot.position.z;
createLot(theLot, torange);
scene.add(theLot);

const theLot2 = new THREE.Group();
createLot(theLot2, torange); // added color param for easier debug
scene.add(theLot2);
//theLot2.position.z = trafz -200;
console.log(theLot2);



// "Road Piece" The yellow lines
function roadps(x, y, z) {
    // Each 'roadpcs' is two pieces of the chain
    const roadps = new THREE.Group();
    const roadps1 = new THREE.Mesh(
        new THREE.PlaneGeometry(.5, 2),
        new THREE.MeshBasicMaterial({ color: 0xffff00 }));

    roadps1.position.set(x, y, z);
    roadps1.rotation.x = - Math.PI / 2;

    const roadps2 = roadps1.clone();
    roadps2.position.set(x, y, z+9); //12x for side
        //roadps are nine apart
    roadps.add(roadps1, roadps2);
    return roadps;
}
var rx = 6; var ry = -.4; var rz = 27; //road cord
    //all rz's mults of nine

function makeLineRoadps(x, y, z){
    const roadLine = new THREE.Group();
    for(let i=0; i<= 27; i++){
        roadLine.add(roadps(x, y, z));
        //console.log("roadps clone placed at", x, y, z);
        z -= 9;
    }
    return roadLine
}
const ourRoadLine1 = makeLineRoadps(rx, ry, rz);
scene.add(ourRoadLine1);

//// Road - Just another line.
    // Line from Three docs looked tedious in examples at the time
const solidyellow = new THREE.Mesh(
    new THREE.PlaneGeometry(.5, 200),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }));
solidyellow.rotation.x = - Math.PI / 2;
solidyellow.position.set(rx-18,0,rz-100);
scene.add(solidyellow);

//// "a Lot's worth from behind car" approx
const lotsWCar = (car1.position.z + 500);
//console.log("LWC:", lotsWCar);

//// Marker to debug and find positions
const marker = new THREE.Mesh(
    new THREE.BoxGeometry(5,10,5), 
    new THREE.MeshBasicMaterial({ color: 0xffff00 }));
marker.position.z = -250; //so i want Lot2 to loop back right here.
    //Try next: loop back to "last Lot1 cone minus z" 
  
//scene.add(marker);


var trafvel = 1; // tcone velocity

function animate(){
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera ); 
       
    const go = 1;
    if (go){
        trafcone1.position.z += trafvel; 
        theLot.position.z += trafvel;
        theLot2.position.z += trafvel;
    }

    //Send objects, then set them back
    if(trafcone1.position.z > lotsWCar){
        trafcone1.position.z = -135;
        //the farthest tcone back from TheLot
        //slight overlap OK for all
    }
        // These stopped working and had to be given all new numbers
        // theLot2 Z position always wrong/has offset? see difference in numbers given
    if (theLot.position.z > (lotsWCar)) {
        theLot.position.z = -100;      
    }
    if (theLot2.position.z > (800)) {//try around800 and 175-200   
        theLot2.position.z = 200;
        //console.log("L2 pos: ", theLot2.position.z, theLot2);
    }
    

    //animate road
    ourRoadLine1.position.z += 1;
    if (ourRoadLine1.position.z > 27) {
        ourRoadLine1.position.z = 18;
    }
    

}

animate();

