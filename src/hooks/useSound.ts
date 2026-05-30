"use client";

import { useCallback, useEffect, useState } from "react";
import { blip } from "@/lib/sound";

const STORAGE_KEY = "rubio-sound";

export function useSound() {
  const [sound, setSound] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSound(localStorage.getItem(STORAGE_KEY) === "on");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, sound ? "on" : "off");
  }, [sound, hydrated]);

  const toggleSound = useCallback(() => setSound((s) => !s), []);

  const playKey = useCallback(() => {
    if (sound) blip();
  }, [sound]);

  return { sound, toggleSound, playKey };
}
