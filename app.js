
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({alpha: true});
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
const topLight = new THREE.DirectionalLight(0xffffff, 1);

// canvas
camera.position.z = 13;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.getElementById("container3D").appendChild( renderer.domElement );

// lighting
scene.add(ambientLight);
topLight.position.set(500,500,500);
scene.add(topLight);

// positions
let transformations = [
    {
        id: "geo",
        position: {x: -4, y: -1, z: -15},
        rotation: {x: 0, y: 1, z: 0},
    },
    {
        id: "solar",
        position: {x: 5, y: 1, z: -25},
        rotation: {x: 0.5, y: -1, z: 0},
    },
    {
        id: "bio",
        position: {x: -3, y: -0.5, z: -15},
        rotation: {x: 0, y: 0.5, z: 0},
    },
    {
        id: "hydro",
        position: {x: -4, y: -1, z: -35},
        rotation: {x: 0.25, y: 2.5, z: 0},
    },
    {
        id: "ocean",
        position: {x: 2.5, y: -1, z: -10},
        rotation: {x: 0, y: -1, z: 0},
    },
    {
        id: "wind",
        position: {x: -3.5, y: -1, z: -25},
        rotation: {x: 0, y: 1, z: 0},
    }
];

// window listeners
window.addEventListener('scroll', () => {
    if (bird) {
        moveModel();
    }
});
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// load bird
let bird;
let mixer;
const loader = new GLTFLoader();
loader.load('./bird.glb',
    function (gltf) {
        bird = gltf.scene;
        scene.add(bird);
        mixer = new THREE.AnimationMixer(bird);
        mixer.clipAction(gltf.animations[0]).play();
        moveModel();
    },
    function (xhr) {},
    function (error) {}
);

// animation loop
function animate() {
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);
}

// move the model
const moveModel = () => {
    const cards = document.querySelectorAll('.energyCard');
    let currentCard;
    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
            currentCard = card.id;
        }
    });
    let positionActive = transformations.findIndex(
        (val) => val.id == currentCard
    );
    if (positionActive >= 0) {
        let newCoord = transformations[positionActive];
        gsap.to(bird.position, {
            x: newCoord.position.x,
            y: newCoord.position.y,
            z: newCoord.position.z,
            duration: 2,
            ease: "power2.out"
        });
        gsap.to(bird.rotation, {
            x: newCoord.rotation.x,
            y: newCoord.rotation.y,
            z: newCoord.rotation.z,
            duration: 2,
            ease: "power2.out"
        });
    }
}