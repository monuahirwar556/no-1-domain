import { create } from 'zustand'

export interface Toast {
  id: string
  title?: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'danger'
  dismiss: () => void
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: { title?: string; message: string; variant?: Toast['variant'] }) => string
  dismissToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const dismiss = () => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    set((state) => ({ toasts: [...state.toasts, { ...toast, id, dismiss }] }))
    setTimeout(dismiss, 5000)
    return id
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function useToast() {
  return useToastStore()
}
