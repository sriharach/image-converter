import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type recordTypeState = {
    type_convert_name: string,
     setTypeConvertName: (type: string) => void | never
}


export const useTypeName = create(devtools<Readonly<recordTypeState>>((set) => ({
    type_convert_name: 'webp',
     setTypeConvertName: (type: string) => set({
        type_convert_name: type
    })
})))