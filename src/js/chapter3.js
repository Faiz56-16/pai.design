
import '../style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

/* =========================================================
   1. LENIS SMOOTH SCROLL
========================================================= */

const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches

if (!prefersReducedMotion) {
    const lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    window.lenis = lenis
}

// ======================================
// ALTERNATING SCROLL TITLE REVEAL
// ======================================

gsap.utils.toArray('.value-title').forEach((title, index) => {
    const fromLeft = index % 2 === 0

    gsap.fromTo(
        title,
        {
            x: fromLeft ? -180 : 180,
            autoAlpha: 0,
            filter: 'blur(8px)'
        },
        {
            x: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            }
        }
    )
})

const menuButton = document.getElementById('chapter-menu-button')
const chapterMenu = document.getElementById('chapter-menu')

if (menuButton && chapterMenu) {
    function setMenuOpen(open) {
        chapterMenu.classList.toggle('is-open', open)
        menuButton.classList.toggle('is-open', open)

        menuButton.setAttribute('aria-expanded', String(open))
    }

    menuButton.addEventListener('click', () => {
        const isOpen = chapterMenu.classList.contains('is-open')

        setMenuOpen(!isOpen)
    })

    document.addEventListener('click', (event) => {
        if (
            !chapterMenu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            setMenuOpen(false)
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuOpen(false)
        }
    })

    chapterMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            setMenuOpen(false)
        })
    })
}

/* =========================================================
   7. REFRESH SCROLLTRIGGER AFTER PAGE LOAD
========================================================= */

window.addEventListener('load', () => {
    ScrollTrigger.refresh()
})

if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
    })
}

// ======================================
// HOVER IMAGE TYPOGRAPHY
// ======================================

const hoverItems = gsap.utils.toArray('.hover-menu-item')

hoverItems.forEach((item, index) => {
    const title = item.querySelector('.menu-title')
    const imageWrap = item.querySelector('.menu-image-wrap')
    const image = item.querySelector('.menu-image')
    const words = title.querySelectorAll(':scope > span:not(.menu-image-wrap)')

    // Initial state
    gsap.set(imageWrap, {
        width: 0,
        autoAlpha: 0,
        scale: 0.65,
        rotate: -8,
        transformOrigin: 'center center'
    })

    gsap.set(image, {
        scale: 1.5,
        xPercent: -8
    })

    gsap.set(words, {
        x: 0,
        color: '#eeeeee'
    })

    const hoverTimeline = gsap.timeline({
        paused: true,
        defaults: {
            ease: 'power4.out'
        }
    })

    hoverTimeline
        .to(imageWrap, {
            width: '1.25em',
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 0.65
        }, 0)

        .to(image, {
            scale: 1,
            xPercent: 0,
            duration: 0.9,
            ease: 'power3.out'
        }, 0)

        .to(words, {
            color: '#a8c8b8',
            duration: 0.4,
            stagger: 0.04
        }, 0)

        .fromTo(title, {
            y: 8
        }, {
            y: 0,
            duration: 0.5
        }, 0)

    item.addEventListener('mouseenter', () => {
        hoverTimeline.play()
    })

    item.addEventListener('mouseleave', () => {
        hoverTimeline.reverse()
    })

    // Slight image movement with pointer
    item.addEventListener('mousemove', (event) => {
        const rect = item.getBoundingClientRect()
        const position = (event.clientX - rect.left) / rect.width - 0.5

        gsap.to(image, {
            x: position * 18,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: true
        })
    })

    item.addEventListener('mouseleave', () => {
        gsap.to(image, {
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: true
        })
    })
})