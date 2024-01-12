import * as THREE from "three"; //on importe la librairie three
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// pour l'effect
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';


// SCENE - CAMERA - RENDERER
const scene = new THREE.Scene(); // coprs de notre page, notre "univers"
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // notre caméra = nos yeux
// fov = 75 champ de vision, aspect ration entre largeur de l'écran et hauteur
camera.position.x = 35
camera.position.y = 35
camera.position.z = 35
    // Fetch the canvas element created in index.html, replace 'canvas' with the id of your canvas
const canvas = document.getElementById('canvas');
// Create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer({ // moteur qui fait le rendu visuel de la scène
    canvas: canvas,
    // Antialiasing is used to smooth the edges of what is rendered
    antialias: true,
    //alpha: true -> pour avoir fond transparent
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // rendu pixel pas étiré
const controls = new OrbitControls(camera, canvas);

// pour resize l'écran si modification
window.addEventListener('resize', () => {
    // Update the camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});


//FOG au loin (fondu au bout du plan)
const fogColor = 0x199799; // Couleur du brouillard
const fogDensity = 0.005; // Densité du brouillard
scene.fog = new THREE.FogExp2(fogColor, fogDensity);


// EXEMPLE DU COURS, BULLE + LUMIERE
// Adding a background
const textureLoader = new THREE.TextureLoader();
let textureEquirec = textureLoader.load('background2.jpeg');
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.colorSpace = THREE.SRGBColorSpace;
scene.background = textureEquirec;


//// GROUND
const textureLoader3 = new THREE.TextureLoader(); // Création d'une texture pour le sol
const groundTexture = textureLoader3.load('sand.jpg');
const sandtext = new THREE.TextureLoader().load('sandtext.png');
const groundGeometry = new THREE.PlaneGeometry(1000, 1000); // Taille du sol
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
groundMaterial.normalMap = sandtext;
groundMaterial.normalScale.set(10, 10);
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2; // Rotation pour placer le sol horizontalement
scene.add(groundMesh); // Ajout du sol à la scène


// LIGHT
// const light = new THREE.HemisphereLight( 0xffffff, 0x404040, 3);
//const light = new THREE.AmbientLight( 0xffffff, 3, 0, 0 );
const sunLight = new THREE.DirectionalLight(0xffffff, 3); // Couleur blanche, intensité 1
//const light = new THREE.PointLight( 0xffffff, 3);
//light.position.set( 0, 40, 0);
scene.add(sunLight);

// EFFECT
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.1
);
const outputPass = new OutputPass();
composer.addPass(renderPass);
composer.addPass(bloomPass);
composer.addPass(outputPass);


// ETOILE
const star_loader = new GLTFLoader();
let starModel;
star_loader.load('./Models/star/scene.gltf', (gltf) => {
    starModel = gltf.scene; // Le modèle 3D est chargé ici
    starModel.position.set(0, 10, 12); // Ajuste la position du modèle
    starModel.scale.set(20, 20, 20); // Ajuste l'échelle du modèle - Exemple : échelle uniforme
    scene.add(starModel); // Ajout du modèle à la scène
});
// const textDisplay3 = document.createElement('div');
// textDisplay3.textContent = 'Le BIOS est un projet réalisé dans le cadre d\'une étude sur les habitats temporaires. Il s\'agit d\'une tente gonflable en biomatériaux prenant la forme d\'un oursin. Cette forme a été choisi pour ses avantages ain que des aspects de design';
// document.body.appendChild(textDisplay3);

const textDisplay3 = document.createElement('div');
textDisplay3.textContent = 'Le BIOS est un projet réalisé dans le cadre d\'une étude sur les habitats temporaires responsables. Il s\'agit d\'une tente gonflable en biomatériaux prenant la forme d\'un oursin. Cette forme a été choisie pour ses avantages thermiques et son design innovant. Ce projet a été réalisé avec Claire LEFEZ';
textDisplay3.style.borderRadius = '8%'; // Définir le rayon pour créer une forme ronde
textDisplay3.style.width = '300px'; // Définir la largeur (ajustez selon vos besoins)
textDisplay3.style.height = '120px'; // Définir la hauteur (ajustez selon vos besoins)
textDisplay3.style.overflow = 'hidden'; // Masquer le contenu qui dépasse de la forme ronde
textDisplay3.style.backgroundColor = '#fffacd';
textDisplay3.style.opacity = '0.8';
document.body.appendChild(textDisplay3);

// Création d'un raycaster
const raycaster3 = new THREE.Raycaster();
const mouse3 = new THREE.Vector2();

// Fonction pour détecter les intersections avec le maillage
function onMouseClick3(event) {
    event.preventDefault();

    // Récupération des coordonnées du clic de la souris
    mouse3.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse3.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster3.setFromCamera(mouse3, camera); // Mettre à jour le rayon

    // Vérifier les intersections avec tous les maillages enfants du modèle
    const intersects = raycaster3.intersectObjects(starModel.children, true);

    if (intersects.length > 0) {
        // Si un maillage est cliqué, afficher le texte à l'emplacement du clic
        textDisplay3.style.display = 'block';
        textDisplay3.style.top = `${event.clientY}px`;
        textDisplay3.style.left = `${event.clientX}px`;
    } else {
        // Cacher le texte si le clic n'est pas sur un maillage
        textDisplay3.style.display = 'none';
    }
}
// Ajout d'un gestionnaire d'événements de clic sur la fenêtre
window.addEventListener('click', onMouseClick3, false);


// BIOS
const loader = new GLTFLoader();
loader.load('./BIOS.gltf', (gltf) => {
    const model = gltf.scene; // Le modèle 3D est chargé ici
    model.position.set(0, 0, 0); // Ajuste la position du modèle
    // Ajuste la rotation du modèle (en radians)
    model.rotation.set(-Math.PI / 2, 0, 0); // Exemple : rotation de 90 degrés autour de l'axe y 
    model.scale.set(9, 9, 9); // Ajuste l'échelle du modèle - Exemple : échelle uniforme
    scene.add(model); // Ajout du modèle à la scène
});


// BULLES QUI BOUGENT
function createBubble(x, y, z, lightColor) {
    const bubbleGeometry = new THREE.SphereGeometry(2, 20, 20);
    const bubbleMaterial = new THREE.MeshPhongMaterial({
        color: 0xff66cc,
        transparent: true,
        opacity: 1,
        emissive: lightColor,
        emissiveIntensity: 1.5, // Augmentation de l'intensité de l'émission lumineuse
        envMap: textureEquirec,
        envMapIntensity: 1.0,
        roughness: 0.2,

    });
    const bubbleMesh = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubbleMesh.position.set(x, y, z);
    scene.add(bubbleMesh);
    // Création de la lumière ponctuelle avec la couleur spécifiée pour la bulle
    const light = new THREE.PointLight(lightColor, 15, 55); // Augmentation de l'intensité de la lumière
    light.position.set(x, y, z);
    scene.add(light);
    const bubbleSpeed = 0.06;
    let goingUp = Math.random() >= 0.5;

    function animateBubble() {
        requestAnimationFrame(animateBubble);
        if (goingUp) {
            bubbleMesh.position.y += bubbleSpeed;
        } else {
            bubbleMesh.position.y -= bubbleSpeed;
        }
        if (bubbleMesh.position.y > (y + 10)) {
            goingUp = false;
        } else if (bubbleMesh.position.y < (y - 10)) {
            goingUp = true;
        }
        renderer.render(scene, camera);
    }
    animateBubble();
}
// Création des bulles avec des lumières de différentes couleurs et intensités
createBubble(2, 28, 18, 0xff33e0);
createBubble(22, 12, 6, 0xff33e0);
createBubble(-12, 32, 2, 0xff33e0);
createBubble(-30, 32, 4, 0xff33e0);
createBubble(18, 40, 12, 0xff33e0);
createBubble(4, 22, 12, 0xfad4bd);
createBubble(-13, 13, 15, 0xfad4bd);
createBubble(-9, 55, 2, 0xfad4bd);

createBubble(8, 22, -12, 0x197c99);
createBubble(-43, 13, -15, 0x197c99);
createBubble(-19, 55, -2, 0x197c99);



// POISSONS MULTICO
const colors = [
    0x0000ff, // Bleu pur
    0x99ccff, // Bleu clair
    0x000066, // Bleu marine
    0x000033, // Bleu marine plus foncé
    0x0000cc
]; // Bleu avec une teinte légèrement plus claire
function createFish(posX, posY, posZ, index) {
    let end = 0.1;
    let start = 0.1;
    let fishG = new THREE.Group();
    for (let i = 1; i < 15; i++) {
        start = end;
        end = Math.sin(i / 4);
        let geometry = new THREE.CylinderGeometry(start, end, 0.2, 8);
        let material = new THREE.MeshBasicMaterial({ color: colors[index % colors.length] });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.2 * -i;
        mesh.name = "cyc" + start + "_" + end;
        fishG.rotation.set(-Math.PI / 2, 0, 0);
        fishG.add(mesh);
    }

    // Calcul de la position verticale initiale
    const initialY = Math.abs(posY) + 3; // Éloignement vertical initial
    const amplitude = 2 + index * 0.5;
    const frequency = 0.002 + index * 0.0005;
    const centerRotationSpeed = 0.01 + index * 0.001;
    const radius = 10 + index * 4;
    fishG.initialY = initialY;
    fishG.amplitude = amplitude;
    fishG.frequency = frequency;
    fishG.centerRotationSpeed = centerRotationSpeed;
    fishG.radius = radius;
    fishG.position.set(posX, initialY, posZ); // Réglage de la position initiale
    scene.add(fishG);
    // Animation du déplacement en suivant une sinusoïde et rotation autour du centre
    return fishG;
}
// Création de plusieurs poissons avec une couleur différente et une trajectoire sinusoidale différente pour chaque poisson
let school = [];
school.push(createFish(42, 20, 12, 1));
school.push(createFish(-12, 10, 0, 2));
school.push(createFish(22, 3, 6, 3));
school.push(createFish(-18, 10, 0, 4));
school.push(createFish(31, 4, 2, 5));

function animateFish(fish) {
    let yPosition = fish.initialY + fish.amplitude * Math.sin(Date.now() * fish.frequency * (fish.index % 2 === 0 ? 1 : -1));
    // Ajuster la position verticale pour rester au-dessus du niveau 0
    yPosition = Math.max(yPosition, 0);
    fish.position.y = yPosition;
    fish.rotation.y += fish.centerRotationSpeed * (fish.index % 2 === 0 ? 1 : -1);
    fish.position.x = fish.radius * Math.cos(fish.rotation.y);
    fish.position.z = fish.radius * Math.sin(fish.rotation.y);
}


// COQUILLAGE
const shell_loader = new GLTFLoader();
shell_loader.load('./Models/sea_shell/scene.gltf', (gltf) => {
    const model = gltf.scene; // Le modèle 3D est chargé ici
    model.position.set(15, 2, 15); // Ajuste la position du modèle
    model.scale.set(35, 35, 35); // Ajuste l'échelle du modèle - Exemple : échelle uniforme
    scene.add(model); // Ajout du modèle à la scène
});


// TORTUE
const tt_loader = new GLTFLoader();
const moveDistance = 200; // Distance à parcourir sur l'axe X et Z
const moveDuration = 15000; // Durée totale pour aller-retour en millisecondes
let isMovingForward = true;
let animationStartTime = performance.now();
let model; // Variable pour stocker le modèle
let initialPosition = undefined;

tt_loader.load('Models/turtle/scene.gltf', (gltf) => {
    model = gltf.scene; // Le modèle 3D est chargé ici
    // Parcours des matériaux du modèle pour texture
    model.traverse((child) => {
        if (child.isMesh) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('tt2.jpg'); // Chemin de votre texture
            child.material.map = texture; // Application de la texture au matériau du maillage
        }
    });

    // Position initiale du modèle
    initialPosition = new THREE.Vector3(45, 6, 20);
    model.position.copy(initialPosition);
    model.scale.set(25, 25, 25); // Ajustement de l'échelle du modèle
    scene.add(model); // Ajout du modèle à la scène
    // Gestionnaire d'événements pour détecter les clics de souris
    window.addEventListener('click', onClick);
});

function onClick(event) {
    // Coordonnées du clic de la souris normalisées par rapport à la fenêtre
    const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
    };
    // Création d'un rayon depuis la caméra à l'endroit où la souris a cliqué
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    // Tableau des intersections entre le rayon et les objets 3D
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length > 0) {
        isMovingForward = !isMovingForward;
    }
}


// FAIT LE RENDU DE LA SCENE, à chaque raffaichissement de l'écran (fonction récursive)
const animate = () => {
    requestAnimationFrame(animate);
    //animateTurtle();
    school.forEach(f => animateFish(f));
    controls.update();
    // renderer.render(scene, camera);
    composer.render();

    // TORTUE
    if (model) {
        model.position.x += 0.1 * ((isMovingForward) * 2 - 1);
        model.position.z += 0.1 * ((isMovingForward) * 2 - 1);
    }

}
animate();