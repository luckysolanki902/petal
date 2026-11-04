"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
type Option = { value: string; label: string; description?: string };
type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  title?: string;
  className?: string;
};
export default function SelectMenu({
  label,
  value,
  options,
  onChange,
  disabled,
  title,
  className = "",
}: Props) {
  const id = useId(),
    trigger = useRef<HTMLButtonElement>(null),
    menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(0);
  const selected = options.findIndex((o) => o.value === value);
  const search = useRef({ text: "", at: 0 });
  function position() {
    if (!trigger.current || !menu.current) return;
    const rect = trigger.current.getBoundingClientRect(),
      panel = menu.current;
    const width = Math.min(Math.max(rect.width, 240), window.innerWidth - 24);
    panel.style.width = `${width}px`;
    panel.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - width - 12))}px`;
    const below = window.innerHeight - rect.bottom - 16,
      above = rect.top - 16;
    const height = Math.min(320, Math.max(below, above));
    panel.style.maxHeight = `${Math.max(80, height)}px`;
    if (below >= Math.min(panel.scrollHeight, 320) || below >= above) {
      panel.style.top = `${rect.bottom + 7}px`;
      panel.style.bottom = "auto";
    } else {
      panel.style.bottom = `${window.innerHeight - rect.top + 7}px`;
      panel.style.top = "auto";
    }
  }
  function close() {
    menu.current?.hidePopover();
  }
  function show(index = selected < 0 ? 0 : selected) {
    if (disabled || !options.length) return;
    setActive(index);
    menu.current?.showPopover();
    position();
  }
  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    close();
    trigger.current?.focus();
    if (option.value !== value) onChange(option.value);
  }
  useEffect(() => {
    if (disabled) menu.current?.hidePopover();
  }, [disabled]);
  useEffect(() => {
    if (!open) return;
    position();
    const resize = () => position();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize, true);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize, true);
    };
  }, [open]);
  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open, id]);
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const key = event.key;
    if (
      ["ArrowDown", "ArrowUp", "Home", "End", "Enter", " ", "Escape"].includes(
        key,
      )
    )
      event.preventDefault();
    if (key === "Tab") {
      close();
      return;
    }
    if (key === "Escape") {
      close();
      return;
    }
    if (key === "Enter" || key === " ") {
      if (open) choose(active);
      else show();
      return;
    }
    if (key === "ArrowDown" || key === "ArrowUp") {
      if (!open)
        show(key === "ArrowUp" ? options.length - 1 : Math.max(0, selected));
      else
        setActive(
          (i) =>
            (i + (key === "ArrowDown" ? 1 : -1) + options.length) %
            options.length,
        );
      return;
    }
    if (key === "Home" || key === "End") {
      if (!open) show(key === "Home" ? 0 : options.length - 1);
      else setActive(key === "Home" ? 0 : options.length - 1);
      return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      search.current = {
        text:
          (now - search.current.at < 700 ? search.current.text : "") +
          key.toLowerCase(),
        at: now,
      };
      const index = options.findIndex((o) =>
        o.label.toLowerCase().startsWith(search.current.text),
      );
      if (index >= 0) {
        if (!open) show(index);
        else setActive(index);
      }
    }
  }
  return (
    <div className={`select-control ${className}`}>
      <button
        ref={trigger}
        type="button"
        className="select-trigger"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        disabled={disabled || !options.length}
        title={title}
        onKeyDown={keyboard}
        onClick={() => (open ? close() : show())}
      >
        <span>{options[selected]?.label || "Select…"}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div
        ref={menu}
        id={id}
        popover="auto"
        role="listbox"
        aria-label={label}
        className="select-options"
        onToggle={(event) => {
          const expanded =
            (event.nativeEvent as ToggleEvent).newState === "open";
          setOpen(expanded);
          if (expanded) position();
        }}
      >
        <div className="select-caption" aria-hidden="true">
          {label}
        </div>
        {options.map((option, index) => (
          <div
            key={option.value}
            id={`${id}-${index}`}
            role="option"
            aria-selected={option.value === value}
            className={`select-option ${active === index ? "is-active" : ""}`}
            onPointerMove={() => setActive(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span className="select-option-copy">
              <span>{option.label}</span>
              {option.description && <small>{option.description}</small>}
            </span>
            <Check
              size={15}
              aria-hidden="true"
              className={
                option.value === value
                  ? "option-check"
                  : "option-check invisible"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
