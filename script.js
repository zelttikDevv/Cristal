const CORRECT_CODE = "546";

const phrases = [
    "Hay frecuencias que solo se sintonizan una vez",
    "No es el tiempo, es la conexión",
    "Me gusta el caos, pero solo si es contigo",
    "Eres ese 'algo' que no sabía que estaba buscando",
    "Si el universo es infinito, qué suerte coincidir aquí",
    "Contigo el silencio no es incómodo, es paz",
    "A veces te miro y pienso: 'Qué bueno que existes'",
    "Hay personas que son hogar, y tú te sientes así",
    "Bailaría Innerbloom contigo en cualquier galaxia",
    "No eres una opción, eres el destino",
    "✨", "💜"
];

// Lógica de inputs (salto automático)
const inputs = document.querySelectorAll('.code-input');
inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});

document.getElementById('unlock-btn').addEventListener('click', () => {
    const val = Array.from(inputs).map(i => i.value).join('');
    
    if (val === CORRECT_CODE) {
        startLoading();
    } else {
        gsap.to(".inputs", { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
    }
});

function startLoading() {
    document.getElementById('lock-screen').style.display = 'none';
    document.getElementById('loader-container').classList.remove('hidden');
    
    gsap.to("#progress", {
        width: "100%",
        duration: 3.5,
        ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('loader-container').classList.add('hidden');
            document.getElementById('zoom-hint').classList.remove('hidden');
            const audio = document.getElementById('innerbloom-audio');
            audio.play().catch(() => console.log("Audio waiting for interaction"));
            initGalaxy();
        }
    });
}

function initGalaxy() {
    const canvas = document.getElementById('galaxy-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Partículas de fondo
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(3000 * 3);
    for(let i=0; i<3000*3; i++) starPos[i] = (Math.random() - 0.5) * 120;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.12, color: 0xff1493, transparent: true, opacity: 0.6 });
    galaxyGroup.add(new THREE.Points(starGeo, starMat));

    // Crear las frases como objetos flotantes (puntos de luz)
    // Nota: Para texto 3D real se requiere fuente externa, aquí usamos el movimiento
    // Pero la "vibe" se da con el movimiento de la cámara
    camera.position.z = 40;

    function animate() {
        requestAnimationFrame(animate);
        galaxyGroup.rotation.y += 0.0008;
        galaxyGroup.rotation.z += 0.0003;
        renderer.render(scene, camera);
    }
    animate();

    // Control táctil para móvil
    let lastY = 0;
    window.addEventListener('touchstart', e => lastY = e.touches[0].clientY, {passive: true});
    window.addEventListener('touchmove', e => {
        let delta = (lastY - e.touches[0].clientY) * 0.08;
        let targetZ = camera.position.z + delta;
        targetZ = Math.max(5, Math.min(targetZ, 80));
        gsap.to(camera.position, { z: targetZ, duration: 0.6 });
        lastY = e.touches[0].clientY;
    }, {passive: true});
}
