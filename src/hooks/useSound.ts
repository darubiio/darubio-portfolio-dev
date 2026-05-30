"use client";

import { useCallback, useEffect, useState } from "react";
import { blip } from "@/lib/sound";

const STORAGE_KEY = "rubio-sound";

function readInitialSound(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "on";
}

export function useSound() {
  const [sound, setSound] = useState<boolean>(readInitialSound);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sound ? "on" : "off");
  }, [sound]);

  const toggleSound = useCallback(() => setSound((s) => !s), []);

  const playKey = useCallback(() => {
    if (sound) blip();
  }, [sound]);

  return { sound, toggleSound, playKey };
}
