import { useState } from "react";
import Link from "next/link";
import { Accordion, type AccordionItem } from "../components/Accordion";

const steps = [
  {
    num: "1",
    title: "Pick a zone",
    body: "Choose an area around Upper Thomson MRT you want to explore.",
  },
  {
    num: "2",
    title: "Choose a monkey",
    body: "Browse the hidden monkeys in that zone and pick one to hunt for.",
  },
  {
    num: "3",
    title: "Hunt in the station",
    body: "Look carefully around the real station and use the clue to spot the matching artwork.",
  },
  {
    num: "4",
    title: "Tap “I found it!”",
    body: "Answer a quick question to unlock the monkey and move on to the next one.",
  },
];

const faqItems: AccordionItem[] = [
  {
    question: "Is this for all ages?",
    answer:
      "Yes. MonkiGo is designed to be simple, playful, and family-friendly. Anyone who enjoys exploring and spotting details can join the hunt.",
  },
  {
    question: "Do I need to find the monkeys in order?",
    answer:
      "No. You can start with any zone and choose whichever monkey you want to hunt first.",
  },
  {
    question: "What if I cannot find a monkey?",
    answer:
      "Take your time and look carefully around the station. Some monkeys are easier to spot, while others are hidden in unexpected places. Use the clues to guide your search.",
  },
  {
    question: "Will my progress be saved?",
    answer: "Yes. Your discoveries are saved on this device.",
  },
];

type TabId = "about" | "story" | "faq";

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<TabId>("about");

  const tabs = [
    { id: "about" as TabId, label: "About" },
    { id: "story" as TabId, label: "Story behind" },
    { id: "faq" as TabId, label: "FAQ" },
  ] as const;

  return (
    <div className="-mx-4 -mt-6 flex min-h-0 flex-1 flex-col px-3 pt-2">
      <header className="flex shrink-0 items-center justify-center gap-2 pt-7 pb-2">
        <Link
          href="/"
          className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/90 text-slate-600 transition active:scale-95"
          aria-label="Back to home"
        >
          <span className="text-lg font-semibold">←</span>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-center text-lg font-bold text-slate-800">
            MonkiGo
          </h1>
        </div>
        <div className="min-h-10 min-w-10 shrink-0" aria-hidden />
      </header>

      {/* Tabs */}
      <div
        className="mt-1 flex shrink-0 gap-0.5 rounded-2xl bg-slate-100/80 p-0.5"
        role="tablist"
        aria-label="About, Story, FAQ"
      >
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            id={`tab-${id}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(id);
            }}
            className={
              "min-h-10 flex-1 rounded-xl px-2 text-sm font-bold transition " +
              (activeTab === id
                ? "bg-white text-jungle"
                : "text-slate-600 active:bg-slate-200/60")
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-44 pt-3">
        <div className="mx-auto max-w-md">
          {activeTab === "about" && (
            <div
              id="panel-about"
              role="tabpanel"
              aria-labelledby="tab-about"
              className="flex flex-col gap-3"
            >
            <section className="rounded-3xl bg-white p-4" aria-labelledby="about-title">
              <h2
                id="about-title"
                className="text-sm font-extrabold uppercase tracking-wide text-jungle"
              >
                What is MonkiGo?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                MonkiGo is a playful station hunt inspired by the hidden monkey
                artworks around Upper Thomson MRT.
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                As you explore the station, match what you see in real life with
                the clues in the app and unlock the monkeys one by one.
              </p>
            </section>

            <section className="rounded-3xl bg-white p-4" aria-labelledby="steps-title">
              <h2
                id="steps-title"
                className="text-sm font-extrabold uppercase tracking-wide text-jungle"
              >
                How the Hunt Works
              </h2>
              <ul className="mt-3 space-y-2">
                {steps.map((step) => (
                  <li
                    key={step.num}
                    className="flex gap-3 rounded-2xl bg-slate-50/80 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-jungle text-base font-extrabold text-white">
                      {step.num}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="font-bold text-slate-800">{step.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl bg-white p-4" aria-labelledby="progress-title">
              <h2
                id="progress-title"
                className="text-sm font-extrabold uppercase tracking-wide text-jungle"
              >
                Your progress
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Your discoveries are saved on this device. If you want to start
                over, use the restart option in your profile.
              </p>
            </section>
            </div>
          )}

          {activeTab === "story" && (
            <div
              id="panel-story"
              role="tabpanel"
              aria-labelledby="tab-story"
              className="flex flex-col gap-3"
            >
            <section className="rounded-3xl bg-white p-4" aria-labelledby="story-title">
              <h2
                id="story-title"
                className="text-sm font-extrabold uppercase tracking-wide text-jungle"
              >
                The Story Behind MonkiGo
              </h2>
              <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
                <p>MonkiGo started from a simple moment of curiosity.</p>
                <p>
                  While passing through Upper Thomson MRT, Starfish Lim noticed
                  the hidden monkey artworks tucked around the station. They felt
                  playful, quiet, and easy to miss — like a tiny game already
                  hidden in everyday commuting.
                </p>
                <p>
                  That sparked an idea: What if this small moment of noticing
                  could become a fun experience for others too?
                </p>
                <p>
                  So MonkiGo became a self-initiated project that turns station
                  exploration into a lighthearted digital hunt. Instead of rushing
                  through the MRT, players are invited to slow down, look closer,
                  and enjoy the tiny details hidden in plain sight.
                </p>
                <p>
                  This project explores how digital interaction can encourage
                  curiosity in physical spaces. It combines exploration,
                  observation, and play into one simple experience.
                </p>
                <p>
                  At its heart, MonkiGo is about making an ordinary journey feel
                  a little more magical.
                </p>
              </div>
            </section>
            </div>
          )}

          {activeTab === "faq" && (
            <div
              id="panel-faq"
              role="tabpanel"
              aria-labelledby="tab-faq"
              className="flex flex-col gap-3"
            >
            <section className="rounded-3xl bg-white p-4" aria-labelledby="faq-title">
              <h2
                id="faq-title"
                className="text-sm font-extrabold uppercase tracking-wide text-jungle"
              >
                FAQ
              </h2>
              <Accordion items={faqItems} className="mt-3" />
            </section>
            </div>
          )}
        </div>
      </div>

      {/* Sticky "Start the hunt" above bottom nav – same width as main content (px-4), clear of nav */}
      <div className="safe-bottom fixed left-0 right-0 z-20" style={{ bottom: "7.5rem" }}>
        <div className="mx-auto w-full max-w-[420px] px-4">
          <Link
            href="/zones"
            className="mh-btn-duo mh-btn-bounce mx-auto flex min-h-12 w-[320px] items-center justify-center rounded-2xl bg-jungle px-4 py-3 text-base font-extrabold uppercase tracking-wide text-white"
          >
            Start the hunt
          </Link>
        </div>
      </div>
    </div>
  );
}
