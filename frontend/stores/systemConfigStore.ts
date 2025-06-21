
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SystemConfig {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    storeEmail: string;
    cnpj: string;

    setStoreName: (name: string) => void;
    setStoreAddress: (address: string) => void;
    setStorePhone: (phone: string) => void;
    setStoreEmail: (email: string) => void;
    setCnpj: (cnpj: string) => void;
    clearConfigStore: () => void;

}

const useSystemConfigStore = create<SystemConfig>()(
    persist(
        (set) => ({
            setStoreName: (name) => set({ storeName: name }),
            storeName: '',
            setStoreAddress: (address) => set({ storeAddress: address }),
            storeAddress: '',
            setStorePhone: (phone) => set({ storePhone: phone }),
            storePhone: '',
            setStoreEmail: (email) => set({ storeEmail: email }),
            storeEmail: '',
            setCnpj: (cnpj) => set({ cnpj }),
            cnpj: '',
            clearConfigStore: () => set({
                storeName: '',
                storeAddress: '',
                storePhone: '',
                storeEmail: '',
                cnpj: '',
            }),
        }),
        {
            name: 'system-config',
        }
    )
);

export default useSystemConfigStore;
export type { SystemConfig };