import { create } from "zustand"


type State = {
    user: User | null;
}

type Action = {
    addUser: (user: State["user"]) => void;
    removeUser: () => void;
}

const useUserStore = create<State & Action>((set) => ({
    user: null,
    addUser: (user) => set({ user: user}),
    removeUser: () => set({ user: null}),
}))

export default useUserStore;