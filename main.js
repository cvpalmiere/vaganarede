document.addEventListener('DOMContentLoaded', () => {
    // Configuração do Intersection Observer para disparar o Fade-in e as animações em cascata
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // O elemento aparece assim que 10% dele estiver na tela
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Para de observar depois que já apareceu (anima apenas na primeira vez)
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos com a classe .fade-in e começa a observar
    document.querySelectorAll('.fade-in').forEach((element) => {
        observer.observe(element);
    });

    // Smooth scroll para os links da Navbar (Produto, Soluções, etc)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
