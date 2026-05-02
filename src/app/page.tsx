"use client";

import { useState } from "react";

const actions = [
  "Capture the field context",
  "Run a likely diagnosis",
  "Review recommended action",
  "Generate a compliance-ready record",
];

export default function Home() {
  const [step, setStep] = useState(0);
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Dog Walk Ventures · AEC</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">BIM-to-Field Robot-Assist for Rural Infrastructure</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          Built from the venture-studio flow: service design, technical spec, product design, business model, brand direction, then implementation.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Core flow</h2>
            <div className="mt-4 space-y-3">
              {actions.map((item, index) => (
                <button
                  key={item}
                  onClick={() => setStep(index)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${step === index ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10 bg-slate-900/60'}`}
                >
                  <div className="text-sm text-slate-400">Step {index + 1}</div>
                  <div className="mt-1 font-medium text-slate-100">{item}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-emerald-300">Current focus</div>
              <div className="mt-2 text-lg font-semibold">{actions[step]}</div>
              <p className="mt-2 text-sm text-slate-200">
                This MVP is intentionally shaped by the upstream venture artifacts instead of skipping straight from idea to UI.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Venture build packet</h2>
            <p className="mt-2 text-sm text-slate-400">Generated before development starts.</p>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-300 whitespace-pre-wrap"># BIM-to-Field Robot-Assist for Rural Infrastructure

Linear: DOG-50
Industry: AEC

Artifacts:
- state/ventures/dog-50-bim-to-field-robot-assist-for-rural-infrastructure/01-service-design.md
- state/ventures/dog-50-bim-to-field-robot-assist-for-rural-infrastructure/02-technical-spec.md
- state/ventures/dog-50-bim-to-field-robot-assist-for-rural-infrastructure/03-product-design.md
- state/ventures/dog-50-bim-to-field-robot-assist-for-rural-infrastructure/04-business-design.md
- state/ventures/dog-50-bim-to-field-robot-assist-for-rural-infrastructure/05-brand-direction.md
- state/ventures/dog-50-bim-to-field-robot-assist-for-rural-infrastructure/06-launch-content.md
</pre>
          </section>
        </div>
      </div>
    </main>
  );
}
