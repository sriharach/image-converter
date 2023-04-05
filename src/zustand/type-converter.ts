import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type recordTypeState = {
    type_image: string,
    setTypeImage: (type: string) => void | never
}


export const useTypeImage = create(devtools<Readonly<recordTypeState>>((set) => ({
    type_image: 'webp',
    setTypeImage: (type: string) => set({
        type_image: type
    })
})))