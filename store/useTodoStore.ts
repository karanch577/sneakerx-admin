import { create } from "zustand";

type Todo = {
    title: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}

type State = {
    todos: Todo[];
    refetch: boolean;
}

type Action = {
    toggleRefetch: () => void;
    addTodos: (todos: Todo[]) => void;
    removeTodo: (id: number) => void;
    updateTodo: (id: number,  title: Todo["title"]) => void;
}

const useTodoStore = create<State & Action>((set) => ({
    todos: [],
    toggleRefetch: () => set(state => ({refetch: !state.refetch})),
    refetch: false,
    addTodos: (todos) => set({ todos, }),
    updateTodo: (id, title) => set(state => {
        const updatedTodos = state.todos.map(todo => todo.id === id ? ({...todo, title}) : todo)
        return ({
            todos: updatedTodos
        })
    }),
    removeTodo: (id) => set(state => ({ todos: state.todos.filter(item => item.id !== id ) }))
}))

export default useTodoStore;