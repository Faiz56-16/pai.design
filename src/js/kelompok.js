
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

/* =========================================================
   2. HELPER: SPLIT TEXT INTO WORDS
========================================================= */

function splitWords(el, { mask = false } = {}) {
    const words = []

    const walk = (node) => {
        Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment()

                child.textContent.split(/(\s+)/).forEach((part) => {
                    if (!part) return

                    if (/^\s+$/.test(part)) {
                        frag.appendChild(document.createTextNode(part))
                        return
                    }

                    const word = document.createElement('span')

                    word.textContent = part
                    word.style.display = 'inline-block'
                    word.style.willChange = 'transform, opacity'

                    if (mask) {
                        const box = document.createElement('span')

                        box.style.cssText =
                            'display:inline-block;overflow:hidden;vertical-align:top;padding:.12em 0;margin:-.12em 0;'

                        box.appendChild(word)
                        frag.appendChild(box)
                    } else {
                        frag.appendChild(word)
                    }

                    words.push(word)
                })

                child.replaceWith(frag)
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                walk(child)
            }
        })
    }

    walk(el)

    return words
}

/* =========================================================
   3. SCROLL PROGRESS BAR
========================================================= */

const progressBar = document.querySelector('#scroll-progress')

if (progressBar) {
    gsap.set(progressBar, {
        scaleX: 0,
        transformOrigin: 'left center'
    })

    gsap.to(progressBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'max',
            scrub: 0.3
        }
    })
}

/* =========================================================
   4. TEXT ANIMATION + PARALLAX
========================================================= */

const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {

    /* HERO TITLE */

    const heroTitle = document.querySelector('.gsap-hero')

    if (heroTitle) {
        const heroWords = splitWords(heroTitle, { mask: true })

        gsap.set(heroWords, {
            yPercent: 115
        })

        gsap.to(heroWords, {
            yPercent: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.12,
            delay: 0.2
        })

        gsap.to(heroTitle, {
            y: -80,
            ease: 'none',
            scrollTrigger: {
                trigger: '#section-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        })
    }

    /* VIDEO + FACTS TEXT */

    gsap.utils.toArray('.gsap-video-text p').forEach((p) => {
        const words = splitWords(p)

        gsap.fromTo(
            words,
            { opacity: 0.15 },
            {
                opacity: 1,
                ease: 'none',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: p,
                    start: 'top 85%',
                    end: 'bottom 55%',
                    scrub: true
                }
            }
        )
    })

    /* FACTS LABEL */

    const factsLabel = document.querySelector('#section-facts h2')

    if (factsLabel) {
        gsap.from(factsLabel, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: factsLabel,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        })
    }

    /* WHY IT MATTERS */

    const whyText = document.querySelector('.gsap-why-text')

    if (whyText) {
        const whyWords = splitWords(whyText, { mask: true })

        gsap.set(whyWords, {
            yPercent: 110
        })

        gsap.to(whyWords, {
            yPercent: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.03,
            scrollTrigger: {
                trigger: whyText,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        })
    }

    /* IMAGE PARALLAX */

    gsap.utils.toArray('#section-video img').forEach((img, i) => {
        const frame = img.parentElement

        if (!frame) return

        let inner = img.closest('[data-parallax-inner]')

        if (!inner) {
            inner = document.createElement('div')
            inner.setAttribute('data-parallax-inner', '')

            frame.insertBefore(inner, img)
            inner.appendChild(img)
        }

        const range = 8
        const direction = i % 2 === 0 ? 1 : -1

        gsap.set(inner, {
            scale: 1.2
        })

        gsap.fromTo(
            inner,
            {
                yPercent: -range * direction
            },
            {
                yPercent: range * direction,
                ease: 'none',
                scrollTrigger: {
                    trigger: frame,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true
                }
            }
        )
    })
})

/* =========================================================
   5. EXPANDING CARD + INNER CARD NAVIGATION
========================================================= */

const section = document.querySelector('#card-section')
const outerCard = document.querySelector('#expand-card')
const introLayer = document.querySelector('#intro-layer')
const innerStage = document.querySelector('#inner-card-stage')
const viewport = document.querySelector('#card-viewport')

const innerCards = gsap.utils.toArray('[data-inner-card]')
const listItems = gsap.utils.toArray('[data-list-item]')

const counter = document.querySelector('#inner-card-counter')
const desc = document.querySelector('#inner-desc')
const ticksLeft = document.querySelector('#ticks-left')
const ticksRight = document.querySelector('#ticks-right')

const RED = '#d93a12'
const TICK_COUNT = 22

function buildTicks(el, side) {
    if (!el) return []

    el.innerHTML = ''

    return Array.from({ length: TICK_COUNT }, () => {
        const tick = document.createElement('div')

        tick.style.cssText = `
            height: 1px;
            width: 18px;
            margin: 5px 0;
            background: #bbb;
            ${side === 'right' ? 'margin-left: auto;' : ''}
        `

        el.appendChild(tick)

        return tick
    })
}

if (
    section &&
    outerCard &&
    innerStage &&
    viewport &&
    innerCards.length
) {
    const total = innerCards.length

    const ticksL = buildTicks(ticksLeft, 'left')
    const ticksR = buildTicks(ticksRight, 'right')

    const cardMM = gsap.matchMedia()

    cardMM.add(
        {
            desktop: '(min-width: 640px)',
            mobile: '(max-width: 639px)'
        },
        (context) => {
            const isDesktop = context.conditions.desktop

            const step = () =>
                viewport.offsetHeight + (isDesktop ? 50 : 30)

            const state = { p: 0 }
            let activeIndex = -1

            /* UPDATE ACTIVE CARD INFO */

            function setActive(i) {
                i = gsap.utils.clamp(0, total - 1, i)

                if (i === activeIndex) return

                activeIndex = i

                if (counter) {
                    counter.textContent =
                        `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
                }

                if (desc) {
                    desc.textContent = innerCards[i].dataset.desc || ''
                }

                listItems.forEach((item, idx) => {
                    item.style.color = idx === i ? RED : '#777'
                })

                const tickIdx = total > 1
                    ? Math.round((i / (total - 1)) * (TICK_COUNT - 1))
                    : 0

                ;[ticksL, ticksR].forEach((ticks) => {
                    ticks.forEach((tick, idx) => {
                        const active = idx === tickIdx

                        tick.style.background = active ? RED : '#bbb'
                        tick.style.width = active ? '38px' : '18px'
                    })
                })
            }

            /* POSITION INNER CARDS IN ORDER */

            function render() {
                const s = step()

                innerCards.forEach((card, i) => {
                    const dist = i - state.p
                    const abs = Math.min(Math.abs(dist), 1)

                    gsap.set(card, {
                        y: dist * s,
                        autoAlpha: 1 - abs * 0.7,
                        scale: 1 - abs * 0.04,
                        zIndex: abs < 0.5 ? 2 : 1
                    })
                })

                setActive(Math.round(state.p))
            }

            /* HIDE INNER CARDS BEFORE EXPANSION */

            gsap.set(innerStage, {
                autoAlpha: 0
            })

            render()

            /* MAIN SCROLL TIMELINE */

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (total + 1)}`,
                    pin: true,
                    scrub: 0.7,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            })

            /* PHASE 1: EXPAND OUTER CARD */

            tl.to(outerCard, {
                width: '100vw',
                height: '100svh',
                borderRadius: 0,
                padding: isDesktop ? '3rem' : '1.5rem',
                duration: 1,
                ease: 'none'
            })

            /* FADE OUT INTRO */

            if (introLayer) {
                tl.to(
                    introLayer,
                    {
                        autoAlpha: 0,
                        duration: 0.25,
                        ease: 'none'
                    },
                    0.75
                )
            }

            /* SHOW INNER CARD STAGE AFTER EXPANSION */

            tl.to(
                innerStage,
                {
                    autoAlpha: 1,
                    duration: 0.25,
                    ease: 'none'
                },
                1
            )

            /* PHASE 2: MOVE THROUGH INNER CARDS */

            for (let i = 1; i < total; i++) {
                tl.to(state, {
                    p: i,
                    duration: 0.8,
                    ease: 'none',
                    onUpdate: render
                })

                tl.to({}, {
                    duration: 0.4
                })
            }

            return () => {
                tl.scrollTrigger?.kill()
                tl.kill()
            }
        }
    )
}

/* =========================================================
   6. CHAPTER NAVIGATION MENU
========================================================= */

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


