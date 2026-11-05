'use client'

import { useToast } from '@/hooks/use-toast'
import { Alert } from './Alert'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[360px] pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto animate-slideUp">
          <Alert
            variant={toast.variant || 'info'}
            dismissible
            onDismiss={() => toast.dismiss()}
            className="shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {toast.title && <p className="font-medium">{toast.title}</p>}
                <p className="text-sm mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => toast.dismiss()}
                className="flex-shrink-0 text-current opacity-50 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Alert>
        </div>
      ))}
    </div>
  )
}