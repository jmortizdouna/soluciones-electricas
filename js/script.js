// Mobile Menu Toggle - Mejorado para móviles
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    const body = document.body;
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
            
            // Prevenir scroll cuando el menú está abierto
            if (navMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                body.style.overflow = '';
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                body.style.overflow = '';
            }
        });
        
        // Cerrar menú al cambiar orientación
        window.addEventListener('orientationchange', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
            body.style.overflow = '';
        });
    }
});

// Smooth Scrolling - Optimizado para móviles
document.querySelectorAll('nav a, .footer-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Cerrar menú móvil si está abierto
                const navMenu = document.querySelector('nav ul');
                const mobileMenuBtn = document.querySelector('.mobile-menu');
                const body = document.body;
                
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                    body.style.overflow = '';
                }
                
                // Calcular posición considerando header fijo
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll con opciones optimizadas
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add scroll effect to header - Optimizado para móviles
let scrollTimeout;
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    // Clear the timeout if it's already set
    clearTimeout(scrollTimeout);
    
    // Add scroll class for visual effect
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    } else {
        header.classList.remove('scrolled');
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    }
    
    // Performance optimization for mobile
    scrollTimeout = setTimeout(function() {
        // Optional: add any post-scroll actions here
    }, 100);
});

// FORMULARIO FORMSPREE - Optimizado para móviles
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit');
    
    if (contactForm) {
        // Función para mostrar mensajes - Mejorado para móviles
        function showMessage(type, text) {
            // Crear elemento para mensaje si no existe
            let messageContainer = document.getElementById('form-messages');
            if (!messageContainer) {
                messageContainer = document.createElement('div');
                messageContainer.id = 'form-messages';
                contactForm.prepend(messageContainer);
            }
            
            messageContainer.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${text}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            // Scroll suave al mensaje en móviles
            setTimeout(() => {
                messageContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
            }, 100);
            
            // Auto cerrar después de 5 segundos
            setTimeout(() => {
                const alert = document.querySelector('.alert');
                if (alert) alert.remove();
            }, 5000);
        }
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Deshabilitar botón y mostrar estado de carga
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';
            
            // Evitar zoom en iOS durante el envío
            document.activeElement.blur();
            
            try {
                // Recopilar datos del formulario
                const formData = new FormData(contactForm);
                
                // Enviar datos a Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Éxito
                    showMessage('success', '✅ ¡Consulta enviada con éxito! Te contactaremos en breve.');
                    contactForm.reset();
                    
                    // Restaurar validación visual
                    contactForm.querySelectorAll('.is-valid').forEach(el => {
                        el.classList.remove('is-valid');
                    });
                } else {
                    // Error de Formspree
                    const data = await response.json();
                    if (data.errors) {
                        showMessage('danger', `❌ Error: ${data.errors.map(err => err.message).join(', ')}`);
                    } else {
                        showMessage('danger', '❌ Hubo un problema al enviar la consulta. Por favor, inténtalo de nuevo.');
                    }
                }
            } catch (error) {
                // Error de red o del navegador
                console.error('Error:', error);
                showMessage('danger', '❌ Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
        
        // Validación en tiempo real - Optimizada para móviles
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Usar input event en lugar de blur para mejor experiencia en móviles
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            // También validar al salir del campo
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Prevenir zoom en iOS al enfocar
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    this.style.fontSize = '16px';
                }
            });
        });
        
        function validateField(field) {
            if (field.hasAttribute('required') && !field.value.trim()) {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                return false;
            } else if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.classList.remove('is-valid');
                    field.classList.add('is-invalid');
                    return false;
                }
            }
            
            field.classList.remove('is-invalid');
            if (field.value.trim()) {
                field.classList.add('is-valid');
            }
            return true;
        }
    }
});

// Efecto de animación para las tarjetas de servicio al hacer scroll
function checkScroll() {
    const serviceCards = document.querySelectorAll('.service-card, .certification-card');
    
    serviceCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (cardTop < windowHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// Inicializar estilos para animación
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card, .certification-card');
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Verificar posición al cargar y al hacer scroll
    checkScroll();
    
    // Optimizar scroll para móviles
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Llamada automática para emergencia - Mejorado para móviles
    const emergencyBtn = document.querySelector('.btn-primary[href^="tel"]');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                // En móviles, confirmación más simple
                if (confirm('¿Llamar al 15-2454-3443?')) {
                    // Permite que el enlace tel: funcione normalmente
                    return true;
                } else {
                    e.preventDefault();
                }
            } else {
                // En desktop, confirmación completa
                if (!confirm('¿Desea llamar al número de emergencia: 15-2454-3443?')) {
                    e.preventDefault();
                }
            }
        });
    }
    
    // Contador para mostrar tiempo de respuesta - Responsive
    const responseTimeElement = document.createElement('div');
    responseTimeElement.className = 'response-time';
    responseTimeElement.innerHTML = '<i class="fas fa-bolt"></i> Tiempo de respuesta promedio: <strong>60 minutos</strong>';
    
    // Estilos responsivos
    responseTimeElement.style.cssText = `
        background: linear-gradient(135deg, var(--logo-yellow), #e0a800);
        color: var(--dark);
        padding: 10px 20px;
        border-radius: 50px;
        font-weight: 600;
        margin-top: 20px;
        display: inline-block;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        text-align: center;
        max-width: 100%;
        box-sizing: border-box;
    `;
    
    // Ajustar padding en móviles
    if (window.innerWidth <= 768) {
        responseTimeElement.style.padding = '8px 15px';
        responseTimeElement.style.fontSize = '0.9rem';
    }
    
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.appendChild(responseTimeElement);
    }
    
    // Ajustar estilos al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            responseTimeElement.style.padding = '8px 15px';
            responseTimeElement.style.fontSize = '0.9rem';
        } else {
            responseTimeElement.style.padding = '10px 20px';
            responseTimeElement.style.fontSize = '';
        }
    });
});

// Optimización para evitar problemas de layout en iOS
document.addEventListener('DOMContentLoaded', function() {
    // Fix para altura 100vh en iOS
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Prevenir acciones por defecto en toques largos
    document.addEventListener('contextmenu', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
        }
    });
});

// Mejorar experiencia de formulario en móviles
document.addEventListener('DOMContentLoaded', function() {
    // Enfocar el primer campo inválido al enviar formulario
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('invalid', function(e) {
            // Solo en móviles
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.target.focus();
            }
        }, true);
    }
    
    // Mejorar experiencia con selects en móviles
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('focus', function() {
            if (window.innerWidth <= 768) {
                this.style.fontSize = '16px'; // Prevenir zoom en iOS
            }
        });
    });
});
    