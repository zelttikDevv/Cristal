const CORRECT_CODE = "546";
const unlockBtn = document.getElementById('unlock-btn');
const audio = document.getElementById('innerbloom-audio');

unlockBtn.addEventListener('click', () => {
    const val = document.getElementById('d1').value + document.getElementById('d2').value + document.getElementById('d3').value;
    if (val === CORRECT_CODE) {
        audio.play();
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('zoom-hint').classList.remove('hidden');
        initGalaxy();
    }
});

function initGalaxy() {
    const canvas = document.getElementById('galaxy-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    const starsGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(3000 * 3);
    for(let i=0; i<3000*3; i++) pos[i] = (Math.random() - 0.5) * 50;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const starsMat = new THREE.PointsMaterial({ size: 0.05, color: 0xff00ff });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    camera.position.z = 10;

    function animate() {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate();

    // Eventos móviles
    let touchY = 0;
    window.addEventListener('touchstart', e => touchY = e.touches[0].clientY);
    window.addEventListener('touchmove', e => {
        let delta = touchY - e.touches[0].clientY;
        camera.position.z += delta * 0.05;
        touchY = e.touches[0].clientY;
    });
}
