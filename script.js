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

const inputs = document.querySelectorAll('.code-input');
const unlockBtn = document.getElementById('unlock-btn');

// Manejo de inputs
inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && i < inputs.length - 1) inputs[i+1].focus();
    });
});

unlockBtn.addEventListener('click', () => {
    const code = Array.from(inputs).map(i => i.value).join('');
    if (code === CORRECT_CODE) {
        startExperience();
    } else {
        gsap.to(".inputs", { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
    }
});

function startExperience() {
    document.getElementById('lock-screen').classList.add('hidden');
    document.getElementById('loader-container').classList.remove('hidden');
    
    gsap.to("#progress", {
        width: "100%", duration: 3, ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('loader-container').classList.add('hidden');
            document.getElementById('universe').classList.remove('hidden');
            document.getElementById('zoom-hint').classList.remove('hidden');
            document.getElementById('innerbloom-audio').play();
            buildUniverse();
        }
    });
}

function buildUniverse() {
    const starsContainer = document.getElementById('stars-container');
    const phrasesContainer = document.getElementById('phrases-container');

    // Crear 150 estrellas
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const z = Math.random() * 1000 - 500;

        gsap.set(star, {
            width: size, height: size,
            left: x + "%", top: y + "%",
            z: z
        });
        starsContainer.appendChild(star);
    }

    // Crear frases en espiral/profundidad
    phrases.forEach((text, i) => {
        const div = document.createElement('div');
        div.className = 'phrase';
        div.innerText = text;
        
        const angle = i * 0.7;
        const radius = 150 + (i * 20);
        const z = i * -150; // Cada frase más lejos que la anterior

        gsap.set(div, {
            left: "50%", top: "50%",
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: z,
            xPercent: -50, yPercent: -50
        });
        phrasesContainer.appendChild(div);
    });

    // Animación de rotación constante
    gsap.to([starsContainer, phrasesContainer], {
        rotationZ: 360,
        duration: 100,
        repeat: -1,
        ease: "none"
    });

    // Movimiento con el dedo (Zoom/Viaje)
    let currentZ = 0;
    window.addEventListener('touchmove', (e) => {
        currentZ += 5; // Simula avanzar
        gsap.to([starsContainer, phrasesContainer], {
            z: currentZ,
            duration: 0.5
        });
    });
}
