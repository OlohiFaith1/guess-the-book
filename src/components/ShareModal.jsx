import { useState } from "react"
import Modal from "./ui/Modal"
import AnimatedButton from "./ui/AnimatedButton"

/** Share modal with a mock link and Copy Link button. */
export default function ShareModal({ isOpen, onClose }) {
  const mockLink = "https://guess-the-book.app/play"
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mockLink)
    } catch {
      // Clipboard may be blocked in some browsers
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabelledBy="share-modal-title">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 id="share-modal-title" className="text-base font-semibold text-gray-900">
            Share this game with your friends
          </h2>
          <AnimatedButton
            variant="secondary"
            onClick={onClose}
            className="p-1 rounded-md -mt-1"
            aria-label="Close share dialog"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </AnimatedButton>
        </div>

        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 mt-4">
          <span className="flex-1 text-sm text-text-secondary truncate">{mockLink}</span>
          <AnimatedButton
            onClick={handleCopy}
            className="shrink-0 px-3 py-1.5 rounded-md text-xs"
            aria-label="Copy game link"
          >
            {copied ? "Copied!" : "Copy Link"}
          </AnimatedButton>
        </div>
      </div>
    </Modal>
  )
}
