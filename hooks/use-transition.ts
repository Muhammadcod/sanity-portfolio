"use client";

import {create} from "zustand";

interface TransitionState {
  isTransitioning: boolean;
  activeSection: string | null;
  startTransition: (section: string, callback: () => void) => void;
  endTransition: () => void;
}

export const useTransition = create<TransitionState>((set) => ({
  isTransitioning: false,
  activeSection: null,
  startTransition: (section: string, callback: () => void) => {
    set({isTransitioning: true, activeSection: section});
    // Small delay to allow the animation to start
    setTimeout(() => {
      callback();
    }, 100);
  },
  endTransition: () => {
    set({isTransitioning: false, activeSection: null});
  },
}));
