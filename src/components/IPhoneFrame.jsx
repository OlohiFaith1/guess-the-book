/**
 * Clean iPhone mockup — desktop only (1024px+).
 * On mobile/tablet, renders a plain full-viewport screen with no device chrome.
 *
 * The frame IS the parent container: it owns the bezel padding, so the
 * screen mask is a true DOM child that fills the resulting screen opening —
 * never an absolutely-positioned layer guessing at alignment behind/in front
 * of it. Kept deliberately minimal: just the bezel, the Dynamic Island, and
 * the home indicator — no side buttons or heavy outer glow.
 *
 * Structure:
 *   .iphone-frame            (device body: clean bezel + padding = screen opening)
 *     ├── .iphone-screen-mask  (the viewport: overflow hidden, app fills 100%/100%)
 *     │     └── App UI
 *     └── .iphone-chrome-overlay (Dynamic Island + home indicator — above the screen)
 */
export default function IPhoneFrame({ children }) {
  return (
    <div className="iphone-frame">
      {/* ── Screen mask: the phone's viewport. Real child of the frame — the
          app is clipped and contained inside it, filling it edge-to-edge. ── */}
      <div className="iphone-screen-mask">{children}</div>

      {/* ── Device chrome overlay (decorative, lg+ only), above the screen ── */}
      <div className="iphone-chrome-overlay" aria-hidden="true">
        <div className="iphone-dynamic-island" />
        <div className="iphone-home-indicator" />
      </div>
    </div>
  )
}
