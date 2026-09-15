import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTITIONS = 8;
const TOTAL_EVENTS = 80;
const TICK_MS = 80;
const BALL_MS = 260;

const KEY_CONFIGS = {
  country_code: {
    description:
      "Partition key is country_code. 70% of your traffic comes from one country, so 70% of events hash into one partition.",
    weights: [0.7, ...Array(PARTITIONS - 1).fill(0.3 / (PARTITIONS - 1))],
  },
  user_id: {
    description: "Partition key is user_id. IDs hash roughly uniformly, so events spread evenly across all partitions.",
    weights: Array(PARTITIONS).fill(1 / PARTITIONS),
  },
} as const;

type KeyName = keyof typeof KEY_CONFIGS;
type Ball = { id: number; idx: number; startX: number; startY: number; endX: number; endY: number };

function pickPartition(weights: readonly number[]): number {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return i;
  }
  return weights.length - 1;
}

export default function KafkaPartitionKeyMotion() {
  const [activeKey, setActiveKey] = useState<KeyName>("country_code");
  const [counts, setCounts] = useState<number[]>(Array(PARTITIONS).fill(0));
  const [produced, setProduced] = useState(0);
  const [status, setStatus] = useState<"idle" | "streaming…" | "done">("idle");
  const [balls, setBalls] = useState<Ball[]>([]);

  const intervalRef = useRef(0);
  const ballIdRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  const maxCount = Math.max(...counts, 1);
  const hottestIdx = produced > 0 ? counts.indexOf(maxCount) : -1;
  const hottestPct = produced > 0 ? Math.round((maxCount / produced) * 100) : 0;
  const verdict =
    status === "streaming…" ? "streaming…" : status === "done" ? (maxCount / produced > 0.35 ? "hot partition" : "well balanced") : "—";

  function reset() {
    clearInterval(intervalRef.current);
    setBalls([]);
    setCounts(Array(PARTITIONS).fill(0));
    setProduced(0);
    setStatus("idle");
  }

  function spawnBall(idx: number) {
    const stageRect = stageRef.current!.getBoundingClientRect();
    const badgeRect = badgeRef.current!.getBoundingClientRect();
    const trackRect = trackRefs.current[idx]!.getBoundingClientRect();

    setBalls((prev) => [
      ...prev,
      {
        id: ballIdRef.current++,
        idx,
        startX: badgeRect.left + badgeRect.width / 2 - stageRect.left,
        startY: badgeRect.bottom - stageRect.top,
        endX: trackRect.left + trackRect.width / 2 - stageRect.left,
        endY: trackRect.top - stageRect.top,
      },
    ]);
  }

  // Bar height/count only update once a ball lands, so the fill visually
  // matches the ball arriving instead of jumping ahead of it.
  function land(ball: Ball) {
    setBalls((prev) => prev.filter((b) => b.id !== ball.id));
    setCounts((prev) => prev.map((c, i) => (i === ball.idx ? c + 1 : c)));
    setProduced((prev) => {
      const next = prev + 1;
      if (next >= TOTAL_EVENTS) setStatus("done");
      return next;
    });
  }

  function play() {
    const weights = KEY_CONFIGS[activeKey].weights;
    setBalls([]);
    setCounts(Array(PARTITIONS).fill(0));
    setProduced(0);
    setStatus("streaming…");

    let spawned = 0;
    intervalRef.current = window.setInterval(() => {
      if (spawned >= TOTAL_EVENTS) {
        clearInterval(intervalRef.current);
        return;
      }
      spawned++;
      spawnBall(pickPartition(weights));
    }, TICK_MS);
  }

  function selectKey(key: KeyName) {
    if (status === "streaming…") return;
    reset();
    setActiveKey(key);
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-surface1 bg-mantle overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-surface1 px-4 py-3">
        <span className="text-xs font-mono uppercase tracking-wide text-subtext0">Partition Key</span>
        <div className="flex gap-2">
          {(Object.keys(KEY_CONFIGS) as KeyName[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectKey(key)}
              className="rounded-md px-3 py-1.5 text-sm font-mono font-semibold"
              style={{
                backgroundColor: activeKey === key ? "var(--ctp-text)" : "var(--ctp-surface0)",
                color: activeKey === key ? "var(--ctp-base)" : "var(--ctp-text)",
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeKey}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="text-sm text-subtext0 mb-5"
          >
            {KEY_CONFIGS[activeKey].description}
          </motion.p>
        </AnimatePresence>

        <div ref={stageRef} className="relative">
          <div className="flex justify-center mb-6">
            <span ref={badgeRef} className="inline-flex items-center gap-2 rounded-full bg-crust px-3 py-1.5 text-xs font-mono">
              <span className="uppercase text-subtext0">Producer</span>
              <motion.span key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-text">
                {status}
              </motion.span>
            </span>
          </div>

          <div className="flex justify-center gap-3 mb-2" style={{ height: 160, alignItems: "flex-end" }}>
            {counts.map((count, i) => (
              <div
                key={i}
                ref={(el) => {
                  trackRefs.current[i] = el;
                }}
                className="flex flex-col-reverse bg-surface0 border border-surface2 rounded-t overflow-hidden"
                style={{ width: "2.75rem", height: 160 }}
              >
                <motion.div
                  className={`w-full transition-colors duration-200 ${i === hottestIdx ? "bg-red" : "bg-red/30"}`}
                  animate={{ height: Math.max(4, (count / maxCount) * 160) }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            {balls.map((ball) => (
              <motion.div
                key={ball.id}
                className="absolute top-0 left-0 size-2.5 rounded-full bg-red"
                initial={{ x: ball.startX - 5, y: ball.startY - 5 }}
                animate={{ x: ball.endX - 5, y: ball.endY - 5 }}
                transition={{ duration: BALL_MS / 1000, ease: "easeIn" }}
                onAnimationComplete={() => land(ball)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {counts.map((count, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-0.5 rounded px-1 py-0.5 transition-colors duration-200 ${
                i === hottestIdx ? "bg-red/15 text-red" : ""
              }`}
              style={{ width: "2.75rem" }}
            >
              <span className={`text-xs font-mono ${i === hottestIdx ? "text-red" : "text-subtext0"}`}>P{i}</span>
              <span className={`text-xs font-mono ${i === hottestIdx ? "text-red" : "text-text"}`}>{count}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t border-surface1 pt-3 text-sm gap-2">
          <div>
            <span className="block text-xs text-subtext0">PRODUCED</span>
            <span className="font-mono text-text">
              {produced} / {TOTAL_EVENTS}
            </span>
          </div>
          <div>
            <span className="block text-xs text-subtext0">HOTTEST</span>
            <span className="font-mono text-text">{hottestIdx >= 0 ? `P${hottestIdx} (${hottestPct}%)` : "—"}</span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-subtext0">VERDICT</span>
            <span className="italic text-text">{verdict}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={play}
            disabled={status === "streaming…"}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue text-base hover:opacity-90 disabled:opacity-50"
          >
            {status === "streaming…" ? "Playing…" : "Play"}
          </button>
          <button type="button" onClick={reset} className="px-3 py-1.5 rounded-md text-sm font-medium border border-surface2 text-text hover:bg-surface0">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
