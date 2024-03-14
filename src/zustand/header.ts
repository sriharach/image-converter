import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export enum EHeaderStoreState {
  IMAGE = 'Image',
  VIDEO = 'Video',
  FILE = 'Flie'
}

interface HeaderStoreState {
  text: string
  setHeader: (k: string) => void
}

export const useHeaderStore = create(
  devtools<HeaderStoreState>((set) => ({
    text: EHeaderStoreState.IMAGE,
    setHeader: (k) => set({ text: k }),
  })),
)
