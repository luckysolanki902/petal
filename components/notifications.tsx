"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  Bell,
  Check,
  Volume2,
  VolumeX,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { Toaster, toast, useSonner } from "sonner";
import SelectMenu from "./select-menu";
import {
  NOTIFICATION_SOUNDS as sounds,
  workspaceSounds,
} from "../lib/notification-sounds";
import {
  EMPTY_NOTIFICATIONS,
  noticeChange,
  observeActivity,
  parseNotifications,
  type Notice,
  type ActivitySnapshot,
  type NotificationState,
} from "../lib/notifications";
const ACTIVE = "petal:active-notification-toasts";
const KEY = "petal:notifications:v1",
  SOUND = "petal:notification-sound",
  TONES = "petal:workspace-sounds";
const accent = (id: string) => {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 360;
};
export default function Notifications({
  project,
  workspaces,
  theme,
  onOpen,
}: {
  project: string;
  workspaces: { id: string; name: string }[];
  theme: "dark" | "light";
  onOpen: (n: Notice) => void;
}) {
  const panelId = useId();
  const panel = useRef<HTMLDivElement>(null),
    audio = useRef<AudioContext | null>(null),
    state = useRef<NotificationState>(structuredClone(EMPTY_NOTIFICATIONS)),
    announced = useRef(new Set<string>());
  const { toasts } = useSonner();
  const [tones, setTones] = useState<Record<string, number>>({});
  const tonesRef = useRef(tones);
  tonesRef.current = tones;
  const [history, setHistory] = useState<Notice[]>([]),
    [scope, setScope] = useState(project || "all"),
    [sound, setSound] = useState(true),
    [error, setError] = useState("");
  const soundRef = useRef(true),
    openRef = useRef(onOpen);
  soundRef.current = sound;
  openRef.current = onOpen;
  function persist(next: NotificationState) {
    localStorage.setItem(KEY, JSON.stringify(next));
    state.current = next;
    setHistory(next.notices);
  }
  function rememberToast(id: string, add: boolean) {
    try {
      const ids: string[] = JSON.parse(sessionStorage.getItem(ACTIVE) || "[]");
      sessionStorage.setItem(
        ACTIVE,
        JSON.stringify(
          add ? [...new Set([...ids, id])] : ids.filter((x) => x !== id),
        ),
      );
    } catch (e) {
      console.warn("[petal:toast-session]", e);
    }
  }
  function clearStack() {
    try {
      sessionStorage.setItem(ACTIVE, "[]");
    } catch (e) {
      console.warn("[petal:toast-session]", e);
    }
    toast.dismiss();
  }
  function visit(n: Notice) {
    rememberToast(n.id, false);
    toast.dismiss(n.id);
    try {
      const current = parseNotifications(localStorage.getItem(KEY));
      persist({
        ...current,
        notices: current.notices.map((x) =>
          x.id === n.id ? { ...x, read: true } : x,
        ),
      });
    } catch (e) {
      setError((e as Error).message);
    }
    panel.current?.hidePopover();
    openRef.current(n);
  }
  function chime(projectId: string) {
    const ctx = audio.current;
    if (!soundRef.current || !ctx || ctx.state !== "running") return;
    try {
      const profile = sounds[tonesRef.current[projectId] ?? 0];
      profile.notes.forEach((frequency, index) => {
        const start = ctx.currentTime + index * 0.09;
        const o = ctx.createOscillator(),
          gain = ctx.createGain();
        o.type = "sine";
        o.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.045, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
        o.connect(gain);
        gain.connect(ctx.destination);
        o.onended = () => {
          o.disconnect();
          gain.disconnect();
        };
        o.start(start);
        o.stop(start + 0.32);
      });
    } catch (e) {
      console.warn("[petal:notification-sound]", e);
    }
  }
  function announce(notices: Notice[], play = true) {
    if (document.visibilityState !== "visible") return;
    const fresh = notices.filter((n) => !announced.current.has(n.id));
    for (const n of fresh) {
      announced.current.add(n.id);
      rememberToast(n.id, true);
      toast(noticeChange(n), {
        onDismiss: () => rememberToast(n.id, false),
        id: n.id,
        description: `${n.workspace} · ${n.title}`,
        duration: Infinity,
        style: { borderLeft: `3px solid hsl(${accent(n.project)} 55% 55%)` },
        action: { label: "View", onClick: () => visit(n) },
      });
    }
    if (play)
      for (const projectId of new Set(fresh.map((n) => n.project)))
        chime(projectId);
  }
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(TONES) || "{}");
      const next = workspaceSounds(
        workspaces.map((p) => p.id),
        saved,
      );
      setTones(next);
      localStorage.setItem(TONES, JSON.stringify({ ...saved, ...next }));
    } catch (e) {
      setError("Workspace sounds could not be saved.");
    }
  }, [workspaces.map((p) => p.id).join(",")]);
  useEffect(() => {
    let alive = true,
      working = false,
      controller: AbortController | undefined;
    try {
      state.current = parseNotifications(localStorage.getItem(KEY));
      setHistory(state.current.notices);
      for (const n of state.current.notices) announced.current.add(n.id);
      setSound(localStorage.getItem(SOUND) !== "off");
      const active: string[] = JSON.parse(
        sessionStorage.getItem(ACTIVE) || "[]",
      );
      const restore = state.current.notices.filter((n) =>
        active.includes(n.id),
      );
      for (const n of restore) announced.current.delete(n.id);
      announce(restore, false);
    } catch (e) {
      setError((e as Error).message);
    }
    const unlock = () => {
      try {
        audio.current ||= new AudioContext();
        if (audio.current.state === "suspended")
          void audio.current
            .resume()
            .catch((e) => console.warn("[petal:audio]", e));
      } catch (e) {
        console.warn("[petal:audio]", e);
      }
    };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    const sync = (e: StorageEvent) => {
      if (e.key === KEY) {
        try {
          const next = parseNotifications(e.newValue);
          state.current = next;
          setHistory(next.notices);
          for (const t of toast.getToasts()) {
            const item = next.notices.find((n) => n.id === String(t.id));
            if (!item || item.read) {
              rememberToast(String(t.id), false);
              toast.dismiss(t.id);
            }
          }
          announce(next.notices.filter((n) => !n.read));
        } catch (err) {
          setError((err as Error).message);
        }
      }
      if (e.key === SOUND) setSound(e.newValue !== "off");
      if (e.key === TONES) {
        try {
          const next = JSON.parse(e.newValue || "{}");
          setTones(
            Object.fromEntries(
              Object.entries(next).filter(
                ([, v]) =>
                  Number.isInteger(v) &&
                  Number(v) >= 0 &&
                  Number(v) < sounds.length,
              ),
            ) as Record<string, number>,
          );
        } catch {
          setError("Workspace sound preferences are invalid.");
        }
      }
    };
    window.addEventListener("storage", sync);
    const visible = () =>
      announce(state.current.notices.filter((n) => !n.read));
    document.addEventListener("visibilitychange", visible);
    async function poll() {
      if (working) return;
      working = true;
      controller = new AbortController();
      try {
        const res = await fetch("/api/activity", {
          cache: "no-store",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(10000),
          ]),
        });
        if (!res.ok) throw Error("Unable to refresh notifications.");
        const snapshot: ActivitySnapshot = await res.json();
        if (!alive) return;
        const update = async () => {
          if (!alive) return;
          const previous = parseNotifications(localStorage.getItem(KEY));
          const result = observeActivity(previous, snapshot);
          persist(result.state);
          setError(
            snapshot.unavailable.length
              ? "Some workspaces are unavailable. Their notification state is preserved."
              : "",
          );
          announce(result.added);
        };
        if (navigator.locks)
          await navigator.locks.request("petal-notifications", update);
        else await update();
      } catch (e) {
        if (alive && (e as Error).name !== "AbortError")
          setError((e as Error).message);
      } finally {
        working = false;
      }
    }
    void poll();
    const timer = setInterval(() => void poll(), 3000);
    return () => {
      alive = false;
      controller?.abort();
      clearInterval(timer);
      window.removeEventListener("storage", sync);
      document.removeEventListener("visibilitychange", visible);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      void audio.current?.close().catch(() => {});
      audio.current = null;
    };
  }, []);
  const unread = history.filter((n) => !n.read).length,
    visible = history.filter((n) => scope === "all" || n.project === scope);
  return (
    <>
      <button
        className="icon-button notification-trigger"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        title="Notifications"
        popoverTarget={panelId}
        popoverTargetAction="toggle"
        onClick={() => setScope(project || "all")}
      >
        <Bell size={18} />
        {unread > 0 && <span>{unread > 99 ? "99+" : unread}</span>}
      </button>
      <div
        ref={panel}
        id={panelId}
        popover="auto"
        className="notification-popover"
        aria-label="Notifications"
      >
        <header>
          <div>
            <strong>Notifications</strong>
            <small>{unread} unread · saved in this browser</small>
          </div>
          <button
            className="icon-button"
            title={
              sound ? "Mute notification sound" : "Enable notification sound"
            }
            aria-label={
              sound ? "Mute notification sound" : "Enable notification sound"
            }
            onClick={() => {
              const next = !sound;
              setSound(next);
              try {
                localStorage.setItem(SOUND, next ? "on" : "off");
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </header>
        <div
          className="notification-tabs"
          role="tablist"
          aria-label="Notification workspace"
        >
          {[{ id: "all", name: "All" }, ...workspaces].map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={scope === p.id}
              onClick={() => setScope(p.id)}
            >
              {p.name}
              <span>
                {
                  history.filter((n) => p.id === "all" || n.project === p.id)
                    .length
                }
              </span>
            </button>
          ))}
        </div>
        {error && (
          <p className="notification-error" role="status">
            {error}
          </p>
        )}
        {(scope === "all" ? project : scope) && (
          <label className="notification-sound-picker">
            Sound ·{" "}
            {
              workspaces.find(
                (p) => p.id === (scope === "all" ? project : scope),
              )?.name
            }
            <SelectMenu
              label="Workspace notification sound"
              value={String(tones[scope === "all" ? project : scope] ?? 0)}
              options={sounds.map((s, i) => ({
                value: String(i),
                label: s.name,
                color: accent(scope === "all" ? project : scope),
              }))}
              onChange={(value) => {
                const id = scope === "all" ? project : scope,
                  next = { ...tones, [id]: Number(value) };
                setTones(next);
                tonesRef.current = next;
                try {
                  localStorage.setItem(TONES, JSON.stringify(next));
                  chime(id);
                } catch (e) {
                  setError((e as Error).message);
                }
              }}
            />
          </label>
        )}
        <div
          className="notification-list"
          role="tabpanel"
          aria-label={
            scope === "all"
              ? "All workspace notifications"
              : `${workspaces.find((p) => p.id === scope)?.name || "Workspace"} notifications`
          }
        >
          {visible.length ? (
            visible.map((n) => (
              <button
                key={n.id}
                style={{ borderLeftColor: `hsl(${accent(n.project)} 55% 55%)` }}
                className={`notification-item ${n.read ? "" : "unread"}`}
                onClick={() => visit(n)}
              >
                <span className="notification-symbol">
                  {n.todo && n.done ? <Check size={16} /> : <Bell size={15} />}
                </span>
                <span>
                  <strong>{noticeChange(n)}</strong>
                  <span>{n.title}</span>
                  <small>
                    {n.workspace} · {n.file.split("/").pop()} ·{" "}
                    {new Date(n.at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </small>
                </span>
                <ArrowUpRight size={14} />
              </button>
            ))
          ) : (
            <div className="notifications-empty">
              <Bell size={24} />
              <strong>You’re all caught up</strong>
              <p>Status changes and completed to-dos will appear here.</p>
            </div>
          )}
        </div>
        <footer>
          <span>Latest 200 updates</span>
          <button
            className="text-button"
            disabled={!history.length}
            onClick={() => {
              try {
                const current = parseNotifications(localStorage.getItem(KEY));
                persist({ ...current, notices: [] });
                clearStack();
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <Trash2 size={13} />
            Clear all workspaces
          </button>
        </footer>
      </div>
      {toasts.some((t) => !("delete" in t && t.delete)) && (
        <button
          className="notification-clear-stack button"
          onClick={clearStack}
        >
          Clear toast stack
        </button>
      )}
      <Toaster
        theme={theme}
        position="bottom-right"
        offset={72}
        duration={Infinity}
        visibleToasts={3}
        closeButton
        toastOptions={{
          style: {
            background: "var(--paper)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          },
          className: "petal-notice-toast",
        }}
      />
    </>
  );
}
