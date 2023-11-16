import { create } from 'zustand';

type ActiveObjectId = string | null;

type TUseActiveObjectId = {
    activeObjectId: ActiveObjectId;
    setActiveObjectId: (activeObjectId: ActiveObjectId) => void;
};

export const useActiveObjectId = create<TUseActiveObjectId>((set) => {
    return {
        activeObjectId: null,
        setActiveObjectId: (activeObjectId) => set(() => ({ activeObjectId })),
    };
});
