import IPhoneFrame from "./IPhoneFrame"
import SoundToggle from "./ui/SoundToggle"

/**
 * Root layout wrapper.
 * Mobile: full-viewport white app, no hardware.
 * Desktop (1024px+): black backdrop with realistic iPhone hardware mockup.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="phone-backdrop">
      <IPhoneFrame>
        <div className="iphone-app-chrome">
          <div className="absolute top-4 right-4 z-50">
            <SoundToggle />
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {children}
          </div>
        </div>
      </IPhoneFrame>
    </div>
  )
}
