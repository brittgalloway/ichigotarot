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
    createFallingStars(section, 5, '.star-round', 17);
    createFallingStars(section, 9, '.star-point', 30);
})

function createFallingStars(container, count = 15, template, max) {
    const $templates = document.querySelectorAll(`.star-template ${template}`);
    const containerHeight = container.offsetHeight;
    for (let i=0; i < count; i ++) {
        const template = $templates[Math.floor(Math.random() * $templates.length)];
        const star = template.cloneNode(true);

        const size = gsap.utils.random(10, max);
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
    const startX = gsap.utils.random(0, 95);
    const startY = gsap.utils.random(0, containerHeight * 0.7);
    const driftDistance = gsap.utils.random(30, 70);
    const totalDuration = gsap.utils.random(2.5, 4); 
    const delay = gsap.utils.random(0, 4); 
    
    gsap.set(star, {
        left: `${startY}%`, 
        top: `${startY}px`, 
        opacity: 0,
        scale: 0.6
    });
    const tl = gsap.timeline({
        delay,
        repeat: -1,
        onRepeat: () => {
            const newX = gsap.utils.random(0,95);
            const newY = gsap.utils.random(0, containerHeight * 0.7);
            gsap.set(star, { 
                left: `${newX}%`, 
                top: `${newY}px`,
                y: 0,
                scale:0.6
            });
        }
    });
    

    tl.to(star, { 
        opacity: 1, 
        scale: 1,
        duration: totalDuration * 0.25, 
        ease: 'sine.out'
    }).to(star, {
        opacity: 0.8,
        scale: 0.8,
        duration: 0.5,
        repeat: 1,
        yoyo: true,
        ease: 'sine.inOut'
    }, '<').to(star, { 
        opacity:0, 
        scale: 0.5,
        duration: totalDuration * 0.3, 
        ease: 'sine.in'}, `-=${totalDuration * 0.3}`);
}
