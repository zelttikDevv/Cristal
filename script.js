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
    "546", "✨"
];

const inputs = document.querySelectorAll('.code-input');
const unlockBtn = document.getElementById('unlock-btn');

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
        width: "100%", duration: 2.5, ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('loader-container').classList.add('hidden');
            document.getElementById('universe-container').classList.remove('hidden');
            document.getElementById('zoom-hint').classList.remove('hidden');
            document.getElementById('innerbloom-audio').play();
            buildSpiral();
        }
    });
}

function buildSpiral() {
    const galaxy = document.getElementById('spiral-galaxy');
    
    phrases.forEach((text, i) => {
        const card = document.createElement('div');
        card.className = 'phrase-card';
        card.innerText = text;
        
        const angle = i * 0.95; 
        const radius = 120 + (i * 30);
        const z = i * -300; 

        gsap.set(card, {
            left: "50%", top: "50%",
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: z,
            xPercent: -50, yPercent: -50
        });
        
        galaxy.appendChild(card);
    });

    gsap.to(galaxy, {
        rotationZ: 360,
        duration: 80,
        repeat: -1,
        ease: "none"
    });

    // VIAJE AUTOMÁTICO - Aumentado un 20%
    let moveZ = 0;
    const speed = 0.65; // Antes era 0.5, ahora ~20% más rápido

    function travel() {
        moveZ += speed;
        gsap.set(galaxy, { z: moveZ });
        requestAnimationFrame(travel);
    }
    travel();

    // Zoom manual (dedo/mouse)
    let lastY = 0;
    window.addEventListener('touchstart', e => lastY = e.touches[0].clientY);
    window.addEventListener('touchmove', e => {
        let delta = (lastY - e.touches[0].clientY) * 2.5; // También aumentamos sensibilidad
        moveZ += delta;
        lastY = e.touches[0].clientY;
    });
}
