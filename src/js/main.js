import '../style.css'
import gsap from 'gsap'

// ========================================
// ELEMENTS
// ========================================

const intro = document.querySelector('#intro')
const introTitle = document.querySelector('#intro-title')
const introLabel = document.querySelector('#intro-label')
const introLine = document.querySelector('#intro-line')
const grain = document.querySelector('#grain-turbulence')
const gradient = document.querySelector('.intro-gradient')

const glowOne = document.querySelector('.glow-one')
const glowTwo = document.querySelector('.glow-two')

// ========================================
// SETTINGS
// ========================================

const SETTINGS = {
    words: (
        'Setiap perjalanan dimulai dari sebuah makna, ' +
        'dan makna itu tumbuh perlahan dalam setiap langkah ' +
        'yang kita pilih dengan sepenuh hati.'
    ).split(' '),

    // how many words at the end get the italic green accent
    accentCount: 3,

    revealDuration: 1.3,
    revealStagger: 0.15,
    holdDuration: 1.8,

    fadeDuration: 1.6,
    fadeStagger: 0.17,
    exitDuration: 1.6,
}

const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches

// ========================================
// CREATE WORDS
// ========================================

const words = SETTINGS.words.map((word, index) => {
    const span = document.createElement('span')

    // no "intro-word" class on purpose, so old CSS can't affect it
    span.textContent = word
    span.style.display = 'inline-block'
    span.style.margin = '0'
    span.style.padding = '0'
    span.style.willChange = 'opacity, transform, filter'

    if (index >= SETTINGS.words.length - SETTINGS.accentCount) {
        span.style.color = '#c3c9a6'
        span.style.fontStyle = 'italic'
    } else {
        span.style.color = '#eeeeee'
    }

    introTitle.appendChild(span)

    // normal single space between words
    if (index < SETTINGS.words.length - 1) {
        introTitle.appendChild(document.createTextNode(' '))
    }

    return span
})
// ========================================
// BACKGROUND ANIMATION
// ========================================

function animateBackground() {
    if (reducedMotion) return

    // Gradient bergerak perlahan dari cokelat ke moss green
    gsap.to(gradient, {
        backgroundPosition: '100% 50%',
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    })

    // Cahaya bergerak independen dari gradient
    gsap.to(glowOne, {
        x: '18vw',
        y: '12vh',
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    })

    gsap.to(glowTwo, {
        x: '-15vw',
        y: '-10vh',
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    })

    // Grain berubah terus, bukan tekstur statis
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
// INTRO TIMELINE
// ========================================
function startIntro() {
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

    // 1. Label muncul dengan lembut
    timeline.fromTo(
        introLabel,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.65 }
    )

    // 2. Garis terbentuk
    timeline.to(
        introLine,
        {
            width: 'clamp(60px, 12vw, 100px)',
            duration: 0.7,
            ease: 'power2.inOut',
        },
        '-=0.25'
    )

    // 3. Kata muncul perlahan satu per satu
    timeline.fromTo(
        words,
        { opacity: 0, y: 14, filter: 'blur(8px)' },
        {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: SETTINGS.revealDuration,
            stagger: SETTINGS.revealStagger,
            ease: 'power2.out',
        },
        '-=0.3'
    )

    // 4. Waktu untuk membaca kutipan
    timeline.to({}, {
        duration: SETTINGS.holdDuration,
    })

    // 5. Kata larut perlahan satu per satu dengan urutan acak
    timeline.to(words, {
        opacity: 0,
        y: -6,
        filter: 'blur(6px)',
        duration: SETTINGS.fadeDuration,
        stagger: {
            each: SETTINGS.fadeStagger,
            from: 'random',
        },
        ease: 'sine.inOut',
    })

    // 6. Label dan garis ikut memudar
    timeline.to(
        [introLabel, introLine],
        {
            opacity: 0,
            duration: 0.8,
            ease: 'power1.out',
        },
        '-=0.15'
    )

    // 7. EFEK BLUR SEAMLESS: Container intro blur & fade out perlahan
    timeline.to(intro, {
        opacity: 0,
        filter: 'blur(20px)',
        scale: 1.05, // Efek zoom halus agar transisi terasa sangat seamless
        duration: SETTINGS.exitDuration,
        ease: 'sine.inOut',
    }, '-=0.3') // Dimulai sedikit lebih awal sebelum animasi kata benar-benar selesai
}

// ========================================
// START AFTER FONT LOAD
// ========================================

async function init() {
    if (document.fonts?.ready) {
        await document.fonts.ready
    }

    animateBackground()
    startIntro()
}

window.addEventListener('load', init, { once: true })