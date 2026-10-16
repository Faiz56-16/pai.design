
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const media = gsap.matchMedia()

media.add(
    {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        motion: '(prefers-reduced-motion: no-preference)',
    },
    (context) => {
        const { reduceMotion } = context.conditions

        const animatedElements = gsap.utils.toArray(
            '.solution-reveal, .solution-item, .solution-action, .solution-warning'
        )

        if (reduceMotion) {
            gsap.set(animatedElements, {
                autoAlpha: 1,
                clearProps: 'transform',
            })

            return
        }

        // HEADER DAN SUBHEADING
        gsap.utils.toArray('.solution-reveal').forEach((element) => {
            gsap.fromTo(
                element,
                {
                    y: 28,
                    autoAlpha: 0,
                },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        })

        // SOLUSI YANG DISARANKAN
        gsap.utils.toArray('.solution-item').forEach((element, index) => {
            gsap.fromTo(
                element,
                {
                    y: 24,
                    autoAlpha: 0,
                },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.7,
                    delay: (index % 3) * 0.06,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 91%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        })

        // KARTU AKSI NYATA
        gsap.utils.toArray('.solution-action').forEach((element) => {
            gsap.fromTo(
                element,
                {
                    y: 28,
                    autoAlpha: 0,
                },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.75,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        })

        // HAL YANG HARUS DIHINDARI
        gsap.utils.toArray('.solution-warning').forEach((element, index) => {
            gsap.fromTo(
                element,
                {
                    x: -16,
                    autoAlpha: 0,
                },
                {
                    x: 0,
                    autoAlpha: 1,
                    duration: 0.65,
                    delay: (index % 2) * 0.05,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 91%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        })

        // HOVER KARTU AKSI — DESKTOP
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            gsap.utils.toArray('.solution-action').forEach((element) => {
                const hoverIn = () => {
                    gsap.to(element, {
                        y: -4,
                        duration: 0.25,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    })
                }

                const hoverOut = () => {
                    gsap.to(element, {
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    })
                }

                element.addEventListener('mouseenter', hoverIn)
                element.addEventListener('mouseleave', hoverOut)

                // Lepas listener saat media query dibersihkan
                context.add(() => {
                    element.removeEventListener('mouseenter', hoverIn)
                    element.removeEventListener('mouseleave', hoverOut)
                })
            })
        }

        requestAnimationFrame(() => {
            ScrollTrigger.refresh()
        })
    }
)

window.addEventListener(
    'load',
    () => {
        ScrollTrigger.refresh()
    },
    { once: true }
)

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        media.revert()
    })
}


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
