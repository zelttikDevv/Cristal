const CORRECT_CODE = "546";
const hints = [
    "Son 3 números",
    "Yo sé que conoces esos 3 números",
    "Última pista...",
    "Innerbloom"
];

const phrases = [
    "Hay frecuencias que solo se sintonizan una vez",
    "No es el tiempo, es la conexión",
    "Me gusta el caos, pero solo si es contigo",
    "Eres ese 'algo' que no sabía que estaba buscando",
    "Si el universo es infinito, qué suerte coincidir aquí",
    "Contigo el silencio no es incómodo, es paz",
    "A veces te miro y pienso: 'Qué bueno que existes'",
    "Hay personas que son hogar, y tú te sientes así",
    "Roma no se construyó en un diá",
    "No eres una opción, eres el destino",
    "546", "✨"
];

// --- Lógica de Pistas Dinámicas ---
let hintIndex = 0;
const hintElement = document.getElementById('dynamic-hint');

setInterval(() => {
    if (hintElement) {
        gsap.to(hintElement, { opacity: 0, duration: 0.5, onComplete: () => {
            hintIndex = (hintIndex + 1) % hints.length;
            hintElement.innerText = hints[hintIndex];
            gsap.to(hintElement, { opacity: 1, duration: 0.5 });
        }});
    }
}, 3500);

// --- Manejo de Inputs de Password ---
const inputs = document.querySelectorAll('.code-input');
inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && i < inputs.length - 1) inputs[i+1].focus();
    });
});

document.getElementById('unlock-btn').addEventListener('click', () => {
    const code = Array.from(inputs).map(i => i.value).join('');
    if (code === CORRECT_CODE) {
        startExperience();
    } else {
        gsap.to(".inputs", { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
    }
});

function startExperience() {
    gsap.to("#lock-screen", { opacity: 0, duration: 1, onComplete: () => {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('loader-container').classList.remove('hidden');
        
        gsap.to("#progress", {
            width: "100%", duration: 2.5, ease: "power2.inOut",
            onComplete: () => {
                document.getElementById('loader-container').classList.add('hidden');
                document.getElementById('universe-container').classList.remove('hidden');
                
                // Mostrar footer con fade
                const footer = document.getElementById('zoom-hint');
                footer.classList.remove('hidden');
                gsap.fromTo(footer, { opacity: 0 }, { opacity: 1, duration: 2 });
                
                document.getElementById('innerbloom-audio').play();
                buildSpiral();
            }
        });
    }});
}

function buildSpiral() {
    const galaxy = document.getElementById('spiral-galaxy');
    
    phrases.forEach((text, i) => {
        const card = document.createElement('div');
        card.className = 'phrase-card';
        card.innerText = text;
        
        const angle = i * 0.95; 
        const radius = 120 + (i * 30);
        const z = i * -320; 

        gsap.set(card, {
            left: "50%", top: "50%",
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: z,
            xPercent: -50, yPercent: -50
        });
        galaxy.appendChild(card);
    });

    gsap.to(galaxy, { rotationZ: 360, duration: 100, repeat: -1, ease: "none" });

    // VIAJE AUTOMÁTICO (Velocidad aumentada +20%)
    let moveZ = 0;
    const speed = 0.75; 

    function travel() {
        moveZ += speed;
        gsap.set(galaxy, { z: moveZ });
        requestAnimationFrame(travel);
    }
    travel();

    // Zoom manual táctil mejorado
    let lastY = 0;
    window.addEventListener('touchstart', e => lastY = e.touches[0].clientY);
    window.addEventListener('touchmove', e => {
        let delta = (lastY - e.touches[0].clientY) * 2.8;
        moveZ += delta;
        lastY = e.touches[0].clientY;
    });
}
