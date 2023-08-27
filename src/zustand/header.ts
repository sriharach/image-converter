import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export enum EHeaderStoreState {
  IMAGE = 'Image converter',
  VIDEO = 'Video converter',
}

interface HeaderStoreState {
  text: EHeaderStoreState
  setHeader: (k: EHeaderStoreState) => void
}

export const useHeaderStore = create(
  devtools<HeaderStoreState>((set) => ({
    text: EHeaderStoreState.IMAGE,
    setHeader: (k) => set({ text: k }),
  })),
)
