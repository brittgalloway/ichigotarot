// Logo twinkle
gsap.utils.toArray('#white-stars [id$=star]').forEach((star) => {
    gsap.to(star, {
        opacity: 0.1,
        scale: 0.7,
        duration: gsap.utils.random(0.65, 2),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 2),
        transformOrigin: 'center center'
    })
});

// const starCount = 15;

document.querySelectorAll('main > section:not(#shop), #shop > div, header').forEach((section) => {
    createFallingStars(section, 12)
})

function createFallingStars(container, count = 15) {
    const $templates = document.querySelectorAll('.star-template .falling-star');
    const containerHeight = container.offsetHeight;
    for (let i=0; i < count; i ++) {
        const template = $templates[Math.floor(Math.random() * $templates.length)];
        const star = template.cloneNode(true);

        const size = gsap.utils.random(6, 16);
        star.style.position = 'absolute';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${gsap.utils.random(0, 95)}%`;
        star.style.top = '0';
        star.style.opacity = 0;
        
        container.appendChild(star);

        animateStar(star, containerHeight);    
    }
}

function animateStar (star, containerHeight) {
    const duration = gsap.utils.random(9, 30);
    const delay = gsap.utils.random(0, 5);
    const drift = gsap.utils.random(-20, 20);
    const startY = gsap.utils.random(-40, 0); //stagger

    const tl = gsap.timeline({
        delay,
        repeat: -1,
        onRepeat: () => {
            gsap.set(star, { left: `${gsap.utils.random(0, 95)}%`, y: startY});
            tl.vars.repeatDelay = gsap.utils.random(0, 3);
        }
    });
    
    gsap.set(star, { y: startY, x: 0, opacity: 0});

    tl.to(star, { opacity: 1, duration: duration * 0.15, ease: 'sine.out'})
    .to(star, {
        y: containerHeight +20,
        x: `+=${drift}`,
        ease: 'sine.inOut'
    }, 0)
    .to(star, { opacity:0, duration: duration * 0.2, ease: 'sine.in'}, `-=${duration * 0.2}`);
}
