import gsap from 'gsap'

const STORAGE_KEY = 'chapterTransitionPending'

const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches

function initChapterTransition() {
    const overlay = document.querySelector('#chapter-transition')

    if (!overlay) {
        console.warn('[Chapter Transition] Panel tidak ditemukan.')
        return
    }

    const roman = overlay.querySelector('.chapter-number')
    const label = overlay.querySelector('.chapter-label')
    const title = overlay.querySelector('.chapter-title')
    const line = overlay.querySelector('.chapter-line')

    if (!roman || !label || !title || !line) {
        console.error(
            '[Chapter Transition] Elemen angka, label, judul, atau garis tidak ditemukan.'
        )
        return
    }

    let transitioning = false
    let pending = false

    try {
        pending = sessionStorage.getItem(STORAGE_KEY) === '1'
        sessionStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.warn(
            '[Chapter Transition] sessionStorage tidak tersedia.',
            error
        )
    }

    // =========================================
    // HIDE PANEL
    // =========================================
  function hideOverlay() {
    gsap.set(overlay, {
        yPercent: 100,
        autoAlpha: 0,
        pointerEvents: 'none'
    })
}

    // =========================================
    // SET CHAPTER CONTENT
    // =========================================
    function setChapter(chapter, chapterTitle) {
        roman.textContent = chapter
        label.textContent = `CHAPTER / ${chapter}`
        title.textContent = chapterTitle

        gsap.set(line, {
            width: 0
        })
    }

    // =========================================
    // PAGE ARRIVAL TRANSITION
    // =========================================
  if (pending && !reducedMotion) {
    gsap.set(overlay, {
        yPercent: 0,
        autoAlpha: 1,
        pointerEvents: 'auto'
    })

    gsap.set([roman, label, title], {
        autoAlpha: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)'
    })

    gsap.set(line, {
        width: 'clamp(45px, 6vw, 80px)'
    })

    gsap.to(overlay, {
        yPercent: -100,
        duration: 1.4,
        ease: 'power3.inOut',
        onComplete: hideOverlay
    })
} else {
    hideOverlay()
}

    // =========================================
    // LINK TRANSITION
    // =========================================
    document
        .querySelectorAll('a[data-chapter-transition]')
        .forEach((link) => {
            link.addEventListener('click', (event) => {
                // Biarkan perilaku browser normal untuk klik khusus.
                if (
                    event.defaultPrevented ||
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    (link.target && link.target !== '_self') ||
                    link.hasAttribute('download')
                ) {
                    return
                }

                if (transitioning || reducedMotion) return

                const destination = new URL(
                    link.href,
                    window.location.href
                )

                // Jangan animasikan link eksternal.
                if (destination.origin !== window.location.origin) return

                // Abaikan link ke halaman yang sama.
                if (
                    destination.pathname === window.location.pathname &&
                    destination.search === window.location.search
                ) {
                    return
                }

                event.preventDefault()
                transitioning = true

                const chapter = link.dataset.chapter || 'I'

                const chapterTitle =
                    link.dataset.chapterTitle ||
                    link.getAttribute('aria-label') ||
                    link.textContent.trim()

                setChapter(chapter, chapterTitle)

                gsap.killTweensOf([
                    overlay,
                    roman,
                    label,
                    title,
                    line
                ])

                // Panel mulai di luar layar bagian bawah.
                gsap.set(overlay, {
                    yPercent: 100,
                    autoAlpha: 1,
                    visibility: 'visible',
                    pointerEvents: 'auto'
                })

                // Posisi awal elemen teks.
                gsap.set(roman, {
                    autoAlpha: 0,
                    y: 22,
                    filter: 'blur(8px)'
                })

                gsap.set(label, {
                    autoAlpha: 0,
                    x: 12
                })

                gsap.set(title, {
                    autoAlpha: 0,
                    x: 40,
                    filter: 'blur(8px)'
                })

                gsap.set(line, {
                    width: 0
                })

                // =================================
                // SMOOTH TIMELINE
                // =================================
                const timeline = gsap.timeline({
                    defaults: {
                        ease: 'power3.out'
                    },

                    onComplete() {
                        try {
                            sessionStorage.setItem(STORAGE_KEY, '1')
                        } catch (error) {
                            console.warn(
                                '[Chapter Transition] Gagal menyimpan state.',
                                error
                            )
                        }

                        window.location.assign(destination.href)
                    }
                })

                // Panel menutup halaman lama.
                timeline.to(overlay, {
                    yPercent: 0,
                    duration: 1.15,
                    ease: 'power3.inOut'
                })

                // Angka chapter muncul.
                timeline.to(roman, {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.9
                }, '-=0.3')

                // Label muncul.
                timeline.to(label, {
                    autoAlpha: 1,
                    x: 0,
                    duration: 0.7
                }, '-=0.35')

                // Judul bergerak dari kanan.
                timeline.to(title, {
                    autoAlpha: 1,
                    x: 0,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power3.out'
                }, '-=0.2')

                // Garis memanjang.
                timeline.to(line, {
                    width: 'clamp(45px, 6vw, 80px)',
                    duration: 0.7
                }, '-=0.3')

                // Beri jeda sebelum pindah halaman.
                timeline.to({}, {
                    duration: 0.4
                })
            })
        })
}

// =============================================
// INITIALIZE
// =============================================
if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initChapterTransition,
        { once: true }
    )
} else {
    initChapterTransition()
}