const CORRECT_CODE = "546";
const unlockBtn = document.getElementById('unlock-btn');
const audio = document.getElementById('innerbloom-audio');

unlockBtn.addEventListener('click', () => {
    const val = document.getElementById('d1').value + document.getElementById('d2').value + document.getElementById('d3').value;
    if (val === CORRECT_CODE) {
        audio.play();
        document.getElementById('lock-screen').style.display = 'none'; // Forzamos desaparición
        document.getElementById('zoom-hint').classList.remove('hidden');
        initGalaxy();
    }
});

function initGalaxy() {
    const canvas = document.getElementById('galaxy-canvas');
    const scene = new THREE.Scene();
    
    // Cámara: bajamos el campo de visión (FOV) para que las estrellas se vean más grandes
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: false 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);

    // Creamos las estrellas con un tamaño mucho mayor para móviles
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 4000;
    const pos = new Float32Array(starCount * 3);
    
    for(let i = 0; i < starCount * 3; i++) {
        // Esparcimos las estrellas en un área más cerrada para que siempre haya algo en pantalla
        pos[i] = (Math.random() - 0.5) * 100; 
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const starsMat = new THREE.PointsMaterial({ 
        size: 0.15, // Aumentamos tamaño para que se vean en pantallas 4K de móvil
        color: 0xff00ff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending 
    });

    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Posición inicial de la cámara
    camera.position.z = 30;

    function animate() {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.0005; // Rotación muy lenta y elegante
        stars.rotation.x += 0.0002;
        renderer.render(scene, camera);
    }
    animate();

    // --- CORRECCIÓN DE ZOOM PARA MÓVIL ---
    let lastTouchY = 0;
    window.addEventListener('touchstart', e => {
        lastTouchY = e.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchmove', e => {
        let currentTouchY = e.touches[0].clientY;
        let diff = lastTouchY - currentTouchY;
        
        // El movimiento afecta la posición Z de la cámara
        camera.position.z += diff * 0.05;
        
        // Límites para no perderse en el espacio
        if (camera.position.z < 5) camera.position.z = 5;
        if (camera.position.z > 80) camera.position.z = 80;
        
        lastTouchY = currentTouchY;
    }, { passive: false });

    // Ajuste por si gira el celular
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
