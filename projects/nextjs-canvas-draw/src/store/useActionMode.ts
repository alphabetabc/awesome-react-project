import { create } from 'zustand';

import type { ActionMode, ActionModeType, ActionModeOption } from '@/config/types';

type TUseActionMode = {
    actionMode: ActionMode;
    setActionMode: (params: null | { type: ActionModeType; option?: ActionModeOption | null }) => void;
};

export const useActionMode = create<TUseActionMode>((set) => ({
    actionMode: null,
    setActionMode: (params) => {
        set(() => ({
            actionMode: params ? { type: params.type, option: params.option ?? null } : null,
        }));
    },
}));
