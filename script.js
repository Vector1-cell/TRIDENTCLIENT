```javascript
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

const mouseGlow = document.querySelector(".mouse-glow");

let width;
let height;

let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};


/* =====================================
   RESIZE
===================================== */

function resize() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

}

resize();

window.addEventListener("resize", resize);


/* =====================================
   MOUSE
===================================== */

window.addEventListener("mousemove", (event) => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

    mouseGlow.style.left = `${mouse.x}px`;
    mouseGlow.style.top = `${mouse.y}px`;

});


/* =====================================
   PARTICLES
===================================== */

const particles = [];

const PARTICLE_COUNT = 110;

for (let i = 0; i < PARTICLE_COUNT; i++) {

    particles.push({

        x: Math.random() * window.innerWidth,

        y: Math.random() * window.innerHeight,

        size: Math.random() * 1.5 + 0.4,

        speedX:
            (Math.random() - 0.5) * 0.25,

        speedY:
            (Math.random() - 0.5) * 0.25,

        opacity:
            Math.random() * 0.4 + 0.08

    });

}


/* =====================================
   SMALL MOUSE TRAIL
===================================== */

/*
   Only 18 particles are kept here,
   so the trail stays short and subtle.
*/

const trail = [];

window.addEventListener("mousemove", (event) => {

    trail.push({

        x: event.clientX +
            (Math.random() - 0.5) * 5,

        y: event.clientY +
            (Math.random() - 0.5) * 5,

        life: 1,

        size:
            Math.random() * 1.7 + 0.5

    });


    /* SHORT TRAIL */

    if (trail.length > 18) {

        trail.shift();

    }

});


/* =====================================
   ANIMATION
===================================== */

function animate() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* -----------------------------
       BACKGROUND PARTICLES
    ----------------------------- */

    particles.forEach((particle) => {

        particle.x += particle.speedX;
        particle.y += particle.speedY;


        /* Screen wrapping */

        if (particle.x < 0)
            particle.x = width;

        if (particle.x > width)
            particle.x = 0;

        if (particle.y < 0)
            particle.y = height;

        if (particle.y > height)
            particle.y = 0;


        /* Distance from mouse */

        const dx =
            particle.x - mouse.x;

        const dy =
            particle.y - mouse.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        let opacity =
            particle.opacity;


        /*
           Particles become slightly
           brighter near the cursor.
        */

        if (distance < 140) {

            opacity +=
                (1 - distance / 140)
                * 0.45;

        }


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(65, 155, 255, ${opacity})`;

        ctx.fill();

    });


    /* -----------------------------
       CONNECT PARTICLES
    ----------------------------- */

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const a = particles[i];
            const b = particles[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distance < 85) {

                ctx.beginPath();

                ctx.moveTo(a.x, a.y);

                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle =
                    `rgba(
                        30,
                        120,
                        230,
                        ${0.045 *
                        (1 - distance / 85)}
                    )`;

                ctx.lineWidth = 0.5;

                ctx.stroke();

            }

        }

    }


    /* -----------------------------
       SHORT MOUSE TRAIL
    ----------------------------- */

    for (
        let i = 0;
        i < trail.length;
        i++
    ) {

        const particle = trail[i];

        particle.life -= 0.045;


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );


        /*
           Very faint blue particles.
           They disappear quickly.
        */

        ctx.fillStyle =
            `rgba(
                70,
                165,
                255,
                ${particle.life * 0.35}
            )`;

        ctx.fill();

    }


    /* Remove dead trail particles */

    for (
        let i = trail.length - 1;
        i >= 0;
        i--
    ) {

        if (trail[i].life <= 0) {

            trail.splice(i, 1);

        }

    }


    requestAnimationFrame(animate);

}

animate();
```
