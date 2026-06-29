/**
 * Realistic iPhone hardware mockup — desktop only (1024px+).
 * On mobile/tablet, renders a plain full-viewport screen with no device chrome.
 * Dynamic Island and home indicator are device overlays, not part of the app.
 */
export default function IPhoneFrame({ children }) {
  return (
    <div className="iphone-frame">
      {/* ── Physical device (decorative, lg+ only) ── */}
      <div className="iphone-hardware" aria-hidden="true">
        <div className="iphone-outer-rim" />
        <div className="iphone-inner-bezel" />
        <div className="iphone-btn iphone-btn-action" />
        <div className="iphone-btn iphone-btn-vol-up" />
        <div className="iphone-btn iphone-btn-vol-down" />
        <div className="iphone-btn iphone-btn-power" />
        <div className="iphone-dynamic-island" />
        <div className="iphone-home-indicator" />
      </div>

      {/* ── App screen (clipped inside the device on desktop) ── */}
      <div className="iphone-app-screen">{children}</div>
    </div>
  )
}
