
import '../style.css'
import gsap from 'gsap'
import './loading.js'
// ========================================
// GLOBAL SETTINGS
// ========================================

const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches

const DELAY_AFTER_INTRO = 0.35

// ========================================
// INTRO ELEMENTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const hasSeenIntro = localStorage.getItem('hasSeenIntro');

  if (hasSeenIntro) {
    // Jika sudah pernah lihat, hilangkan elemen intro langsung
    intro.remove(); // atau: intro.style.display = 'none';
  } else {
    // Jika belum pernah lihat, simpan status ke localStorage
    localStorage.setItem('hasSeenIntro', 'true');

    // Kode/fungsi animasi intro Anda berjalan di sini...
  }
});

const intro = document.querySelector('#intro')
const introTitle = document.querySelector('#intro-title')
const introLabel = document.querySelector('#intro-label')
const introLine = document.querySelector('#intro-line')

const grain = document.querySelector('#grain-turbulence')
const gradient = document.querySelector('.intro-gradient')
const glowOne = document.querySelector('.glow-one')
const glowTwo = document.querySelector('.glow-two')

// ========================================
// INTRO SETTINGS
// ========================================

const INTRO = {
    text:
        'Setiap perjalanan dimulai dari sebuah makna, ' +
        'dan makna itu tumbuh perlahan dalam setiap langkah ' +
        'yang kita pilih dengan sepenuh hati.',

    accentCount: 3,
    revealDuration: 1.3,
    revealStagger: 0.15,
    holdDuration: 1.8,
    fadeDuration: 1.6,
    fadeStagger: 0.17,
    exitDuration: 1.6,
}

// ========================================
// CREATE INTRO WORDS
// ========================================

let introWords = []

if (introTitle) {
    introTitle.replaceChildren()

    const allWords = INTRO.text.split(/\s+/)

    introWords = allWords.map((word, index) => {
        const span = document.createElement('span')

        span.textContent = word
        span.style.display = 'inline-block'
        span.style.margin = '0'
        span.style.padding = '0'
        span.style.willChange = 'opacity, transform, filter'

        if (index >= allWords.length - INTRO.accentCount) {
            span.style.color = '#c3c9a6'
            span.style.fontStyle = 'italic'
        } else {
            span.style.color = '#eeeeee'
        }

        introTitle.appendChild(span)

        if (index < allWords.length - 1) {
            introTitle.appendChild(document.createTextNode(' '))
        }

        return span
    })
}

// ========================================
// INTRO BACKGROUND ANIMATION
// ========================================

function animateIntroBackground() {
    if (reducedMotion) return

    if (gradient) {
        gsap.to(gradient, {
            backgroundPosition: '100% 50%',
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        })
    }

    if (glowOne) {
        gsap.to(glowOne, {
            x: '18vw',
            y: '12vh',
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        })
    }

    if (glowTwo) {
        gsap.to(glowTwo, {
            x: '-15vw',
            y: '-10vh',
            duration: 11,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        })
    }

    if (grain) {
        gsap.to(grain, {
            attr: {
                baseFrequency: 1.05,
            },
            duration: 0.22,
            repeat: -1,
            yoyo: true,
            ease: 'steps(2)',
        })
    }
}

// ========================================
// HERO ELEMENTS
// ========================================

function initHero() {
    const hero = document.querySelector('#hero')

    if (!hero) return

    const finePointer = window.matchMedia(
        '(pointer: fine)'
    ).matches

    const video = hero.querySelector('.hero-video')
    const orbit = hero.querySelector('.hero-orbit')
    const content = hero.querySelector('.hero-content')
    const trailCanvas = document.getElementById('cursor-trail')

    // ========================================
    // SPLIT HEADLINE INTO CHARACTERS
    // ========================================

    const splitElements = hero.querySelectorAll('[data-split]')

    splitElements.forEach((element) => {
        if (element.dataset.splitReady === 'true') return

        const text = element.textContent ?? ''

        element.dataset.splitReady = 'true'
        element.setAttribute('aria-label', text)
        element.setAttribute('data-split-original', text)
        element.setAttribute('aria-hidden', 'true')

        element.replaceChildren()

        for (const character of text) {
            if (character === ' ') {
                element.appendChild(document.createTextNode(' '))
                continue
            }

            const span = document.createElement('span')

            span.className = 'hero-char'
            span.textContent = character
            span.setAttribute('aria-hidden', 'true')

            element.appendChild(span)
        }
    })

    // ========================================
    // HERO INTRO ANIMATION
    // ========================================

    if (!reducedMotion) {
        const timeline = gsap.timeline({
            defaults: {
                ease: 'power4.out',
            },
        })

        if (video) {
            timeline.from(video, {
                scale: 1.35,
                duration: 2.4,
                ease: 'power2.out',
            }, 0)
        }

        const rule = hero.querySelector('.hero-rule')

        if (rule) {
            timeline.from(rule, {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1,
            }, 0.2)
        }

        const topLabel = hero.querySelector(
            '.hero-top span:last-child'
        )

        if (topLabel) {
            timeline.from(topLabel, {
                opacity: 0,
                x: -12,
                duration: 1,
            }, 0.4)
        }

        const characters = hero.querySelectorAll('.hero-char')

        if (characters.length) {
            timeline.from(characters, {
                yPercent: 115,
                rotate: 4,
                duration: 1.2,
                stagger: 0.035,
            }, 0.4)
        }

        const divider = hero.querySelector('.hero-divider')

        if (divider) {
            timeline.from(divider, {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1.4,
                ease: 'power3.inOut',
            }, 1)
        }

        const description = hero.querySelector(
            '.hero-description'
        )

        if (description) {
            timeline.from(description, {
                opacity: 0,
                y: 20,
                duration: 1,
            }, 1.2)
        }

        const actions = hero.querySelectorAll(
            '.hero-actions > *'
        )

        if (actions.length) {
            timeline.from(actions, {
                opacity: 0,
                y: 20,
                duration: 1,
                stagger: 0.12,
            }, 1.35)
        }

        const scrollIndicator = hero.querySelector('.hero-scroll')

        if (scrollIndicator) {
            timeline.from(scrollIndicator, {
                opacity: 0,
                duration: 1,
            }, 1.8)
        }

        if (orbit) {
            timeline.from(orbit, {
                opacity: 0,
                scale: 0.9,
                duration: 2,
            }, 0.6)

            gsap.to(orbit, {
                rotation: 360,
                duration: 120,
                ease: 'none',
                repeat: -1,
            })
        }
    }



    // Respect reduced motion and touch devices.
    if (reducedMotion || !finePointer) return

    // ========================================
    // SPOTLIGHT + PARALLAX
    // ========================================

    const spot = {
        x: hero.clientWidth * 0.7,
        y: hero.clientHeight * 0.4,
    }

    const setX = gsap.quickTo(spot, 'x', {
        duration: 0.8,
        ease: 'power3.out',
    })

    const setY = gsap.quickTo(spot, 'y', {
        duration: 0.8,
        ease: 'power3.out',
    })

    const videoX = video
        ? gsap.quickTo(video, 'x', {
            duration: 1.2,
            ease: 'power3.out',
        })
        : null

    const videoY = video
        ? gsap.quickTo(video, 'y', {
            duration: 1.2,
            ease: 'power3.out',
        })
        : null

    const orbitX = orbit
        ? gsap.quickTo(orbit, 'x', {
            duration: 1.6,
            ease: 'power3.out',
        })
        : null

    const contentX = content
        ? gsap.quickTo(content, 'x', {
            duration: 1.2,
            ease: 'power3.out',
        })
        : null

    const contentY = content
        ? gsap.quickTo(content, 'y', {
            duration: 1.2,
            ease: 'power3.out',
        })
        : null

    const updateSpotlight = () => {
        hero.style.setProperty('--mx', `${spot.x}px`)
        hero.style.setProperty('--my', `${spot.y}px`)
    }

    gsap.ticker.add(updateSpotlight)

    // ========================================
    // LIGHT TRAIL CANVAS
    // ========================================

    if (!trailCanvas) {
        initMagneticButtons(hero)
        return
    }

    const context = trailCanvas.getContext('2d')

    if (!context) {
        initMagneticButtons(hero)
        return
    }

    let width = 0
    let height = 0
    let pixelRatio = 1
    let inside = false
    let last = null

    const particles = []

    const resizeCanvas = () => {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

        width = hero.clientWidth
        height = hero.clientHeight

        trailCanvas.width = Math.round(width * pixelRatio)
        trailCanvas.height = Math.round(height * pixelRatio)

        trailCanvas.style.width = `${width}px`
        trailCanvas.style.height = `${height}px`

        context.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        )
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // ========================================
    // CURSOR MOVEMENT
    // ========================================

    hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect()

        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        inside = true

        setX(x)
        setY(y)

        const normalizedX = x / Math.max(width, 1) - 0.5
        const normalizedY = y / Math.max(height, 1) - 0.5

        if (videoX) videoX(normalizedX * -30)
        if (videoY) videoY(normalizedY * -20)
        if (orbitX) orbitX(normalizedX * -50)
        if (contentX) contentX(normalizedX * 10)
        if (contentY) contentY(normalizedY * 6)

        if (last) {
            const dx = x - last.x
            const dy = y - last.y
            const distance = Math.hypot(dx, dy)
            const steps = Math.min(Math.ceil(distance / 6), 14)

            for (let i = 1; i <= steps; i++) {
                const progress = i / steps

                particles.push({
                    x: last.x + dx * progress +
                        (Math.random() - 0.5) * 4,
                    y: last.y + dy * progress +
                        (Math.random() - 0.5) * 4,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5 - 0.15,
                    radius: 10 + Math.random() * 16,
                    life: 1,
                    decay: 0.014 + Math.random() * 0.012,
                    hue: Math.random() > 0.8
                        ? '255,255,255'
                        : '168,200,184',
                })
            }
        }

        last = { x, y }
    })

    hero.addEventListener('pointerleave', () => {
        inside = false
        last = null
    })

    // ========================================
    // PARTICLE RENDER LOOP
    // ========================================

    const renderParticles = () => {
        context.clearRect(0, 0, width, height)
        context.globalCompositeOperation = 'lighter'

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i]

            particle.x += particle.vx
            particle.y += particle.vy
            particle.life -= particle.decay

            if (particle.life <= 0) {
                particles.splice(i, 1)
                continue
            }

            const radius = particle.radius * (
                0.4 + particle.life * 0.6
            )

            const particleGradient = context.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                radius
            )

            particleGradient.addColorStop(
                0,
                `rgba(${particle.hue},${0.35 * particle.life})`
            )

            particleGradient.addColorStop(
                0.4,
                `rgba(168,200,184,${0.12 * particle.life})`
            )

            particleGradient.addColorStop(
                1,
                'rgba(168,200,184,0)'
            )

            context.fillStyle = particleGradient
            context.beginPath()
            context.arc(
                particle.x,
                particle.y,
                radius,
                0,
                Math.PI * 2
            )
            context.fill()
        }

        if (inside) {
            const cursorGradient = context.createRadialGradient(
                spot.x,
                spot.y,
                0,
                spot.x,
                spot.y,
                28
            )

            cursorGradient.addColorStop(
                0,
                'rgba(255,255,255,.55)'
            )

            cursorGradient.addColorStop(
                1,
                'rgba(168,200,184,0)'
            )

            context.fillStyle = cursorGradient
            context.beginPath()
            context.arc(spot.x, spot.y, 28, 0, Math.PI * 2)
            context.fill()
        }

        if (particles.length > 400) {
            particles.splice(0, particles.length - 400)
        }

        requestAnimationFrame(renderParticles)
    }

    renderParticles()

    initMagneticButtons(hero)

    hero.dataset.heroReady = 'true'
}

// ========================================
// MAGNETIC BUTTONS
// ========================================

function initMagneticButtons(hero) {
    hero.querySelectorAll('[data-magnetic]').forEach((element) => {
        if (element.dataset.magneticReady === 'true') return

        element.dataset.magneticReady = 'true'

        const moveX = gsap.quickTo(element, 'x', {
            duration: 0.6,
            ease: 'power3.out',
        })

        const moveY = gsap.quickTo(element, 'y', {
            duration: 0.6,
            ease: 'power3.out',
        })

        element.addEventListener('pointermove', (event) => {
            const rect = element.getBoundingClientRect()

            moveX(
                (event.clientX - (rect.left + rect.width / 2)) * 0.25
            )

            moveY(
                (event.clientY - (rect.top + rect.height / 2)) * 0.35
            )
        })

        element.addEventListener('pointerleave', () => {
            moveX(0)
            moveY(0)
        })
    })
}

// ========================================
// HERO TEXT: HIDE DURING INTRO EXIT,
// REVEAL AFTER INTRO REMOVAL
// ========================================

function initHeroReveal() {
    const intro = document.querySelector('#intro')
    const hero = document.querySelector('#hero')

    if (!intro || !hero || reducedMotion) return

    let hidden = false
    let revealed = false

    const getTargets = () => ({
        label: hero.querySelector('.hero-top span:last-child'),
        chars: hero.querySelectorAll('.hero-char'),
        description: hero.querySelector('.hero-description'),
        actions: hero.querySelectorAll('.hero-actions > *'),
    })

    const hideHeroText = () => {
        if (hidden || revealed) return

        hidden = true

        const { label, chars, description, actions } = getTargets()

        if (chars.length) {
            gsap.set(chars, {
                yPercent: 115,
                rotate: 4,
                autoAlpha: 0,
            })
        }

        if (label) {
            gsap.set(label, {
                autoAlpha: 0,
                x: -12,
            })
        }

        if (description) {
            gsap.set(description, {
                autoAlpha: 0,
                y: 20,
            })
        }

        if (actions.length) {
            gsap.set(actions, {
                autoAlpha: 0,
                y: 20,
            })
        }
    }

    const revealHeroText = () => {
        if (!hidden || revealed) return

        revealed = true

        const { label, chars, description, actions } = getTargets()

        const timeline = gsap.timeline({
            delay: DELAY_AFTER_INTRO,
            defaults: {
                ease: 'power4.out',
            },
        })

        if (label) {
            timeline.to(label, {
                autoAlpha: 1,
                x: 0,
                duration: 1,
            }, 0)
        }

        if (chars.length) {
            timeline.to(chars, {
                yPercent: 0,
                rotate: 0,
                autoAlpha: 1,
                duration: 1.2,
                stagger: 0.035,
            }, 0.1)
        }

        if (description) {
            timeline.to(description, {
                autoAlpha: 1,
                y: 0,
                duration: 1,
            }, 0.8)
        }

        if (actions.length) {
            timeline.to(actions, {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                stagger: 0.12,
            }, 0.95)
        }
    }

    // Watch the intro's exit fade.
    const styleObserver = new MutationObserver(() => {
        if (!intro.isConnected) return

        const opacity = Number.parseFloat(
            getComputedStyle(intro).opacity
        )

        if (opacity < 1) {
            hideHeroText()
            styleObserver.disconnect()
        }
    })

    styleObserver.observe(intro, {
        attributes: true,
        attributeFilter: ['style'],
    })

    // Watch the intro being removed.
    const parent = intro.parentNode

    if (!parent) {
        styleObserver.disconnect()
        return
    }

    const removalObserver = new MutationObserver(() => {
        if (intro.isConnected) return

        removalObserver.disconnect()
        styleObserver.disconnect()

        revealHeroText()
    })

    removalObserver.observe(parent, {
        childList: true,
    })
}

// ========================================
// INTRO TIMELINE
// ========================================

function startIntro() {
    if (!intro) {
        document.body.classList.remove('overflow-hidden')
        return
    }

    if (reducedMotion) {
        intro.remove()
        document.body.classList.remove('overflow-hidden')
        return
    }

    const timeline = gsap.timeline({
        defaults: {
            ease: 'power2.out',
        },

        onComplete() {
            intro.remove()
            document.body.classList.remove('overflow-hidden')
        },
    })

    if (introLabel) {
        timeline.fromTo(
            introLabel,
            {
                opacity: 0,
                y: 6,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.65,
            }
        )
    }

    if (introLine) {
        timeline.to(
            introLine,
            {
                width: 'clamp(60px, 12vw, 100px)',
                duration: 0.7,
                ease: 'power2.inOut',
            },
            '-=0.25'
        )
    }

    if (introWords.length) {
        timeline.fromTo(
            introWords,
            {
                opacity: 0,
                y: 14,
                filter: 'blur(8px)',
            },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: INTRO.revealDuration,
                stagger: INTRO.revealStagger,
                ease: 'power2.out',
            },
            '-=0.3'
        )
    }

    timeline.to({}, {
        duration: INTRO.holdDuration,
    })

    if (introWords.length) {
        timeline.to(introWords, {
            opacity: 0,
            y: -6,
            filter: 'blur(6px)',
            duration: INTRO.fadeDuration,
            stagger: {
                each: INTRO.fadeStagger,
                from: 'random',
            },
            ease: 'sine.inOut',
        })
    }

    const outroElements = [introLabel, introLine].filter(Boolean)

    if (outroElements.length) {
        timeline.to(
            outroElements,
            {
                opacity: 0,
                duration: 0.8,
                ease: 'power1.out',
            },
            '-=0.15'
        )
    }

    timeline.to(
        intro,
        {
            opacity: 0,
            filter: 'blur(20px)',
            scale: 1.05,
            duration: INTRO.exitDuration,
            ease: 'sine.inOut',
        },
        '-=0.3'
    )
}

// ========================================
// INITIALIZE
// ========================================

async function init() {
    if (document.fonts?.ready) {
        await document.fonts.ready
    }

    // Prepare hero characters before the intro begins.
    initHero()

    // Attach observers before starting the intro timeline.
    initHeroReveal()

    animateIntroBackground()
    startIntro()
}

if (document.readyState === 'complete') {
    init()
} else {
    window.addEventListener('load', init, {
        once: true,
    })
}
