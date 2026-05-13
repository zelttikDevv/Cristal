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
    "546 💜", "✨"
];

const unlockBtn = document.getElementById('unlock-btn');
const inputs = document.querySelectorAll('.code-input');

// Auto-tab entre inputs
inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && i < inputs.length - 1) inputs[i+1].focus();
    });
});

unlockBtn.addEventListener('click', () => {
    const code = Array.from(inputs).map(i => i.value).join('');
    if (code === CORRECT_CODE) {
        startLoading();
    } else {
        gsap.to(".inputs", { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
    }
});

function startLoading() {
    document.getElementById('lock-screen').classList.add('hidden');
    document.getElementById('loader-container').classList.remove('hidden');
    
    gsap.to("#progress", {
        width: "100%", duration: 3, ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('loader-container').classList.add('hidden');
            document.getElementById('galaxy-wrapper').classList.remove('hidden');
            document.getElementById('zoom-hint').classList.remove('hidden');
            document.getElementById('innerbloom-audio').play();
            createGalaxy();
        }
    });
}

function createGalaxy() {
    const container = document.getElementById('text-universe');
    const totalPhrases = 40; // Repetimos frases para llenar el espacio

    for (let i = 0; i < totalPhrases; i++) {
        const span = document.createElement('span');
        span.className = 'galaxy-phrase';
        span.innerText = phrases[i % phrases.length];
        
        // Matemáticas para la espiral (como el video)
        const angle = i * 0.8; 
        const radius = i * 15; // Se expande hacia afuera
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 500;

        container.appendChild(span);

        // Animación individual de rotación
        gsap.set(span, { x: window.innerWidth/2 + x, y: window.innerHeight/2 + y, z: z });
        
        gsap.to(span, {
            rotationZ: 360,
            duration: 20 + Math.random() * 20,
            repeat: -1,
            ease: "none"
        });
    }

    // Rotación general del universo
    gsap.to(container, {
        rotationY: 360,
        duration: 40,
        repeat: -1,
        ease: "none"
    });

    // Control de Zoom con el dedo / mouse
    let zoom = 0;
    window.addEventListener('touchmove', e => {
        zoom -= 2; // Efecto de entrar a la galaxia
        gsap.to(container, { z: zoom, duration: 1 });
    });
    window.addEventListener('wheel', e => {
        zoom -= e.deltaY * 0.5;
        gsap.to(container, { z: zoom, duration: 1 });
    });
}
