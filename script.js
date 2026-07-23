document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. EFECTO TYPEWRITER (Escritura dinámica)
       ========================================= */
    const dynamicText = document.querySelector('.dynamic-text');
    const words = ["BarberHUB.", "Exclusivo.", "Profesional."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            dynamicText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            dynamicText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pausa antes de borrar
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pausa antes de escribir nueva palabra
        }

        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();

    /* =========================================
       2. EFECTO DE PARTÍCULAS EN CANVAS
       ========================================= */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

            // Interacción con el mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;
            let color = '#d4af37'; // Dorado
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();

    /* =========================================
       3. EFECTO 3D TILT (Inclinación del Hero)
       ========================================= */
    const heroCard = document.querySelector('.tilt-card');
    document.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        heroCard.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    // Restaurar posición al salir
    document.addEventListener('mouseleave', () => {
        heroCard.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        heroCard.style.transition = "all 0.5s ease";
    });
    document.addEventListener('mouseenter', () => {
        heroCard.style.transition = "none";
    });

    /* =========================================
       4. DATOS Y LÓGICA DEL NEGOCIO
       ========================================= */
    const servicios = [
        { id: 'S1', nombre: 'Corte Clásico / Fade', precio: 25000, icono: 'fa-cut' },
        { id: 'S2', nombre: 'Arreglo de Barba', precio: 18000, icono: 'fa-user-ninja' },
        { id: 'S3', nombre: 'Combo BarberHUB Premium', precio: 45000, icono: 'fa-crown' }
    ];

    const servicesContainer = document.getElementById('services-container');
    const servicioSelect = document.getElementById('servicio-select');

    servicios.forEach(srv => {
        servicesContainer.innerHTML += `
            <div class="service-card glass-panel">
                <i class="fas ${srv.icono}"></i>
                <h3>${srv.nombre}</h3>
                <span class="price">$${srv.precio.toLocaleString('es-CO')}</span>
            </div>
        `;
        servicioSelect.innerHTML += `<option value="${srv.precio}">${srv.nombre} - $${srv.precio.toLocaleString('es-CO')}</option>`;
    });

    const form = document.getElementById('booking-form');
    const totalDisplay = document.getElementById('total-price');

    servicioSelect.addEventListener('change', (e) => {
        totalDisplay.textContent = `$${parseInt(e.target.value).toLocaleString('es-CO')}`;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const cliente = document.getElementById('cliente').value;
        const select = document.getElementById('servicio-select');
        const servicioTexto = select.options[select.selectedIndex].text;
        
        alert(`¡Melo! Reserva confirmada para ${cliente}.\nServicio: ${servicioTexto}`);
        form.reset();
        totalDisplay.textContent = '$0';
    });

    // Menú móvil
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('nav-menu').classList.toggle('active');
    });
});