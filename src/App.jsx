import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
    MapPin, Mail, Phone, Globe,
    Shield, Code, Wrench, Users, Award, BookOpen,
    ChevronRight, Menu, X, ExternalLink, Download, Github,
    Layers, Lock, Terminal, Database, Star, Zap
} from 'lucide-react'
import './App.css'

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

const fadeLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// ── Animated Section Wrapper ──────────────────────────────────────────────────
function Section({ id, children, className = '' }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    return (
        <motion.section
            id={id}
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className={`section ${className}`}
        >
            {children}
        </motion.section>
    )
}

// ── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle({ label, title, subtitle }) {
    return (
        <motion.div variants={fadeUp} className="section-title-block">
            <span className="section-label">{label}</span>
            <h2 className="section-heading">{title}</h2>
            {subtitle && <p className="section-sub">{subtitle}</p>}
        </motion.div>
    )
}

// ── Navigation ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#education', label: 'Education' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#certifications', label: 'Certifications' },
    { href: '#contact', label: 'Contact' },
]

function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [active, setActive] = useState('#home')

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleNav = (href) => {
        setActive(href)
        setMobileOpen(false)
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <motion.nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <button className="nav-logo" onClick={() => handleNav('#home')}>
                <span className="logo-vg">VG</span><span className="logo-dot">.</span>
            </button>

            <ul className="nav-links desktop">
                {NAV_ITEMS.map(({ href, label }) => (
                    <li key={href}>
                        <button
                            className={`nav-link ${active === href ? 'active' : ''}`}
                            onClick={() => handleNav(href)}
                            id={`nav-${label.toLowerCase()}`}
                        >
                            {label}
                            {active === href && (
                                <motion.span className="nav-underline" layoutId="nav-underline" />
                            )}
                        </button>
                    </li>
                ))}
            </ul>

            <a
                href="https://github.com/Helly1529"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-resume-btn nav-github-btn desktop"
                id="nav-github-btn"
            >
                <Github size={15} /> GitHub
            </a>

            <button
                className="menu-toggle"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Toggle menu"
                id="menu-toggle-btn"
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {NAV_ITEMS.map(({ href, label }) => (
                            <button
                                key={href}
                                className={`mobile-nav-link ${active === href ? 'active' : ''}`}
                                onClick={() => handleNav(href)}
                            >
                                {label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

// ── Starfield Canvas ──────────────────────────────────────────────────────────
function StarfieldCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        let animId
        let stars = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initStars()
        }

        const initStars = () => {
            stars = Array.from({ length: 220 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.2,
                speed: Math.random() * 0.15 + 0.03,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleDir: Math.random() > 0.5 ? 1 : -1,
                color: ['#ffffff', '#a78bfa', '#67e8f9', '#c4b5fd'][Math.floor(Math.random() * 4)],
            }))
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            stars.forEach(s => {
                // twinkle
                s.opacity += s.twinkleSpeed * s.twinkleDir
                if (s.opacity >= 1) { s.opacity = 1; s.twinkleDir = -1 }
                if (s.opacity <= 0.05) { s.opacity = 0.05; s.twinkleDir = 1 }

                // slow drift upward
                s.y -= s.speed
                if (s.y < -2) s.y = canvas.height + 2

                ctx.save()
                ctx.globalAlpha = s.opacity
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fillStyle = s.color
                // soft glow on bigger stars
                if (s.r > 1) {
                    ctx.shadowBlur = 8
                    ctx.shadowColor = s.color
                }
                ctx.fill()
                ctx.restore()
            })
            animId = requestAnimationFrame(draw)
        }

        resize()
        draw()
        window.addEventListener('resize', resize)
        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="starfield-canvas"
            aria-hidden="true"
        />
    )
}

// ── Orbs + Grid overlay (used in hero only) ───────────────────────────────────
function OrbBackground() {
    return (
        <div className="orb-container" aria-hidden="true">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="grid-overlay" />
        </div>
    )
}


// ── Typed Text Hook ───────────────────────────────────────────────────────────
function useTyped(items, speed = 80, pause = 2000) {
    const [displayed, setDisplayed] = useState('')
    const [idx, setIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = items[idx]
        if (!deleting && charIdx < current.length) {
            const t = setTimeout(() => {
                setDisplayed(current.slice(0, charIdx + 1))
                setCharIdx(c => c + 1)
            }, speed)
            return () => clearTimeout(t)
        } else if (!deleting && charIdx >= current.length) {
            const t = setTimeout(() => setDeleting(true), pause)
            return () => clearTimeout(t)
        } else if (deleting && displayed.length > 0) {
            const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), speed / 2)
            return () => clearTimeout(t)
        } else if (deleting && displayed.length === 0) {
            setDeleting(false)
            setCharIdx(0)
            setIdx(i => (i + 1) % items.length)
        }
    }, [displayed, deleting, idx, charIdx, items, speed, pause])

    return displayed
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function Hero() {
    const typed = useTyped([
        'Cybersecurity Enthusiast',
        'Web Designer',
        'Network Security Analyst',
        'IT Graduate',
    ])

    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 0.3], [0, -80])
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

    return (
        <section id="home" className="hero">
            <OrbBackground />
            <motion.div className="hero-content" style={{ y, opacity }}>
                <motion.div
                    className="hero-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Zap size={12} />
                    <span>Available for Internships</span>
                </motion.div>

                <motion.div
                    className="hero-avatar"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3, type: 'spring', bounce: 0.3 }}
                >
                    <div className="avatar-ring" />
                    <div className="avatar-inner">VG</div>
                </motion.div>

                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    Hi, I'm{' '}
                    <span className="gradient-text">Vrushika Gajjar</span>
                </motion.h1>

                <motion.div
                    className="hero-typed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <span className="typed-text">{typed}</span>
                    <span className="cursor">|</span>
                </motion.div>

                <motion.p
                    className="hero-desc"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    A committed Cybersecurity Enthusiast &amp; Web Designer pursuing a Bachelor's in
                    Computer and Information Technology at Monroe University.
                    Passionate about secure, elegant digital experiences.
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                >
                    <button
                        className="btn btn-primary"
                        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                        id="hero-contact-btn"
                    >
                        <Mail size={16} /> Get In Touch
                    </button>
                    <div className="hero-resume-group">
                        <a
                            href="/Vrushika_Gajjar_Resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost"
                            id="hero-resume-view-btn"
                        >
                            <ExternalLink size={15} /> View Resume
                        </a>
                        <a
                            href="/Vrushika_Gajjar_Resume.pdf"
                            download="Vrushika_Gajjar_Resume.pdf"
                            className="btn btn-ghost btn-download-only"
                            id="hero-resume-download-btn"
                            title="Download"
                        >
                            <Download size={15} />
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-stats"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                >
                    {[
                        { val: '4+', label: 'Certifications' },
                        { val: '5+', label: 'Courses Taken' },
                        { val: '2026', label: 'Grad Year' },
                    ].map(s => (
                        <div className="stat-item" key={s.label}>
                            <span className="stat-val">{s.val}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
            >
                <div className="scroll-dot" />
            </motion.div>
        </section>
    )
}

// ── About Section ─────────────────────────────────────────────────────────────
function About() {
    const info = [
        { icon: <MapPin size={18} />, label: 'Location', value: 'Mount Vernon, NY 10553' },
        { icon: <Mail size={18} />, label: 'Email', value: 'gajjar.vrushikau45@gmail.com' },
        { icon: <Phone size={18} />, label: 'Phone', value: '+1 914 267 3207' },
        { icon: <Globe size={18} />, label: 'Languages', value: 'English · Hindi · Gujarati' },
    ]

    return (
        <Section id="about">
            <motion.div variants={stagger} className="about-grid">
                <motion.div variants={fadeLeft} className="about-left">
                    <SectionTitle label="01 / About" title="Who I Am" />
                    <motion.p variants={fadeUp} className="about-bio">
                        A committed and meticulous Cybersecurity Enthusiast and aspiring Web Designer
                        pursuing a Bachelor's Degree in Computer and Information Technology.
                        Eager to leverage technical skills and industry insights to safeguard
                        organizational assets and create engaging, user-friendly websites.
                    </motion.p>
                    <motion.p variants={fadeUp} className="about-bio">
                        Dedicated to staying ahead of emerging threats and evolving design trends to
                        deliver innovative solutions that balance security with seamless user experience.
                    </motion.p>

                    <motion.div variants={stagger} className="info-list">
                        {info.map(item => (
                            <motion.div variants={fadeLeft} key={item.label} className="info-row">
                                <span className="info-icon">{item.icon}</span>
                                <div>
                                    <span className="info-label">{item.label}</span>
                                    <span className="info-value">{item.value}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div variants={fadeUp} className="about-right">
                    <div className="about-card-visual">
                        <div className="vc-header">
                            <div className="vc-dots"><span /><span /><span /></div>
                            <span className="vc-title">profile.json</span>
                        </div>
                        <pre className="vc-code">{`{
  "name": "Vrushika Gajjar",
  "role": "CyberSec Enthusiast",
  "degree": "B.S. Computer & IT",
  "university": "Monroe University",
  "graduation": "April 2026",
  "location": "Mount Vernon, NY",
  "focus": [
    "Cybersecurity",
    "Web Design",
    "Network Security"
  ],
  "available": true
}`}</pre>
                    </div>
                </motion.div>
            </motion.div>
        </Section>
    )
}

// ── Education Section ─────────────────────────────────────────────────────────
function Education() {
    const currentCourses = [
        {
            code: '26WN-IT495-56',
            name: 'Senior Seminar',
            professor: 'Prof. Taoufik Ennoure',
            icon: <Star size={14} />,
        },
        {
            code: '26WN-IT150-45',
            name: 'Web Design Technology',
            professor: 'Prof. Khadhirunissa Shaik',
            icon: <Layers size={14} />,
        },
    ]

    return (
        <Section id="education" className="section-alt">
            <motion.div variants={stagger} className="education-wrap">
                <SectionTitle
                    label="02 / Education"
                    title="Academic Background"
                    subtitle="Building a strong foundation in technology and security"
                />

                <motion.div variants={fadeUp} className="edu-card">
                    <div className="edu-icon-wrap">
                        <BookOpen size={28} />
                    </div>
                    <div className="edu-body">
                        <div className="edu-top">
                            <div>
                                <h3 className="edu-uni">Monroe University</h3>
                                <p className="edu-location">New Rochelle, NY</p>
                            </div>
                            <span className="edu-badge">Expected April 2026</span>
                        </div>
                        <p className="edu-degree">Bachelor's Degree in Computer and Information Technology</p>
                        <p className="edu-minor">Minor: To be declared</p>

                        <div className="edu-divider" />

                        <h4 className="courses-heading">Current Courses</h4>
                        <div className="courses-grid">
                            {currentCourses.map(course => (
                                <div key={course.code} className="course-chip">
                                    <div className="course-chip-icon">{course.icon}</div>
                                    <div>
                                        <div className="course-chip-name">{course.name}</div>
                                        <div className="course-chip-code">{course.code}</div>
                                        <div className="course-chip-prof">{course.professor}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </Section>
    )
}

// ── Projects / Course Data ────────────────────────────────────────────────────
const COURSES = [
    {
        id: 'senior-seminar',
        tab: 'Senior Seminar',
        code: '26WN-IT495-56',
        professor: 'Prof. Taoufik Ennoure',
        description: 'Capstone course integrating knowledge from across the IT curriculum. Students research emerging technologies and present comprehensive final-year projects.',
        icon: <Star size={16} />,
        projects: [
            {
                title: 'SmartShop E-Commerce Platform',
                desc: 'Full-stack e-commerce platform with Django REST API, React frontend, AR glasses try-on feature, live admin dashboard, order management, and Docker deployment on a VPS with Caddy reverse proxy.',
                tags: ['React', 'Django', 'Docker', 'PostgreSQL', 'AR/VR', 'REST API'],
                featured: true,
                link: 'https://smartshop1.us',
            },
            {
                title: 'Capstone Research Paper',
                desc: 'In-depth research on emerging cybersecurity threats in modern e-commerce platforms, covering OWASP Top-10, MFA, HTTPS enforcement, and data breach prevention strategies.',
                tags: ['Research', 'Cybersecurity', 'OWASP', 'Technical Writing'],
                featured: false,
                link: null,
            },
            {
                title: 'Senior Seminar Presentation',
                desc: 'Final presentation covering the full SmartShop project lifecycle: requirements, system architecture, development sprints, testing, DevOps pipeline, and live demo.',
                tags: ['Presentation', 'System Design', 'DevOps', 'Full Stack'],
                featured: false,
                link: null,
            },
        ],
    },
    {
        id: 'web-design',
        tab: 'Web Design Tech',
        code: '26WN-IT150-45',
        professor: 'Prof. Khadhirunissa Shaik',
        description: 'Focus on UI/UX principles, responsive layouts, and modern frontend technologies to create engaging, accessible web experiences.',
        icon: <Layers size={16} />,
        projects: [
            {
                title: 'SmartShop Brand & UI Design',
                desc: 'Developed a fully responsive frontend for the SmartShop brand including logo creation, hero slider, product showcase, and shopping cart UI using HTML5, CSS3, and modern design principles.',
                tags: ['HTML5', 'CSS3', 'Responsive Design', 'Logo Design', 'UI/UX'],
                featured: true,
                link: null,
            },
            {
                title: 'Personal Portfolio Website',
                desc: 'Designed and built this portfolio using React, Framer Motion, and Radix UI with smooth scroll animations, typing effects, dark glassmorphism theme, and full responsive layout.',
                tags: ['React', 'Framer Motion', 'Radix UI', 'CSS Animations'],
                featured: false,
                link: null,
            },
            {
                title: 'Color Theory & Typography Study',
                desc: 'In-depth assignment exploring color palettes, contrast ratios for WCAG AA accessibility, and pairing modern typefaces (Inter, Outfit) for web headings and body text.',
                tags: ['Color Theory', 'Typography', 'Accessibility', 'WCAG'],
                featured: false,
                link: null,
            },
            {
                title: 'CSS Layout Workshop',
                desc: 'Hands-on exercises mastering CSS Flexbox and Grid to build card grids, sidebars, sticky navbars, and complex magazine-style layouts — all without JavaScript.',
                tags: ['CSS Grid', 'Flexbox', 'Responsive', 'Layout Patterns'],
                featured: false,
                link: null,
            },
        ],
    },
    {
        id: 'it-project-mgmt',
        tab: 'IT Project Mgmt',
        code: 'IT-PM',
        professor: '',
        description: 'Study of Agile and Waterfall project management methodologies, team coordination, and the full IT project lifecycle — applied to a real-world datacenter migration scenario.',
        icon: <Wrench size={16} />,
        projects: [
            {
                title: 'Datacenter Migration: Pennsylvania → Connecticut',
                desc: 'Led the planning and documentation for a full datacenter migration from a Pennsylvania facility to a new Connecticut datacenter. Covered scope, risk assessment, hardware inventory, downtime scheduling, and stakeholder sign-off.',
                tags: ['Datacenter Migration', 'Project Charter', 'Risk Management', 'IT Infrastructure'],
                featured: true,
                link: null,
            },
            {
                title: 'Migration Gantt Chart & Sprint Plan',
                desc: 'Developed a 16-week phased Gantt chart for the PA-to-CT datacenter migration covering pre-migration audit, physical transport, network reconfiguration, system validation, and go-live cutover.',
                tags: ['Gantt Chart', 'Phased Migration', 'Cutover Plan', 'Scheduling'],
                featured: false,
                link: null,
            },
            {
                title: 'Risk Register & Contingency Plan',
                desc: 'Identified 12 key migration risks (hardware failure, data loss, network outage, vendor delays) and created mitigation strategies and rollback procedures for each phase of the move.',
                tags: ['Risk Register', 'Contingency Planning', 'Business Continuity', 'ITIL'],
                featured: false,
                link: null,
            },
            {
                title: 'Stakeholder Communication Plan',
                desc: 'Designed a structured communication plan for the CT migration project, outlining meeting cadence, escalation paths, status dashboards, and executive reporting templates.',
                tags: ['Communication Plan', 'Stakeholders', 'Executive Reporting', 'RACI'],
                featured: false,
                link: null,
            },
        ],
    },
    {
        id: 'database',
        tab: 'Database Mgmt',
        code: 'IT-DB',
        professor: '',
        description: 'Relational database design, SQL querying, normalization techniques, and data management best practices.',
        icon: <Database size={16} />,
        projects: [
            {
                title: 'Library Management System',
                desc: 'Designed a fully normalized (3NF) ER diagram and implemented SQL DDL/DML for a library system tracking books, authors, members, and loan transactions with triggers.',
                tags: ['SQL', 'MySQL', 'ERD', '3NF Normalization', 'Triggers'],
                featured: false,
                link: null,
            },
            {
                title: 'Student Records Database',
                desc: 'Built a relational schema for student enrollment, course management, GPA calculation, and transcript generation using stored procedures and views.',
                tags: ['SQL', 'Stored Procedures', 'Views', 'MySQL'],
                featured: false,
                link: null,
            },
            {
                title: 'SmartShop PostgreSQL Schema',
                desc: 'Designed the PostgreSQL schema powering SmartShop — includes product catalog, user accounts, orders, reviews, inventory, and payment tables with foreign key constraints.',
                tags: ['PostgreSQL', 'Schema Design', 'Indexing', 'Foreign Keys'],
                featured: false,
                link: null,
            },
            {
                title: 'SQL Query Optimization Lab',
                desc: 'Analyzed slow-running queries using EXPLAIN plans, added composite indexes, rewrote correlated subqueries as JOINs, and benchmarked performance improvements.',
                tags: ['Query Optimization', 'Indexing', 'EXPLAIN', 'Performance'],
                featured: false,
                link: null,
            },
        ],
    },
    {
        id: 'java-prog',
        tab: 'Java Programming',
        code: 'IT-JAVA',
        professor: '',
        description: 'Object-oriented programming, data structures, algorithms, and GUI application development using Java.',
        icon: <Terminal size={16} />,
        projects: [
            {
                title: 'Student Management App',
                desc: 'Console-based Java application with full CRUD operations, file I/O persistence using serialization, and input validation for managing student academic records.',
                tags: ['Java', 'OOP', 'CRUD', 'Serialization'],
                featured: false,
                link: null,
            },
            {
                title: 'Scientific Calculator',
                desc: 'GUI-based calculator using Java Swing supporting arithmetic, trigonometric (sin/cos/tan), logarithmic, and memory functions with keyboard bindings.',
                tags: ['Java', 'Swing', 'GUI', 'Event Handling'],
                featured: false,
                link: null,
            },
            {
                title: 'Inventory Tracker App',
                desc: 'OOP Java app to track product inventory, quantity, pricing, and generate low-stock alerts using ArrayList, HashMap, and custom comparators for sorting.',
                tags: ['Java', 'Collections', 'ArrayList', 'HashMap'],
                featured: false,
                link: null,
            },
            {
                title: 'Data Structures & Algorithms',
                desc: 'Implemented linked lists, binary search trees, bubble sort, merge sort, and quicksort from scratch, with Big-O analysis and runtime benchmarking.',
                tags: ['Java', 'Data Structures', 'Algorithms', 'Big-O'],
                featured: false,
                link: null,
            },
        ],
    },
]

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-50px' })
    const handleClick = () => {
        if (project.link) window.open(project.link, '_blank', 'noopener,noreferrer')
    }
    return (
        <motion.div
            ref={ref}
            className={`project-card ${project.featured ? 'featured' : ''} ${project.link ? 'clickable' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={handleClick}
            role={project.link ? 'link' : undefined}
            tabIndex={project.link ? 0 : undefined}
            onKeyDown={e => e.key === 'Enter' && handleClick()}
        >
            {project.featured && (
                <div className="card-featured-badge"><Star size={10} /> Featured</div>
            )}
            <div className="project-card-top">
                <h4 className="project-title">{project.title}</h4>
                {project.link && (
                    <span className="project-link-icon" title="Open in new tab">
                        <ExternalLink size={14} />
                    </span>
                )}
            </div>
            <p className="project-desc">{project.desc}</p>
            <div className="tag-row">
                {project.tags.map(t => <span className="tag" key={t}>{t}</span>)}
            </div>
        </motion.div>
    )
}

// ── Projects Section ──────────────────────────────────────────────────────────
function Projects() {
    return (
        <Section id="projects">
            <motion.div variants={stagger} className="projects-wrap">
                <SectionTitle
                    label="03 / School Work"
                    title="School Work Projects"
                />

                <motion.div variants={fadeUp} className="tabs-container">
                    <Tabs.Root defaultValue="senior-seminar" className="tabs-root">
                        <Tabs.List className="tabs-list" aria-label="Course tabs">
                            {COURSES.map(c => (
                                <Tabs.Trigger key={c.id} value={c.id} className="tab-trigger" id={`tab-${c.id}`}>
                                    <span className="tab-icon">{c.icon}</span>
                                    <span className="tab-label">{c.tab}</span>
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>

                        {COURSES.map(c => (
                            <Tabs.Content key={c.id} value={c.id} className="tab-content">
                                <div className="tab-header">
                                    <div>
                                        <h3 className="tab-course-name">{c.tab}</h3>
                                        {c.code && <span className="tab-code">{c.code}</span>}
                                        {c.professor && <span className="tab-professor"> · {c.professor}</span>}
                                    </div>
                                    <p className="tab-desc">{c.description}</p>
                                </div>
                                <div className="projects-grid">
                                    {c.projects.map((p, i) => (
                                        <ProjectCard key={p.title} project={p} index={i} />
                                    ))}
                                </div>
                            </Tabs.Content>
                        ))}
                    </Tabs.Root>
                </motion.div>
            </motion.div>
        </Section>
    )
}

// ── Skill Group Card (separate component to safely use hooks) ─────────────────
function SkillGroupCard({ group, index }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })

    return (
        <motion.div
            key={group.label}
            ref={ref}
            className="skill-group"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ '--group-color': group.color }}
        >
            <div className="skill-group-header">
                <div className="skill-group-icon" style={{ background: group.color + '22', color: group.color }}>
                    {group.icon}
                </div>
                <h3 className="skill-group-label">{group.label}</h3>
            </div>
            <div className="skill-bubbles">
                {group.skills.map((s, i) => (
                    <motion.span
                        key={s}
                        className="skill-bubble"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        {s}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    )
}

// ── Skills Section ────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
    {
        icon: <Shield size={22} />,
        label: 'Cybersecurity',
        color: '#f43f5e',
        skills: ['Threat Detection', 'Risk Assessment', 'Network Security', 'Ethical Hacking', 'OSINT', 'Incident Response'],
    },
    {
        icon: <Code size={22} />,
        label: 'Web Design',
        color: '#8b5cf6',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Responsive Design', 'Figma', 'Adobe XD'],
    },
    {
        icon: <Terminal size={22} />,
        label: 'Programming',
        color: '#06b6d4',
        skills: ['Python', 'Java', 'SQL', 'Bash Scripting', 'OOP'],
    },
    {
        icon: <Wrench size={22} />,
        label: 'Tools & Platforms',
        color: '#10b981',
        skills: ['Wireshark', 'Kali Linux', 'Git', 'VS Code', 'MySQL', 'Docker'],
    },
    {
        icon: <Users size={22} />,
        label: 'Soft Skills',
        color: '#f59e0b',
        skills: ['Problem Solving', 'Attention to Detail', 'Teamwork', 'Communication', 'Critical Thinking', 'Adaptability'],
    },
]

function Skills() {
    return (
        <Section id="skills" className="section-alt">
            <motion.div variants={stagger} className="skills-wrap">
                <SectionTitle
                    label="04 / Skills"
                    title="Technical Arsenal"
                    subtitle="Technologies and tools I work with"
                />
                <div className="skills-grid">
                    {SKILL_GROUPS.map((group, i) => (
                        <SkillGroupCard key={group.label} group={group} index={i} />
                    ))}
                </div>
            </motion.div>
        </Section>
    )
}

// ── Cert Card ─────────────────────────────────────────────────────────────────
function CertCard({ cert, index }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })

    return (
        <motion.div
            ref={ref}
            className="cert-card"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={{ '--cert-color': cert.color }}
        >
            <div className="cert-icon-wrap">{cert.icon}</div>
            <div className="cert-body">
                <h4 className="cert-title">{cert.title}</h4>
                <p className="cert-sub">{cert.sub}</p>
                <div className="cert-issuer">
                    <Award size={12} /> {cert.issuer}
                </div>
            </div>
            <div className="cert-glow" style={{ background: cert.color }} />
        </motion.div>
    )
}

// ── Certifications Section ────────────────────────────────────────────────────
const CERTS = [
    {
        icon: '🌐',
        title: 'Cisco Certified Network Associate',
        sub: 'CCNA 1, 2 & 3',
        issuer: 'Cisco',
        color: '#06b6d4',
    },
    {
        icon: '🛡️',
        title: 'Cisco CyberOps Associate',
        sub: 'Cybersecurity Operations',
        issuer: 'Cisco',
        color: '#8b5cf6',
    },
    {
        icon: '⚔️',
        title: 'Ethical Hacking',
        sub: 'Certified Ethical Hacker',
        issuer: 'uCertify',
        color: '#f43f5e',
    },
    {
        icon: '🎨',
        title: 'Web Design Certification',
        sub: 'Professional Web Design',
        issuer: 'uCertify',
        color: '#10b981',
    },
]

function Certifications() {
    return (
        <Section id="certifications">
            <motion.div variants={stagger} className="certs-wrap">
                <SectionTitle
                    label="05 / Certifications"
                    title="Credentials & Achievements"
                    subtitle="Professional certifications that validate my expertise"
                />
                <div className="certs-grid">
                    {CERTS.map((cert, i) => (
                        <CertCard key={cert.title} cert={cert} index={i} />
                    ))}
                </div>
            </motion.div>
        </Section>
    )
}

// ── Contact Section ───────────────────────────────────────────────────────────
function Contact() {
    const contacts = [
        { icon: <Mail size={20} />, label: 'Email', value: 'gajjar.vrushikau45@gmail.com', href: 'mailto:gajjar.vrushikau45@gmail.com', id: 'contact-email', download: false },
        { icon: <Phone size={20} />, label: 'Phone', value: '+1 914 267 3207', href: 'tel:+19142673207', id: 'contact-phone', download: false },
        { icon: <MapPin size={20} />, label: 'Location', value: 'Mount Vernon, NY 10553', href: null, id: 'contact-location', download: false },
        { icon: <Download size={20} />, label: 'Resume', value: 'Vrushika_Gajjar_Resume.pdf', href: '/Vrushika_Gajjar_Resume.pdf', id: 'contact-resume', download: true },
    ]

    return (
        <Section id="contact" className="section-alt">
            <motion.div variants={stagger} className="contact-wrap">
                <SectionTitle
                    label="06 / Contact"
                    title="Let's Connect"
                    subtitle="I'm currently seeking internship opportunities and collaborative projects"
                />

                <motion.div variants={fadeUp} className="contact-content">
                    <div className="contact-left">
                        <p className="contact-bio">
                            Whether you have a project in mind, an internship opportunity, or simply want
                            to chat about cybersecurity or web design — my inbox is always open!
                        </p>
                        <div className="contact-list">
                            {contacts.map(c => (
                                <motion.div
                                    key={c.label}
                                    className={`contact-row ${c.download ? 'resume-row' : ''}`}
                                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                >
                                    <div className="contact-row-icon">{c.icon}</div>
                                    <div className="contact-row-body">
                                        <span className="contact-row-label">{c.label}</span>
                                        {c.href ? (
                                            <a
                                                href={c.href}
                                                className="contact-row-value link"
                                                id={c.id}
                                                download={c.download ? c.value : undefined}
                                            >
                                                {c.value}
                                            </a>
                                        ) : (
                                            <span className="contact-row-value">{c.value}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="contact-right">
                        <div className="contact-cta-card">
                            <Lock size={32} className="cta-icon" />
                            <h3>Open to Opportunities</h3>
                            <p>Seeking internship roles in cybersecurity, web design, or IT. Let's build something secure and beautiful together.</p>
                            <a
                                href="mailto:gajjar.vrushikau45@gmail.com"
                                className="btn btn-primary full-w"
                                id="contact-cta-btn"
                            >
                                <Mail size={16} /> Send an Email
                            </a>
                            <div className="resume-btn-pair">
                                <a
                                    href="/Vrushika_Gajjar_Resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost flex-1"
                                    id="contact-resume-view-btn"
                                >
                                    <ExternalLink size={15} /> View Resume
                                </a>
                                <a
                                    href="https://github.com/Helly1529"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost"
                                    id="contact-github-btn"
                                >
                                    <Github size={15} /> GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </Section>
    )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-logo">VG<span>.</span></div>
                <p className="footer-text">Designed &amp; Built by <strong>Vrushika Gajjar</strong> · 2026</p>
                <p className="footer-sub">Monroe University · Computer &amp; Information Technology</p>
            </div>
        </footer>
    )
}

// ── Scroll to Top ─────────────────────────────────────────────────────────────
function ScrollTop() {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const fn = () => setVisible(window.scrollY > 600)
        window.addEventListener('scroll', fn)
        return () => window.removeEventListener('scroll', fn)
    }, [])
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    className="scroll-top-btn"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    id="scroll-top-btn"
                    aria-label="Back to top"
                >
                    ↑
                </motion.button>
            )}
        </AnimatePresence>
    )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
    return (
        <Tooltip.Provider>
            <div className="app">
                <StarfieldCanvas />
                <Navbar />
                <main>
                    <Hero />
                    <About />
                    <Education />
                    <Projects />
                    <Skills />
                    <Certifications />
                    <Contact />
                </main>
                <Footer />
                <ScrollTop />
            </div>
        </Tooltip.Provider>
    )
}
