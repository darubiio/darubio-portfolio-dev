"use client";

import { useCallback, useSyncExternalStore } from "react";
import { blip } from "@/lib/sound";
import { createPersistedStore } from "@/lib/persistedState";

const store = createPersistedStore<"on" | "off">("rubio-sound", "off", (raw) => (raw === "on" ? "on" : "off"));

export function useSound() {
  const sound = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot) === "on";

  const toggleSound = useCallback(() => store.set(store.getSnapshot() === "on" ? "off" : "on"), []);

  const playKey = useCallback(() => {
    if (store.getSnapshot() === "on") blip();
  }, []);

  return { sound, toggleSound, playKey };
}
