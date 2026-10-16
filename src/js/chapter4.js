import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==========================================
// CHAPTER 4 — QUIZ, REFLECTION & ANIMATIONS
// ==========================================

// ----- GSAP REVEAL -----

gsap.utils.toArray('.quiz-reveal, .reflection-reveal, .decision-reveal, .quiz-card, .reflection-card').forEach((element) => {
    gsap.fromTo(element, {
        y: 55,
        autoAlpha: 0
    }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
        }
    })
})

// ----- STYLE OPTIONS WITH GSAP -----

document.querySelectorAll('.quiz-option').forEach((button) => {
    gsap.set(button, {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        width: '100%',
        padding: '15px 16px',
        border: '1px solid rgba(36,40,32,0.15)',
        color: '#242820',
        backgroundColor: 'transparent',
        cursor: 'pointer'
    })

    const letter = button.querySelector('.option-letter')

    if (letter) {
        gsap.set(letter, {
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            border: '1px solid rgba(36,40,32,0.2)',
            fontSize: '12px',
            color: '#58745d'
        })
    }

    button.addEventListener('mouseenter', () => {
        if (button.disabled) return

        gsap.to(button, {
            borderColor: '#78977c',
            backgroundColor: 'rgba(120,151,124,0.08)',
            x: 5,
            duration: 0.25,
            overwrite: true
        })
    })

    button.addEventListener('mouseleave', () => {
        if (button.dataset.selected === 'true') return

        gsap.to(button, {
            borderColor: 'rgba(36,40,32,0.15)',
            backgroundColor: 'transparent',
            x: 0,
            duration: 0.25,
            overwrite: true
        })
    })
})

// ----- QUIZ LOGIC -----

const quizForm = document.querySelector('#quiz-form')
const quizCards = gsap.utils.toArray('.quiz-card')
const quizCounter = document.querySelector('#quiz-counter')
const quizProgress = document.querySelector('#quiz-progress')
const quizMessage = document.querySelector('#quiz-message')
const quizResult = document.querySelector('#quiz-result')
const quizScore = document.querySelector('#quiz-score')
const quizResultLabel = document.querySelector('#quiz-result-label')
const quizResultDescription = document.querySelector('#quiz-result-description')
const quizSubmit = document.querySelector('#quiz-submit')
const quizRetry = document.querySelector('#quiz-retry')

const answerExplanations = [
    'Tabayyun mengajarkan kita memeriksa kebenaran berita dan konteksnya sebelum mempercayai atau menyebarkannya.',
    'Tabayyun berarti memeriksa dan memastikan informasi agar kita tidak menyebarkan kabar yang keliru.',
    'Perbedaan pendapat sebaiknya disikapi dengan santun, argumen yang jelas, dan fokus pada isi pembahasan.',
    'Ayat ini mengingatkan kita untuk menjauhi olok-olok, celaan, prasangka buruk, dan gunjingan.',
    'Tanggung jawab berarti meluruskan informasi yang salah, menghentikan penyebarannya, dan meminta maaf jika ada pihak yang dirugikan.'
]

const answers = {}
let quizFinished = false

function updateQuizProgress() {
    const answered = Object.keys(answers).length
    const percentage = (answered / quizCards.length) * 100

    quizCounter.textContent = `${answered} dari ${quizCards.length} dijawab`

    gsap.to(quizProgress, {
        width: `${percentage}%`,
        duration: 0.5,
        ease: 'power2.out'
    })

    quizMessage.textContent = answered === quizCards.length
        ? 'Semua pertanyaan sudah dijawab. Siap periksa hasilmu?'
        : 'Jawab semua pertanyaan untuk melihat hasilmu.'
}

quizCards.forEach((card) => {
    const questionIndex = Number(card.dataset.question)
    const options = card.querySelectorAll('.quiz-option')

    options.forEach((button) => {
        button.addEventListener('click', () => {
            if (quizFinished) return

            const choice = button.dataset.option
            answers[questionIndex] = choice

            options.forEach((option) => {
                option.dataset.selected = 'false'

                gsap.to(option, {
                    borderColor: 'rgba(36,40,32,0.15)',
                    backgroundColor: 'transparent',
                    x: 0,
                    duration: 0.2
                })

                gsap.to(option.querySelector('.option-letter'), {
                    backgroundColor: 'transparent',
                    color: '#58745d',
                    borderColor: 'rgba(36,40,32,0.2)',
                    duration: 0.2
                })
            })

            button.dataset.selected = 'true'

            gsap.to(button, {
                borderColor: '#78977c',
                backgroundColor: 'rgba(120,151,124,0.13)',
                x: 5,
                duration: 0.3,
                ease: 'power2.out'
            })

            gsap.to(button.querySelector('.option-letter'), {
                backgroundColor: '#78977c',
                color: '#ffffff',
                borderColor: '#78977c',
                duration: 0.3
            })

            updateQuizProgress()
        })
    })
})

quizForm.addEventListener('submit', (event) => {
    event.preventDefault()

    if (quizFinished) return

    if (Object.keys(answers).length !== quizCards.length) {
        quizMessage.textContent = 'Masih ada pertanyaan yang belum dijawab.'

        const unanswered = quizCards.filter(
            card => answers[Number(card.dataset.question)] === undefined
        )

        if (unanswered.length) {
            gsap.to(unanswered, {
                x: 7,
                duration: 0.08,
                repeat: 3,
                yoyo: true,
                onComplete: () => gsap.set(unanswered, { x: 0 })
            })

            unanswered[0].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }

        return
    }

    quizFinished = true

    let score = 0

    quizCards.forEach((card) => {
        const index = Number(card.dataset.question)
        const correctAnswer = card.dataset.correct
        const selectedAnswer = answers[index]
        const feedback = card.querySelector('.question-feedback')
        const isCorrect = selectedAnswer === correctAnswer

        if (isCorrect) score++

        feedback.classList.remove('hidden')
        feedback.textContent = `${isCorrect ? 'Benar!' : `Jawaban yang tepat: ${correctAnswer}.`} ${answerExplanations[index]}`
        feedback.style.color = isCorrect ? '#426c4a' : '#9b5144'

        card.querySelectorAll('.quiz-option').forEach((button) => {
            button.disabled = true

            if (button.dataset.option === correctAnswer) {
                gsap.to(button, {
                    borderColor: '#78977c',
                    backgroundColor: 'rgba(120,151,124,0.12)',
                    duration: 0.35
                })
            } else if (button.dataset.selected === 'true') {
                gsap.to(button, {
                    borderColor: '#b8796b',
                    backgroundColor: 'rgba(184,121,107,0.1)',
                    duration: 0.35
                })
            }
        })

        gsap.fromTo(feedback, {
            y: 12,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power2.out'
        })
    })

    quizScore.textContent = `${score}/5`

    const percentage = score * 20

    if (score === 5) {
        quizResultLabel.textContent = 'Sempurna — pemahamanmu kuat.'
        quizResultDescription.textContent = 'Kamu berhasil menjawab semua soal dengan benar. Terus terapkan tabayyun dan akhlak yang baik dalam kehidupan sehari-hari.'
    } else if (score >= 3) {
        quizResultLabel.textContent = `${percentage}% — pemahamanmu cukup baik.`
        quizResultDescription.textContent = 'Kamu sudah memahami sebagian besar materi. Baca kembali pembahasan pada jawaban yang belum tepat agar semakin terbiasa menyikapi informasi dengan bijak.'
    } else {
        quizResultLabel.textContent = `${percentage}% — saatnya belajar kembali.`
        quizResultDescription.textContent = 'Tidak apa-apa, proses belajar memang bertahap. Pelajari kembali pembahasan tiap soal, khususnya tabayyun, akhlak, dan tanggung jawab saat berbagi informasi.'
    }

    quizSubmit.disabled = true
    quizSubmit.classList.add('opacity-50', 'cursor-not-allowed')

    quizResult.classList.remove('hidden')

    gsap.fromTo(quizResult, {
        y: 35,
        autoAlpha: 0
    }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power3.out'
    })

    quizResult.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
})

quizRetry.addEventListener('click', () => {
    quizFinished = false

    Object.keys(answers).forEach(key => delete answers[key])

    quizCards.forEach((card) => {
        const feedback = card.querySelector('.question-feedback')
        feedback.classList.add('hidden')
        feedback.textContent = ''

        card.querySelectorAll('.quiz-option').forEach((button) => {
            button.disabled = false
            button.dataset.selected = 'false'

            gsap.to(button, {
                borderColor: 'rgba(36,40,32,0.15)',
                backgroundColor: 'transparent',
                x: 0,
                duration: 0.2
            })

            gsap.to(button.querySelector('.option-letter'), {
                backgroundColor: 'transparent',
                color: '#58745d',
                borderColor: 'rgba(36,40,32,0.2)',
                duration: 0.2
            })
        })
    })

    quizSubmit.disabled = false
    quizSubmit.classList.remove('opacity-50', 'cursor-not-allowed')
    quizResult.classList.add('hidden')

    updateQuizProgress()

    document.querySelector('#quiz-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
})

updateQuizProgress()

// ----- DECISION ACTIVITY -----

const decisionOptions = gsap.utils.toArray('.decision-option')
const decisionFeedback = document.querySelector('#decision-feedback')
const decisionFeedbackTitle = document.querySelector('#decision-feedback-title')
const decisionFeedbackText = document.querySelector('#decision-feedback-text')

const decisionMessages = {
    1: {
        title: 'Pilihan yang bertanggung jawab.',
        text: 'Memeriksa sumber sebelum menyebarkan informasi mencerminkan tabayyun. Tindakan ini mengurangi risiko fitnah, menjaga kehormatan orang lain, dan menunjukkan akhlak yang baik.'
    },
    2: {
        title: 'Pertimbangkan kembali keputusan ini.',
        text: 'Membagikan pesan tanpa memeriksa kebenarannya dapat memperluas informasi keliru dan merugikan orang lain. Berhenti sejenak dan lakukan tabayyun terlebih dahulu.'
    },
    3: {
        title: 'Pilih cara yang lebih santun.',
        text: 'Menyerang pengirim dapat memperburuk keadaan. Jika ada masalah, periksa fakta dan sampaikan keberatan dengan santun tanpa menghina atau mempermalukan orang lain.'
    }
}

decisionOptions.forEach((button) => {
    button.addEventListener('click', () => {
        const choice = button.dataset.decision
        const message = decisionMessages[choice]

        decisionOptions.forEach((option) => {
            gsap.to(option, {
                borderColor: option === button ? '#78977c' : 'rgba(36,40,32,0.2)',
                backgroundColor: option === button
                    ? 'rgba(120,151,124,0.12)'
                    : 'transparent',
                y: option === button ? -4 : 0,
                duration: 0.3,
                ease: 'power2.out'
            })
        })

        decisionFeedbackTitle.textContent = message.title
        decisionFeedbackText.textContent = message.text
        decisionFeedback.classList.remove('hidden')

        gsap.fromTo(decisionFeedback, {
            y: 18,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power3.out'
        })
    })
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

// ----- COPY REFLECTIONS -----

const saveReflection = document.querySelector('#save-reflection')
const saveMessage = document.querySelector('#save-message')

saveReflection.addEventListener('click', async () => {
    const reflections = [...document.querySelectorAll('.reflection-input')]
        .map((input, index) => `Refleksi ${index + 1}:\n${input.value.trim() || '(Belum diisi)'}`)
        .join('\n\n')

    const decision = document.querySelector('#decision-reason').value.trim()

    const selectedDecision = document.querySelector('.decision-option[style*="rgb(120, 151, 124)"]')

    const decisionLabel = selectedDecision
        ? selectedDecision.innerText.trim().replace(/\s+/g, ' ')
        : 'Belum memilih tindakan'

    const content = [
        'REFLEKSI PEMBELAJARAN PAI',
        '',
        'HASIL KUIS',
        `Skor: ${quizFinished ? quizScore.textContent : 'Kuis belum diselesaikan'}`,
        '',
        reflections,
        '',
        'AKTIVITAS KEPUTUSAN',
        `Pilihan: ${decisionLabel}`,
        `Alasan: ${decision || '(Belum diisi)'}`
    ].join('\n')

    try {
        await navigator.clipboard.writeText(content)
        saveMessage.textContent = 'Refleksi berhasil disalin. Kamu bisa menempelkannya ke dokumen untuk disimpan.'
    } catch {
        const temporary = document.createElement('textarea')
        temporary.value = content
        temporary.style.position = 'fixed'
        temporary.style.opacity = '0'
        document.body.appendChild(temporary)
        temporary.select()

        const copied = document.execCommand('copy')
        temporary.remove()

        saveMessage.textContent = copied
            ? 'Refleksi berhasil disalin.'
            : 'Penyalinan otomatis gagal. Silakan salin jawabanmu secara manual.'
    }

    gsap.fromTo(saveMessage, {
        y: 8,
        autoAlpha: 0
    }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.4
    })
})

// Refresh ScrollTrigger setelah halaman dan font siap
window.addEventListener('load', () => {
    ScrollTrigger.refresh()
})