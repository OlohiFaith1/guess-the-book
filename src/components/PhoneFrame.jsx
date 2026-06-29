import SoundToggle from "./ui/SoundToggle"

/**
 * Wraps the app in a phone-sized container.
 *
 * Mobile: full-width white app, no device chrome (unchanged).
 * Desktop: black backdrop with a realistic iPhone frame; screen stays white.
 */
export default function PhoneFrame({ children }) {
  return (
    /* Black table surface — only visible outside the phone on desktop */
    <div className="min-h-screen flex justify-center items-stretch md:items-center bg-white md:bg-black md:p-10">
      <div className="iphone-device relative w-full md:w-[393px] md:h-[852px] md:flex-shrink-0">
        {/* Desktop-only hardware buttons */}
        <div className="hidden md:block iphone-btn-silent" aria-hidden="true" />
        <div className="hidden md:block iphone-btn-volume-up" aria-hidden="true" />
        <div className="hidden md:block iphone-btn-volume-down" aria-hidden="true" />
        <div className="hidden md:block iphone-btn-power" aria-hidden="true" />

        {/* Bezel only on desktop; mobile has no frame */}
        <div className="h-full max-md:bg-white md:iphone-bezel">
          {/* Screen — always white, app renders exactly as designed */}
          <div className="h-full min-h-screen md:min-h-0 md:h-full md:iphone-screen relative flex flex-col bg-white">
            <div className="hidden md:block iphone-dynamic-island" aria-hidden="true" />

            <div className="absolute top-4 right-4 z-40 md:top-3 md:right-3">
              <SoundToggle />
            </div>

            <div className="iphone-content flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
              {children}
            </div>

            <div className="hidden md:block iphone-home-indicator" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
