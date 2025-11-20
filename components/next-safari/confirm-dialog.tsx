"use client"

type Props = {
  message: string
  onCancel: () => void
  onConfirm: () => void
  open?: boolean
}

export default function ConfirmDialog({
  message,
  onCancel,
  onConfirm,
  open = true,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl px-5 py-4 shadow-lg max-w-xs w-full text-sm">
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-xl border border-gray-400 text-xs"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-xl bg-black text-white text-xs"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}
