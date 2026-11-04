"use client";
import { iconHue } from "../lib/icon-color";
import { useState } from "react";
import {
  ArchiveIcon,
  BellRingingIcon,
  ChartLineUpIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  BugIcon,
  SparkleIcon,
  GitBranchIcon,
  FileTextIcon,
  CalendarDotsIcon,
  ListChecksIcon,
  FlaskIcon,
  PlugsConnectedIcon,
  DatabaseIcon,
} from "@phosphor-icons/react";
const generic = new Set([
  "icons/file.svg",
  "icons/dashboard.svg",
  "icons/hierarchy.svg",
  "icons/todo.svg",
]);
export default function FileIcon({
  icon,
  file,
}: {
  icon: string;
  file: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  if (/^icons\/(brand|work)-[a-z0-9._-]+\.svg$/.test(icon) && failed !== icon) {
    const source = `/${icon}`;
    return (
      <span
        aria-hidden="true"
        className="catalog-file-icon"
        style={{
          backgroundColor: `hsl(${iconHue(file)} 45% var(--icon-lightness))`,
          maskImage: `url(${JSON.stringify(source)})`,
          WebkitMaskImage: `url(${JSON.stringify(source)})`,
        }}
      >
        <img
          src={source}
          alt=""
          style={{ display: "none" }}
          onError={() => setFailed(icon)}
        />
      </span>
    );
  }
  if (!generic.has(icon) && failed !== icon)
    return (
      <img
        src={icon.startsWith("https://") ? icon : `/${icon}`}
        alt=""
        onError={() => setFailed(icon)}
      />
    );
  const name = file.toLowerCase();
  const Icon = /quota|security|permission/.test(name)
    ? ShieldCheckIcon
    : /migration|archive/.test(name)
      ? ArchiveIcon
      : /notif|remind/.test(name)
        ? BellRingingIcon
        : /observability|analytic|report/.test(name)
          ? ChartLineUpIcon
          : /viewer|dashboard|interface/.test(name)
            ? SquaresFourIcon
            : /calendar|schedule/.test(name)
              ? CalendarDotsIcon
              : /test|verify/.test(name)
                ? FlaskIcon
                : /integration|sync/.test(name)
                  ? PlugsConnectedIcon
                  : /database|storage/.test(name)
                    ? DatabaseIcon
                    : /todo/.test(name)
                      ? ListChecksIcon
                      : /bug\./.test(name)
                        ? BugIcon
                        : /feature\./.test(name)
                          ? SparkleIcon
                          : /git|release/.test(name)
                            ? GitBranchIcon
                            : FileTextIcon;
  return (
    <Icon
      size={23}
      weight="duotone"
      aria-hidden="true"
      className="tracker-icon"
    />
  );
}
