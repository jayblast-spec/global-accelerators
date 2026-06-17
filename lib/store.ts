"use client";

import { useState, useEffect, useCallback } from "react";
import type { AccelState, SavedAccelerator, StartupProfile, ApplicationStatus } from "./types";

const KEY = "accel_state";

const DEFAULT: AccelState = {
  savedAccelerators: [],
  startupProfile: null,
  lastUpdated: new Date().toISOString(),
};

function load(): AccelState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function save(state: AccelState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, lastUpdated: new Date().toISOString() }));
  } catch {}
}

export function useAccelStore() {
  const [state, setState] = useState<AccelState>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  const update = useCallback((next: AccelState) => {
    save(next);
    setState(next);
  }, []);

  const saveAccelerator = useCallback((entry: Omit<SavedAccelerator, "savedAt" | "status" | "notes">) => {
    setState(prev => {
      const exists = prev.savedAccelerators.find(s => s.acceleratorId === entry.acceleratorId);
      if (exists) return prev;
      const next = {
        ...prev,
        savedAccelerators: [
          ...prev.savedAccelerators,
          { ...entry, savedAt: new Date().toISOString(), status: "interested" as ApplicationStatus, notes: "" },
        ],
      };
      save(next);
      return next;
    });
  }, []);

  const unsaveAccelerator = useCallback((acceleratorId: string) => {
    setState(prev => {
      const next = { ...prev, savedAccelerators: prev.savedAccelerators.filter(s => s.acceleratorId !== acceleratorId) };
      save(next);
      return next;
    });
  }, []);

  const isSaved = useCallback((acceleratorId: string) => {
    return state.savedAccelerators.some(s => s.acceleratorId === acceleratorId);
  }, [state.savedAccelerators]);

  const updateStatus = useCallback((acceleratorId: string, status: ApplicationStatus) => {
    setState(prev => {
      const next = {
        ...prev,
        savedAccelerators: prev.savedAccelerators.map(s =>
          s.acceleratorId === acceleratorId ? { ...s, status } : s
        ),
      };
      save(next);
      return next;
    });
  }, []);

  const updateNotes = useCallback((acceleratorId: string, notes: string) => {
    setState(prev => {
      const next = {
        ...prev,
        savedAccelerators: prev.savedAccelerators.map(s =>
          s.acceleratorId === acceleratorId ? { ...s, notes } : s
        ),
      };
      save(next);
      return next;
    });
  }, []);

  const setStartupProfile = useCallback((profile: StartupProfile) => {
    setState(prev => {
      const next = { ...prev, startupProfile: profile };
      save(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    update(DEFAULT);
  }, [update]);

  return {
    state,
    hydrated,
    savedAccelerators: state.savedAccelerators,
    startupProfile: state.startupProfile,
    saveAccelerator,
    unsaveAccelerator,
    isSaved,
    updateStatus,
    updateNotes,
    setStartupProfile,
    clearAll,
  };
}
