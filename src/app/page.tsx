"use client";

import { useMemo, useState } from "react";
import { Bot, ClipboardCheck, LoaderCircle, MapPinned, Radar, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Severity = "Low" | "Medium" | "High";

type Incident = {
  id: string;
  asset: string;
  issue: string;
  diagnosis: string;
  confidence: number;
  severity: Severity;
  summary: string;
  robotActions: string[];
  complianceFlags: string[];
  nextDecision: string;
};

const incidents: Incident[] = [
  {
    id: "culvert-joint-void",
    asset: "Culvert",
    issue: "Joint displacement and shoulder void",
    diagnosis: "Likely outlet joint washout with localized settlement risk",
    confidence: 92,
    severity: "High",
    summary: "The geometry gap and edge erosion pattern suggest the installed section has shifted outside tolerance. The next failure mode is shoulder collapse during heavy runoff.",
    robotActions: [
      "Run a slow close-range scan along the displaced joint.",
      "Capture three annotated photos from the BIM reference viewpoints.",
      "Flag the section for temporary traffic restriction until a field engineer confirms fill loss.",
    ],
    complianceFlags: [
      "Deviation tied to BIM package RV-14 / culvert chainage 112+40",
      "Inspection timestamp and operator recorded",
      "Repair recommendation ready for maintenance log export",
    ],
    nextDecision: "Dispatch a crew to verify backfill loss and prepare a short-term stabilization order.",
  },
  {
    id: "bridge-bearing-obstruction",
    asset: "Bridge",
    issue: "Bearing seat debris and drainage blockage",
    diagnosis: "Maintenance blockage with elevated corrosion risk around bearing seat",
    confidence: 87,
    severity: "Medium",
    summary: "The observed buildup is consistent with blocked drainage and trapped moisture around the bearing zone. Immediate structural failure is unlikely, but the degradation trend is real.",
    robotActions: [
      "Confirm the blockage depth with a focused underside sweep.",
      "Capture moisture-stained areas against the model reference plane.",
      "Generate a clean-out task and schedule follow-up inspection inside 14 days.",
    ],
    complianceFlags: [
      "Inspection linked to bridge object BR-08 in model package",
      "Maintenance class auto-tagged as preventive",
      "Follow-up window included in export record",
    ],
    nextDecision: "Issue a preventive maintenance order rather than a structural escalation.",
  },
  {
    id: "embankment-drainage-rut",
    asset: "Embankment",
    issue: "Surface rutting near drainage outlet",
    diagnosis: "Localized drainage concentration causing progressive erosion",
    confidence: 84,
    severity: "Medium",
    summary: "The surface pattern suggests runoff is bypassing the intended outlet path and cutting into the shoulder. This is fixable now; expensive later.",
    robotActions: [
      "Map the rut length and depth against the corridor model.",
      "Mark the outlet edge for reshaping and geotextile review.",
      "Package the findings for a next-shift maintenance handoff.",
    ],
    complianceFlags: [
      "Geotagged route section stored with inspection package",
      "Model delta summary prepared for supervisor review",
      "Corrective action category pre-filled for maintenance system",
    ],
    nextDecision: "Queue drainage reshaping before the next rain event rather than wait for resurfacing work.",
  },
];

const severityTone: Record<Severity, "default" | "warning" | "destructive"> = {
  Low: "default",
  Medium: "warning",
  High: "destructive",
};

const metrics = [
  { label: "Mode", value: "Mocked AI + BIM context" },
  { label: "Output", value: "Robot task pack" },
  { label: "Record", value: "Supervisor-ready" },
];

export default function Home() {
  const [asset, setAsset] = useState(incidents[0].asset);
  const [issue, setIssue] = useState(incidents[0].issue);
  const [packageRef, setPackageRef] = useState("RV-14 / Chainage 112+40");
  const [location, setLocation] = useState("North drainage corridor");
  const [operator, setOperator] = useState("Field robot unit 03");
  const [notes, setNotes] = useState("Standing water reported after yesterday's inspection round.");
  const [activeTab, setActiveTab] = useState("result");
  const [result, setResult] = useState<Incident | null>(incidents[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assetOptions = [...new Set(incidents.map((item) => item.asset))];
  const issueOptions = useMemo(
    () => incidents.filter((item) => item.asset === asset),
    [asset]
  );

  async function runDiagnosis() {
    if (!packageRef.trim() || !location.trim() || !operator.trim()) {
      setError("Add package reference, location, and operator before running the POC.");
      setResult(null);
      return;
    }

    setError(null);
    setIsRunning(true);
    setActiveTab("result");

    await new Promise((resolve) => setTimeout(resolve, 900));

    const match = incidents.find((item) => item.asset === asset && item.issue === issue) ?? null;
    setResult(match);
    setIsRunning(false);

    if (!match) {
      setError("No matching scenario found. Pick another issue to continue.");
    }
  }

  function handleAssetChange(nextAsset: string) {
    setAsset(nextAsset);
    const nextIssue = incidents.find((item) => item.asset === nextAsset)?.issue ?? "";
    setIssue(nextIssue);
  }

  return (
    <main className="min-h-screen bg-[#07111A] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-300">
                <span>Dog Walk Ventures</span>
                <span className="text-slate-500">/</span>
                <span>DWV POC</span>
                <span className="text-slate-500">/</span>
                <span>AEC</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                BIM-to-Field Robot Assistant
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Inspect a rural infrastructure asset, compare the observation to the BIM package, and generate the next robot task plus a supervisor-ready field record.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="bg-slate-950/70 backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Field intake</CardTitle>
                  <CardDescription>One happy-path inspection flow. No brochure behavior.</CardDescription>
                </div>
                <Badge>Prototype v0.1</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Asset type">
                  <Select value={asset} onValueChange={handleAssetChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Observed issue">
                  <Select value={issue} onValueChange={setIssue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueOptions.map((option) => (
                        <SelectItem key={option.id} value={option.issue}>
                          {option.issue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="BIM package / chainage">
                  <Input value={packageRef} onChange={(event) => setPackageRef(event.target.value)} />
                </Field>

                <Field label="Inspection location">
                  <Input value={location} onChange={(event) => setLocation(event.target.value)} />
                </Field>

                <Field label="Operator or robot unit">
                  <Input value={operator} onChange={(event) => setOperator(event.target.value)} />
                </Field>

                <Field label="Capture note">
                  <Textarea
                    className="min-h-11"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </Field>
              </div>

              <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Field capture placeholder</p>
                    <p className="mt-1 text-sm text-slate-400">
                      In the real product this is where live camera, robot telemetry, or model overlay would run.
                    </p>
                  </div>
                  <Button onClick={runDiagnosis} disabled={isRunning} className="min-w-44">
                    {isRunning ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
                    {isRunning ? "Running diagnosis" : "Run robot assist"}
                  </Button>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat icon={MapPinned} label="Location bound" value={location} />
                <MiniStat icon={Bot} label="Active unit" value={operator} />
                <MiniStat icon={ClipboardCheck} label="Package ref" value={packageRef} />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="bg-slate-950/70 backdrop-blur">
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>Diagnosis, robot tasking, and field record in one place.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="result">Diagnosis</TabsTrigger>
                    <TabsTrigger value="record">Field record</TabsTrigger>
                  </TabsList>

                  <TabsContent value="result" className="space-y-4">
                    {result ? (
                      <>
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Likely diagnosis</p>
                              <h2 className="mt-2 text-2xl font-semibold text-white">{result.diagnosis}</h2>
                            </div>
                            <Badge variant={severityTone[result.severity]}>{result.severity} severity</Badge>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{result.summary}</p>
                          <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                              Confidence {result.confidence}%
                            </span>
                            <span>Model-linked issue: {result.issue}</span>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                          <p className="text-sm font-medium text-slate-200">Robot next actions</p>
                          <ul className="mt-3 space-y-2 text-sm text-slate-300">
                            {result.robotActions.map((action) => (
                              <li key={action} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                          <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Recommended decision</p>
                          <p className="mt-2 text-sm font-medium text-emerald-50">{result.nextDecision}</p>
                        </div>
                      </>
                    ) : (
                      <EmptyState message={isRunning ? "Diagnosis in progress…" : "Run the inspection to generate a result."} />
                    )}
                  </TabsContent>

                  <TabsContent value="record" className="space-y-4">
                    {result ? (
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Supervisor-ready record</p>
                            <h3 className="mt-2 text-lg font-semibold text-white">{packageRef}</h3>
                          </div>
                          <Button variant="secondary" size="sm">
                            <Send className="h-4 w-4" />
                            Export draft
                          </Button>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <RecordLine label="Asset" value={asset} />
                          <RecordLine label="Issue" value={result.issue} />
                          <RecordLine label="Location" value={location} />
                          <RecordLine label="Operator" value={operator} />
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Site note</p>
                          <p className="mt-2 leading-6">{notes}</p>
                        </div>

                        <div className="mt-4 space-y-2">
                          {result.complianceFlags.map((flag) => (
                            <div key={flag} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                              <span>{flag}</span>
                              <span className="text-emerald-300">✓</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <EmptyState message={isRunning ? "Building the field record…" : "No field record yet."} />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-slate-950/70 backdrop-blur">
              <CardHeader>
                <CardTitle>Why this POC passes the test</CardTitle>
                <CardDescription>The product is above the fold. The venture process is not.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                <ChecklistItem title="Input" body="Select an asset, issue, and model reference." />
                <ChecklistItem title="Process" body="Run a mocked diagnosis against a constrained scenario set." />
                <ChecklistItem title="Output" body="Get robot actions plus a usable supervisor handoff record." />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof MapPinned; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <p className="text-[11px] uppercase tracking-[0.24em]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function RecordLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-slate-200">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-slate-400">{message}</div>;
}

function ChecklistItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}
