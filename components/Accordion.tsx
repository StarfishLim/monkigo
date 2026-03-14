import { useState } from "react";

export type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

const ACCORDION_ID = "faq-accordion";

export function Accordion({ items, className = "" }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className={"flex flex-col gap-2 " + className}
      role="region"
      aria-label="FAQ"
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${ACCORDION_ID}-trigger-${index}`;
        const panelId = `${ACCORDION_ID}-panel-${index}`;

        return (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white"
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full min-h-[3rem] items-center justify-between gap-2 px-3 py-2.5 text-left transition active:bg-slate-50/80"
              >
                <span className="text-[15px] font-bold text-slate-800">
                  {item.question}
                </span>
                <span
                  className="shrink-0 text-slate-500 transition-transform duration-200 ease-out"
                  aria-hidden
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="px-3 pb-3 pt-0">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
