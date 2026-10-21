// Theme preference: "light" | "dark" set data-theme on <html>;
// "system" (or nothing stored) leaves it unset so CSS follows the OS.

export const themes = ["light", "dark", "system"] as const;

export type Theme = (typeof themes)[number];

const STORAGE_KEY = "theme";
const CHANGE_EVENT = "themechange";

// Runs in <head> before first paint. Static string: no user input reaches it.
export const themeScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function setAttribute(theme: Theme) {
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
}

export function applyTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice still applies to this page view.
  }
  setAttribute(theme);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// For useSyncExternalStore: every toggle on the page (and other tabs) stays in sync.
export function subscribeTheme(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    setAttribute(readTheme());
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
