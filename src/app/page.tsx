'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bot,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Github,
  Image as ImageIcon,
  Layers,
  Linkedin,
  Mic,
  Minus,
  Paperclip,
  Play,
  Plus,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Twitter,
  Video,
  Youtube,
  Zap,
} from 'lucide-react'

// Rename here to rebrand the whole page.
const BRAND = 'AI Chatbot'

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const benefits = [
  {
    icon: Zap,
    label: 'Real-time answers',
    description:
      'Responses stream in word by word, so conversations feel instant, natural and human-like.',
    tagline: 'Deliver instant answers',
  },
  {
    icon: Brain,
    label: 'Long-term memory',
    description:
      'The assistant remembers useful facts about each user across chats, so nobody has to repeat themselves.',
    tagline: 'Remember every detail',
  },
  {
    icon: Layers,
    label: 'Multi-modal understanding',
    description:
      'Drop in images, audio, video or documents and get answers grounded in what you shared.',
    tagline: 'Understand anything',
  },
]

const steps = [
  {
    title: 'Create your account',
    description:
      'Sign up with your email and password. Your workspace and chat history are ready immediately.',
  },
  {
    title: 'Choose your model',
    description:
      'Pick Anthropic Claude for deep reasoning or Google Gemini for speed, and switch anytime per chat.',
  },
  {
    title: 'Ask, attach, explore',
    description:
      'Type a question, record a voice note, or attach an image or video, then watch the answer stream in.',
  },
  {
    title: 'Pick up where you left off',
    description:
      'Every chat is saved, and memories carry context forward so the next conversation starts smarter.',
  },
]

const orbitChips = [
  { icon: FileText, text: 'Text prompts with Markdown & code', pos: 'left-[2%] top-[18%]' },
  { icon: ImageIcon, text: 'Image understanding', pos: 'right-[4%] top-[12%]' },
  { icon: Mic, text: 'Voice notes & audio', pos: 'left-[-2%] top-[56%]' },
  { icon: Video, text: 'Video analysis', pos: 'right-[0%] top-[48%]' },
  { icon: Brain, text: 'Personal memory', pos: 'left-[14%] bottom-[6%]' },
  { icon: Sparkles, text: 'Claude & Gemini', pos: 'right-[12%] bottom-[10%]' },
]

const stats = [
  { value: '2', label: 'Leading AI models' },
  { value: '4', label: 'Input types supported' },
  { value: '∞', label: 'Saved conversations' },
  { value: '24/7', label: 'Always available' },
]

// Placeholder quotes: replace with real customer feedback before publishing.
const testimonials = [
  {
    quote:
      'Switching between Claude and Gemini in one place changed how our team drafts and reviews content.',
    name: 'Ayesha Khan',
    role: 'Content Lead',
    color: 'bg-violet-500',
  },
  {
    quote:
      'The memory feature is the killer detail. It remembers our stack, so answers are relevant from the first message.',
    name: 'Daniel Reyes',
    role: 'Full Stack Developer',
    color: 'bg-amber-500',
  },
  {
    quote:
      'We drop meeting recordings in and get clean summaries with action items. It saves hours every week.',
    name: 'Hira Ahmed',
    role: 'Operations Manager',
    color: 'bg-emerald-500',
  },
  {
    quote: 'Clean, fast and focused. Our support team adopted it without a single training session.',
    name: 'Omar Siddiqui',
    role: 'Head of Support',
    color: 'bg-sky-500',
  },
]

const faqs = [
  {
    q: `What can ${BRAND} help me with?`,
    a: 'Anything you would ask a capable assistant: writing, coding, research, summarizing meetings, analysing images or documents, and brainstorming, all in one chat interface.',
  },
  {
    q: 'Which AI models are supported?',
    a: 'Anthropic Claude and Google Gemini. You can choose the model for each conversation and switch whenever you like.',
  },
  {
    q: 'What kinds of files can I send?',
    a: 'Text, images, audio recordings and video. Attach them in the message box or record a voice note directly in the browser.',
  },
  {
    q: 'How does memory work?',
    a: 'As you chat, the assistant saves short, useful facts about you. You can review and delete any memory from the settings page at any time.',
  },
  {
    q: 'Is my data secure?',
    a: 'Accounts are protected with hashed passwords and JWT authentication, and each user can only access their own chats and memories.',
  },
]

const ctaAvatars = [
  { initials: 'AK', color: 'bg-violet-500', pos: 'left-[6%] top-[12%]', size: 'h-14 w-14' },
  { initials: 'DR', color: 'bg-amber-500', pos: 'left-[18%] top-[48%]', size: 'h-10 w-10' },
  { initials: 'HA', color: 'bg-emerald-500', pos: 'left-[10%] bottom-[10%]', size: 'h-12 w-12' },
  { initials: 'OS', color: 'bg-sky-500', pos: 'right-[8%] top-[16%]', size: 'h-14 w-14' },
  { initials: 'MZ', color: 'bg-rose-500', pos: 'right-[20%] top-[56%]', size: 'h-10 w-10' },
  { initials: 'SL', color: 'bg-indigo-500', pos: 'right-[6%] bottom-[8%]', size: 'h-12 w-12' },
]

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2 font-semibold">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm shadow-violet-500/30">
        <Bot className="h-4 w-4 text-white" />
      </span>
      <span className={dark ? 'text-white' : 'text-gray-900'}>{BRAND}</span>
    </span>
  )
}

function PillButton({
  href,
  children,
  variant = 'dark',
}: {
  href: string
  children: React.ReactNode
  variant?: 'dark' | 'light'
}) {
  if (variant === 'light') {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm hover:border-gray-300"
      >
        {children}
        <ArrowRight className="h-4 w-4" />
      </Link>
    )
  }
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 rounded-full bg-gray-950 py-1.5 pl-5 pr-1.5 text-sm font-medium text-white shadow-lg shadow-gray-950/20 hover:bg-gray-800"
    >
      {children}
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-950 transition-transform group-hover:translate-x-0.5">
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

function SectionTag({ number, label }: { number: string; label: string }) {
  return (
    <div className="inline-flex self-start items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-4 text-sm text-gray-700">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-xs font-medium text-white">
        {number}
      </span>
      {label}
    </div>
  )
}

function Waveform({ bars = 22 }: { bars?: number }) {
  return (
    <span className="flex h-6 items-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-violet-500/70"
          style={{ height: `${30 + Math.abs(Math.sin(i * 1.7)) * 70}%` }}
        />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [signedIn, setSignedIn] = useState(false)
  const [openStep, setOpenStep] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [slide, setSlide] = useState(0)
  const [perView, setPerView] = useState(2)

  useEffect(() => {
    setSignedIn(!!localStorage.getItem('token'))
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => {
      setPerView(mq.matches ? 2 : 1)
      setSlide(0)
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const primaryHref = signedIn ? '/chat' : '/auth/signup'
  const primaryLabel = signedIn ? 'Open app' : 'Try it free'
  const maxSlide = testimonials.length - perView

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      {/* ============================ NAV ============================ */}
      <header className="sticky top-0 z-30 border-b border-violet-100/60 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <div className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
            <a href="#benefits" className="hover:text-gray-950">Benefits</a>
            <a href="#how-it-works" className="hover:text-gray-950">How it works</a>
            <a href="#capabilities" className="hover:text-gray-950">Capabilities</a>
            <a href="#faq" className="hover:text-gray-950">FAQ</a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {!signedIn && (
              <Link href="/auth/login" className="hidden text-gray-600 hover:text-gray-950 sm:inline">
                Sign in
              </Link>
            )}
            <Link
              href={primaryHref}
              className="rounded-full bg-violet-100 px-4 py-2 font-medium text-violet-700 hover:bg-violet-200"
            >
              {signedIn ? 'Open app' : 'Get started'}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* ============================ HERO ============================ */}
        <section className="relative isolate overflow-hidden pb-24 pt-16 sm:pt-24">
          <div className="bg-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div className="absolute -left-40 -top-40 -z-10 h-[480px] w-[480px] rounded-full bg-violet-300/40 blur-3xl" />
          <div className="absolute -right-40 top-20 -z-10 h-[420px] w-[420px] rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -z-10 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-fuchsia-200/30 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-medium text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Claude &amp; Gemini
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              Smarter conversations
              <br />
              <span className="inline-flex items-center gap-3 align-middle">
                <span className="hidden -space-x-3 sm:flex">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-sky-400 to-blue-600 text-white">
                    <Bot className="h-5 w-5" />
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gray-950 text-sm font-semibold text-white">
                    2+
                  </span>
                </span>
                <span>
                  with{' '}
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {BRAND}
                  </span>
                </span>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-gray-500 sm:text-lg">
              One clean workspace to chat with leading AI models using text, images, audio and
              video, with memory that keeps the context of every conversation.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PillButton href={primaryHref}>{primaryLabel}</PillButton>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm hover:border-gray-300"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                See how it works
              </a>
            </div>

            {/* Product mockup with floating cards */}
            <div className="relative mx-auto mt-16 max-w-4xl">
              {/* Left floating: chat history */}
              <div className="animate-float absolute -left-56 z-10 top-16 hidden w-56 rounded-2xl border border-gray-100 bg-white/90 p-4 text-left shadow-xl shadow-violet-900/5 backdrop-blur xl:block">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="font-medium">Chat history</span>
                  <span className="text-gray-400">See all</span>
                </div>
                <p className="mb-2 text-[11px] text-gray-400">Today</p>
                {['Q3 sales summary', 'Fix login bug'].map((t, i) => (
                  <div key={t} className="mb-2 flex items-center gap-2 text-xs text-gray-700">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i === 0 ? 'bg-violet-100 text-violet-600' : 'bg-gray-950 text-white'}`}>
                      {i === 0 ? <FileText className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </span>
                    <span className="flex-1 truncate">{t}</span>
                    <Clock className="h-3 w-3 text-gray-300" />
                  </div>
                ))}
                <p className="mb-2 mt-3 text-[11px] text-gray-400">Last week</p>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <ImageIcon className="h-3 w-3" />
                  </span>
                  <span className="flex-1 truncate">Logo feedback</span>
                  <Clock className="h-3 w-3 text-gray-300" />
                </div>
              </div>

              {/* Left floating: memory */}
              <div className="animate-float-slow absolute -left-40 z-10 -bottom-2 hidden items-center gap-3 rounded-2xl border border-gray-100 bg-white/90 p-3 pr-5 text-left shadow-xl shadow-violet-900/5 backdrop-blur xl:flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                  <Brain className="h-5 w-5 text-amber-500" />
                </span>
                <span className="text-xs">
                  <span className="block font-medium">Memory saved</span>
                  <span className="text-gray-500">Prefers TypeScript examples</span>
                </span>
              </div>

              {/* Right floating: voice note */}
              <div className="animate-float-slow absolute -right-48 z-10 -top-10 hidden w-60 text-left xl:block">
                <div className="flex items-center gap-3 rounded-full bg-violet-200/80 p-2 pr-4 shadow-lg shadow-violet-500/10">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950">
                    <Play className="h-3 w-3 fill-white text-white" />
                  </span>
                  <Waveform />
                  <span className="text-[11px] text-gray-700">0:45</span>
                </div>
                <div className="ml-8 mt-2 inline-block rounded-xl rounded-tl-sm bg-violet-200/80 px-3 py-1.5 text-[11px] text-gray-700">
                  Summarize this voice note
                </div>
              </div>

              {/* Right floating: image analysis */}
              <div className="animate-float absolute -right-48 z-10 top-44 hidden w-48 rounded-2xl border border-gray-100 bg-white/90 p-4 text-left shadow-xl shadow-violet-900/5 backdrop-blur xl:block">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                  <ImageIcon className="h-3.5 w-3.5 text-violet-500" />
                  Image analysis
                </span>
                <p className="mt-2 text-lg font-medium leading-tight">Chart to insights</p>
                <p className="mt-1 text-[11px] text-gray-500">Revenue grew 18% in Q3, led by EMEA.</p>
                <span className="mt-3 inline-block rounded-full bg-gray-950 px-3 py-1 text-[11px] text-white">Try now</span>
              </div>

              {/* Right floating: thanks bubble */}
              <div className="absolute -right-28 -bottom-4 z-10 hidden text-right xl:block">
                <span className="inline-block rounded-xl rounded-br-sm bg-gray-950 px-3 py-2 text-[11px] text-white">
                  That&apos;s perfect, thanks!
                </span>
                <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-gray-400">
                  4:32 PM <Check className="h-3 w-3" />
                </span>
              </div>

              {/* App window */}
              <div className="rounded-3xl border border-white/60 bg-white/50 p-2 shadow-2xl shadow-violet-900/10 backdrop-blur">
                <div className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white text-left">
                  <aside className="hidden w-52 shrink-0 border-r border-gray-100 bg-gray-50/70 p-4 sm:block">
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-950 px-3 py-2 text-xs text-white">
                      <Plus className="h-3.5 w-3.5" /> New chat
                    </div>
                    {['Meeting recap', 'Landing page copy', 'SQL query help', 'Trip itinerary'].map((t, i) => (
                      <div
                        key={t}
                        className={`mb-1 truncate rounded-lg px-3 py-2 text-xs ${i === 0 ? 'bg-violet-100 font-medium text-violet-700' : 'text-gray-500'}`}
                      >
                        {t}
                      </div>
                    ))}
                  </aside>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                      <span className="text-sm font-medium">Meeting recap</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-[11px] text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Claude
                      </span>
                    </div>
                    <div className="flex-1 space-y-4 p-5 text-sm">
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2.5 text-white">
                          <span className="mb-2 flex items-center gap-2 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs">
                            <AudioLines className="h-3.5 w-3.5" /> standup-recording.m4a
                          </span>
                          Summarize this and list action items.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
                          <Bot className="h-3.5 w-3.5 text-white" />
                        </span>
                        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-50 px-4 py-3 text-gray-700">
                          <p className="mb-2">Here&apos;s a summary of the 24-minute standup:</p>
                          <ul className="space-y-1.5 text-gray-600">
                            {['Launch moved to the second week of November', 'Design shares final mockups by Friday', 'QA to start regression testing Monday'].map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="m-4 mt-0 flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-400">
                      <Paperclip className="h-4 w-4" />
                      <span className="flex-1">Ask anything…</span>
                      <Mic className="h-4 w-4" />
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950">
                        <Send className="h-3.5 w-3.5 text-white" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ TRUST STRIP ============================ */}
        <section className="border-y border-gray-100 bg-gray-50/60 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-gray-400">
              Built on a modern, reliable stack
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-lg font-semibold text-gray-400">
              {['Anthropic Claude', 'Google Gemini', 'Next.js', 'Prisma', 'PostgreSQL', 'Supabase'].map((name) => (
                <span key={name} className="hover:text-gray-600">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 01 BENEFITS ============================ */}
        <section id="benefits" className="scroll-mt-16 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-xl">
                <SectionTag number="01" label="Benefits" />
                <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">Our benefits</h2>
                <p className="mt-4 text-gray-500">
                  Explore the ways {BRAND} turns everyday questions into fast, accurate and
                  personal answers.
                </p>
              </div>
              <a href="#capabilities" className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
                Explore all capabilities <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-14 space-y-4">
              {benefits.map(({ icon: Icon, label, description, tagline }) => (
                <div
                  key={label}
                  className="grid items-stretch gap-4 rounded-3xl border border-gray-100 bg-white p-3 shadow-sm md:grid-cols-2"
                >
                  <div className="flex gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50">
                      <Icon className="h-5 w-5 text-violet-600" />
                    </span>
                    <div>
                      <h3 className="font-medium">{label}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
                    </div>
                  </div>
                  <div className="bg-grid relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 px-6 py-10 text-center">
                    <span className="text-xs text-gray-500">We are here to</span>
                    <span className="mt-2 text-xl font-semibold sm:text-2xl">{tagline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 02 HOW IT WORKS ============================ */}
        <section id="how-it-works" className="scroll-mt-16 bg-gray-50/60 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <SectionTag number="02" label="Getting started" />
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Get started:
                </span>
                <br />
                up and running in a minute
              </h2>
              <p className="mt-4 max-w-md text-gray-500">
                No setup, no learning curve. Four simple steps from sign-up to your first great answer.
              </p>

              {/* Visual card */}
              <div className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-gray-950 p-8 text-white shadow-xl shadow-violet-900/20">
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-fuchsia-400/30 blur-2xl" />
                <div className="absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-sky-400/20 blur-2xl" />
                <div className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                    <Sparkles className="h-6 w-6 text-white" />
                  </span>
                  <p className="mt-6 text-2xl font-semibold leading-snug">
                    &ldquo;Explain this chart and suggest three next steps.&rdquo;
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    {['Text', 'Image', 'Audio', 'Video'].map((t) => (
                      <span key={t} className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pt-24">
              {steps.map((step, i) => {
                const open = openStep === i
                return (
                  <div key={step.title} className="border-b border-gray-200 last:border-0">
                    <button
                      onClick={() => setOpenStep(i)}
                      className="flex w-full items-center gap-5 py-6 text-left"
                      aria-expanded={open}
                    >
                      <span className="text-sm text-gray-400">0{i + 1}</span>
                      <span className={`flex-1 text-lg font-medium ${open ? 'text-gray-950' : 'text-gray-700'}`}>
                        {step.title}
                      </span>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${open ? 'rotate-90 border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-500'}`}>
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </button>
                    {open && (
                      <div className="grid gap-6 pb-8 pl-10 sm:grid-cols-[1fr_auto]">
                        <div>
                          <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
                          {i === 0 && (
                            <Link href={primaryHref} className="mt-4 inline-block rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium hover:border-gray-300">
                              {signedIn ? 'Open app' : 'Create account'}
                            </Link>
                          )}
                        </div>
                        {i === 0 && (
                          <div className="hidden w-48 rounded-2xl border border-gray-100 bg-white p-4 text-[11px] shadow-sm sm:block">
                            <p className="font-medium">Sign up</p>
                            <p className="mt-3 text-gray-400">Email</p>
                            <div className="mt-1 rounded-md border border-gray-100 px-2 py-1.5 text-gray-500">you@company.com</div>
                            <p className="mt-2 text-gray-400">Password</p>
                            <div className="mt-1 rounded-md border border-gray-100 px-2 py-1.5 text-gray-500">••••••••</div>
                            <div className="mt-3 rounded-md bg-gray-950 py-1.5 text-center text-white">Continue</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="mt-8 flex justify-end">
                <PillButton href={primaryHref}>{primaryLabel}</PillButton>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 03 CAPABILITIES (ORBIT) ============================ */}
        <section id="capabilities" className="scroll-mt-16 overflow-hidden py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <SectionTag number="03" label="Capabilities" />
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-right">
                One assistant that understands every format
              </h2>
            </div>

            {/* Orbit (desktop) */}
            <div className="relative mx-auto mt-16 hidden aspect-square max-w-3xl md:block">
              <div className="absolute inset-0 rounded-full bg-violet-50/70" />
              <div className="absolute inset-[14%] rounded-full bg-violet-100/50" />
              <div className="absolute inset-[30%] rounded-full bg-violet-200/40" />
              <div className="absolute inset-0 animate-[spin_60s_linear_infinite] rounded-full border border-dashed border-violet-200" />
              <div className="absolute inset-[41%] flex items-center justify-center rounded-full bg-gray-950 shadow-2xl shadow-violet-900/40">
                <Bot className="h-1/2 w-1/2 text-white" />
              </div>
              {orbitChips.map(({ icon: Icon, text, pos }, i) => (
                <div
                  key={text}
                  className={`absolute ${pos} ${i % 2 ? 'animate-float-slow' : 'animate-float'} inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-4 py-2.5 text-sm text-gray-700 shadow-lg shadow-violet-900/5 backdrop-blur`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100">
                    <Icon className="h-3.5 w-3.5 text-violet-600" />
                  </span>
                  {text}
                </div>
              ))}
            </div>

            {/* Chips (mobile) */}
            <div className="mt-12 grid gap-3 md:hidden">
              {orbitChips.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-violet-50/50 px-4 py-3 text-sm">
                  <Icon className="h-4 w-4 text-violet-600" />
                  {text}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gray-100 bg-gray-100 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white p-8 text-center">
                  <p className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-4xl font-semibold text-transparent">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 04 TESTIMONIALS ============================ */}
        <section className="bg-gray-50/60 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_2fr]">
            <div className="flex flex-col">
              <SectionTag number="04" label="Testimonials" />
              <div className="mt-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-500/20">
                <Quote className="h-10 w-10 text-white" />
              </div>
              <h2 className="mt-auto pt-10 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                What our users are saying
              </h2>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setSlide((s) => Math.max(0, s - 1))}
                  disabled={slide === 0}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSlide((s) => Math.min(maxSlide, s + 1))}
                  disabled={slide === maxSlide}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-white disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(calc(-${slide} * ${perView === 2 ? '(50% + 0.5rem)' : '(100% + 1rem)'}))` }}
              >
                {testimonials.map((t) => (
                  <figure
                    key={t.name}
                    className="mr-4 flex w-full shrink-0 flex-col rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:w-[calc(50%-0.5rem)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-5xl font-serif leading-none text-violet-300">&ldquo;</span>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium text-white ${t.color}`}>
                        {t.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <blockquote className="mt-4 flex-1 text-xl leading-snug text-gray-800">{t.quote}</blockquote>
                    <figcaption className="mt-8">
                      <p className="font-medium">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 05 FAQ ============================ */}
        <section id="faq" className="scroll-mt-16 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <SectionTag number="05" label="FAQ" />
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 max-w-sm text-gray-500">
                Everything you need to know before your first conversation.
              </p>
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-gray-100 bg-violet-50/50 p-4 text-sm">
                <ShieldCheck className="h-5 w-5 shrink-0 text-violet-600" />
                Your chats and memories are private to your account.
              </div>
            </div>
            <div className="space-y-3">
              {faqs.map((f, i) => {
                const open = openFaq === i
                return (
                  <div
                    key={f.q}
                    className={`rounded-2xl border transition ${open ? 'border-violet-200 bg-violet-50/40 shadow-sm' : 'border-gray-100 bg-white'}`}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      className="flex w-full items-center gap-4 px-6 py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="text-sm text-gray-400">0{i + 1}</span>
                      <span className="flex-1 font-medium">{f.q}</span>
                      {open ? <Minus className="h-4 w-4 text-violet-600" /> : <Plus className="h-4 w-4 text-gray-400" />}
                    </button>
                    {open && <p className="px-6 pb-6 pl-[3.6rem] text-sm leading-relaxed text-gray-500">{f.a}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================ CTA ============================ */}
        <section className="px-4 pb-24 sm:px-6">
          <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-b from-violet-50 to-white px-6 py-24 text-center sm:py-32">
            <div className="bg-grid absolute inset-0 -z-10" />
            <div className="absolute -left-20 top-0 -z-10 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl" />
            <div className="absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
            {ctaAvatars.map((a, i) => (
              <span
                key={a.initials}
                className={`absolute ${a.pos} ${a.size} ${a.color} ${i % 2 ? 'animate-float-slow' : 'animate-float'} hidden items-center justify-center rounded-full border-4 border-white text-xs font-medium text-white shadow-lg md:flex`}
              >
                {a.initials}
              </span>
            ))}
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Ready to supercharge your conversations?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-gray-500">
              Create a free account and start chatting with Claude and Gemini in under a minute.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PillButton href={primaryHref}>{primaryLabel}</PillButton>
              {!signedIn && (
                <PillButton href="/auth/login" variant="light">Sign in</PillButton>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 md:flex-row md:items-center">
            <Logo dark />
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-sm items-center gap-2 rounded-full bg-white/5 p-1.5 ring-1 ring-white/10">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              />
              <button className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500">
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
            {[
              { title: 'Product', links: [['Benefits', '#benefits'], ['How it works', '#how-it-works'], ['Capabilities', '#capabilities'], ['FAQ', '#faq']] },
              { title: 'Account', links: [['Sign up', '/auth/signup'], ['Sign in', '/auth/login'], ['Open app', '/chat'], ['Settings', '/settings']] },
              { title: 'Models', links: [['Anthropic Claude', '#capabilities'], ['Google Gemini', '#capabilities']] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-widest text-white">{col.title}</p>
                <ul className="mt-5 space-y-3 text-sm">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="hover:text-white">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white">Follow us</p>
              <div className="mt-5 flex gap-2">
                {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social link" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:text-white">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-white/10 pt-8 text-sm sm:flex-row">
            <span>© {new Date().getFullYear()} {BRAND}. All rights reserved.</span>
            <span>Built with Next.js, Claude &amp; Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
