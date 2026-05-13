// Configuración
const CORRECT_CODE = "546";
const GALAXY_COLOR = 0xff00ff; // Rosa/Morado Neón

// Elementos del DOM
const unlockBtn = document.getElementById('unlock-btn');
const audio = document.getElementById('innerbloom-audio');

// 1. Manejo del Candado
unlockBtn.addEventListener('click', () => {
    const val = document.getElementById('d1').value + 
                document.getElementById('d2').value + 
                document.getElementById('d3').value;

    if (val === CORRECT_CODE) {
        startExperience();
    } else {
        // Efecto de error (vibración)
        gsap.to(".inputs", { x: 10, repeat: 5, yoyo: true, duration: 0.05, onComplete: () => {
            gsap.set(".inputs", { x: 0 });
        }});
    }
});

function startExperience() {
    document.getElementById('lock-screen').classList.add('hidden');
    document.getElementById('zoom-hint').classList.remove('hidden');
    audio.play();
    initGalaxy();
}

// 2. Motor de la Galaxia (Three.js)
function initGalaxy() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('galaxy-canvas'), 
        antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Generar Estrellas
    const starGeo = new THREE.BufferGeometry();
    const starCoords = [];
    for (let i = 0; i < 6000; i++) {
        starCoords.push((Math.random() - 0.5) * 60); // X
        starCoords.push((Math.random() - 0.5) * 60); // Y
        starCoords.push((Math.random() - 0.5) * 60); // Z
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));

    const starMat = new THREE.PointsMaterial({
        size: 0.015,
        color: GALAXY_COLOR,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    camera.position.z = 5;

    // Animación
    function animate() {
        requestAnimationFrame(animate);
        starField.rotation.y += 0.0005;
        starField.rotation.x += 0.0002;
        renderer.render(scene, camera);
    }
    animate();

    // Zoom Interactivo con GSAP
    window.addEventListener('wheel', (e) => {
        let newZ = camera.position.z + (e.deltaY * 0.007);
        newZ = Math.max(1, Math.min(newZ, 40));
        gsap.to(camera.position, { z: newZ, duration: 1.2, ease: "power2.out" });
    });

    // Ajuste de ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
