import IPhoneFrame from "./IPhoneFrame"
import SoundToggle from "./ui/SoundToggle"
import DesktopDecor from "./DesktopDecor"

/**
 * Root layout wrapper.
 * Mobile: full-viewport white app, no hardware.
 * Desktop (1024px+): warm dotted landing background, the phone as hero, with
 * floating books/doodles/annotations quietly supporting it around the edges.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="phone-backdrop">
      <DesktopDecor />

      <div className="iphone-stage">
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
        <div className="iphone-shadow" aria-hidden="true" />
      </div>
    </div>
  )
}
