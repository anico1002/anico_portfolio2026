"use client";

import Image from "next/image";

interface PhoneMockupProps {
  mediaUrl: string;
  isVideo: boolean;
  bgUrl?: string;
  phoneColor?: "black" | "white" | "starlight";
  phoneModel?: "iphone8" | "iphone14";
  palette?: number;
}

const PALETTE_GRADIENTS: Record<number, string> = {
  1: "from-neutral-700 to-neutral-900",
  2: "from-slate-700 to-slate-900",
  3: "from-zinc-700 to-zinc-900",
  4: "from-stone-700 to-stone-900",
  5: "from-gray-700 to-gray-900",
};

/*
 * iPhone 8 CSS verbatim from https://github.com/marvelapp/devices.css (MIT)
 * iPhone 14 CSS verbatim from https://github.com/picturepan2/devices.css (MIT)
 *
 * Scaling via --ps CSS variable on .ph-wrap / .ph-wrap.iphone14-model.
 * .ph-scaler applies transform: scale(var(--ps)) to the natural-size device.
 * .ph-wrap reserves the correct layout space at each breakpoint.
 *
 * iPhone 8  natural size: 423 × 877px  (375+48 × 667+210, content-box)
 * iPhone 14 natural size: 428 × 868px  (border-box, screen = 390×830)
 */
const DEVICE_CSS = `
  /* ── iPhone 8 scaling ── */
  .ph-wrap {
    --ps: 0.33;
    display: inline-block;
    position: relative;
    width:  calc(423px * var(--ps));
    height: calc(877px * var(--ps));
  }
  @media (min-width: 640px)  { .ph-wrap { --ps: 0.43; } }
  @media (min-width: 768px)  { .ph-wrap { --ps: 0.52; } }
  @media (min-width: 1024px) { .ph-wrap { --ps: 0.63; } }

  .ph-scaler {
    position: absolute;
    top: 0; left: 0;
    width: 423px;
    height: 877px;
    transform: scale(var(--ps));
    transform-origin: top left;
  }

  /* ── iPhone 14 scaling ── */
  .ph-wrap.iphone14-model {
    --ps: 0.33;
    width:  calc(428px * var(--ps));
    height: calc(868px * var(--ps));
  }
  @media (min-width: 640px)  { .ph-wrap.iphone14-model { --ps: 0.43; } }
  @media (min-width: 768px)  { .ph-wrap.iphone14-model { --ps: 0.52; } }
  @media (min-width: 1024px) { .ph-wrap.iphone14-model { --ps: 0.63; } }

  .ph-scaler.iphone14-model {
    position: absolute;
    top: 0; left: 0;
    width: 428px;
    height: 868px;
    transform: scale(var(--ps));
    transform-origin: top left;
  }

  /* ── devices.css (marvelapp) base ── */
  .marvel-device {
    display: inline-block;
    position: relative;
    box-sizing: content-box !important;
  }
  .marvel-device .screen {
    width: 100%;
    position: relative;
    height: 100%;
    z-index: 3;
    background: white;
    overflow: hidden;
    display: block;
    border-radius: 1px;
    box-shadow: 0 0 0 2px #bfbfc0;
  }
  .marvel-device .top-bar,
  .marvel-device .bottom-bar {
    height: 3px;
    background: black;
    width: 100%;
    display: block;
  }

  /* ── iPhone 8 (verbatim from marvelapp/devices.css) ── */
  .marvel-device.iphone8 {
    width: 375px;
    height: 667px;
    padding: 105px 24px;
    background: #d9dbdc;
    border-radius: 56px;
    box-shadow:
      inset 0 0 3px 0 rgba(0,0,0,0.2),
      0 24px 60px rgba(0,0,0,0.22),
      0  6px 18px rgba(0,0,0,0.14);
  }
  .marvel-device.iphone8:before {
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    position: absolute;
    top: 6px; left: 6px;
    content: '';
    border-radius: 50px;
    background: #f8f8f8;
    z-index: 1;
  }
  .marvel-device.iphone8:after {
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    position: absolute;
    top: 8px; left: 8px;
    content: '';
    border-radius: 48px;
    box-shadow: inset 0 0 3px 0 rgba(0,0,0,0.1), inset 0 0 6px 3px #fff;
    z-index: 2;
  }
  .marvel-device.iphone8 .home {
    border-radius: 100%;
    width: 68px; height: 68px;
    position: absolute;
    left: 50%; margin-left: -34px;
    bottom: 22px; z-index: 3;
    background: linear-gradient(135deg, #303233 0%, #b5b7b9 50%, #f0f2f2 69%, #303233 100%);
  }
  .marvel-device.iphone8 .home:before {
    background: #f8f8f8;
    position: absolute; content: '';
    border-radius: 100%;
    width: calc(100% - 8px); height: calc(100% - 8px);
    top: 4px; left: 4px;
  }
  .marvel-device.iphone8 .top-bar {
    height: 14px; background: #bfbfc0;
    position: absolute; top: 68px; left: 0;
  }
  .marvel-device.iphone8 .bottom-bar {
    height: 14px; background: #bfbfc0;
    position: absolute; bottom: 68px; left: 0;
  }
  .marvel-device.iphone8 .sleep {
    position: absolute; top: 190px; right: -4px;
    width: 4px; height: 66px;
    border-radius: 0px 2px 2px 0px; background: #d9dbdc;
  }
  .marvel-device.iphone8 .volume {
    position: absolute; left: -4px; top: 188px;
    z-index: 0; height: 66px; width: 4px;
    border-radius: 2px 0px 0px 2px; background: #d9dbdc;
  }
  .marvel-device.iphone8 .volume:before {
    position: absolute; left: 2px; top: -78px;
    height: 40px; width: 2px;
    border-radius: 2px 0px 0px 2px; background: inherit;
    content: ''; display: block;
  }
  .marvel-device.iphone8 .volume:after {
    position: absolute; left: 0px; top: 82px;
    height: 66px; width: 4px;
    border-radius: 2px 0px 0px 2px; background: inherit;
    content: ''; display: block;
  }
  .marvel-device.iphone8 .camera {
    background: #3c3d3d; width: 12px; height: 12px;
    position: absolute; top: 24px; left: 50%; margin-left: -6px;
    border-radius: 100%; z-index: 3;
  }
  .marvel-device.iphone8 .sensor {
    background: #3c3d3d; width: 16px; height: 16px;
    position: absolute; top: 49px; left: 134px;
    z-index: 3; border-radius: 100%;
  }
  .marvel-device.iphone8 .speaker {
    background: #292728; width: 70px; height: 6px;
    position: absolute; top: 54px; left: 50%; margin-left: -35px;
    border-radius: 6px; z-index: 3;
  }
  .marvel-device.iphone8.black {
    background: #464646;
    box-shadow: inset 0 0 3px 0 rgba(0,0,0,0.7), 0 24px 60px rgba(0,0,0,0.48), 0 6px 18px rgba(0,0,0,0.32);
  }
  .marvel-device.iphone8.black:before { background: #080808; }
  .marvel-device.iphone8.black:after { box-shadow: inset 0 0 3px 0 rgba(0,0,0,0.1), inset 0 0 6px 3px #212121; }
  .marvel-device.iphone8.black .top-bar,
  .marvel-device.iphone8.black .bottom-bar { background: #212121; }
  .marvel-device.iphone8.black .volume,
  .marvel-device.iphone8.black .sleep      { background: #464646; }
  .marvel-device.iphone8.black .camera     { background: #080808; }
  .marvel-device.iphone8.black .home { background: linear-gradient(135deg, #080808 0%, #464646 50%, #080808 100%); }
  .marvel-device.iphone8.black .home:before { background: #080808; }
  .marvel-device.iphone8.black .screen { box-shadow: 0 0 0 2px #3c3d3d; }

  /* ── picturepan2/devices.css base (MIT) ── */
  .device, .device *, .device ::after, .device ::before, .device::after, .device::before {
    box-sizing: border-box;
    display: block;
  }
  .device { position: relative; transform: scale(1); z-index: 1; }
  .device .device-frame { z-index: 1; }
  .device .device-screen {
    background-color: #000;
    background-position: center center;
    background-size: cover;
    object-fit: cover;
    position: relative;
    overflow: hidden;
  }

  /* ── iPhone 14 (verbatim from picturepan2/devices.css) ── */
  .device-iphone-14 { height: 868px; width: 428px; }
  .device-iphone-14 .device-frame { background: #010101; border: 1px solid #101315; border-radius: 68px; box-shadow: inset 0 0 4px 2px #b0b8c0, inset 0 0 0 6px #272c31, 0 24px 60px rgba(0,0,0,0.22), 0 6px 18px rgba(0,0,0,0.14); height: 868px; padding: 19px; width: 428px; }
  .device-iphone-14 .device-screen { border-radius: 49px; height: 830px; width: 390px; }
  .device-iphone-14 .device-stripe::after, .device-iphone-14 .device-stripe::before { border: solid rgba(1,1,1,.25); border-width: 0 7px; content: ""; height: 7px; left: 0; position: absolute; width: 100%; z-index: 9; }
  .device-iphone-14 .device-stripe::after  { top: 85px; }
  .device-iphone-14 .device-stripe::before { bottom: 85px; }
  .device-iphone-14 .device-header { background: #010101; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; height: 30px; left: 50%; margin-left: -80px; position: absolute; top: 20px; width: 160px; }
  .device-iphone-14 .device-header::after, .device-iphone-14 .device-header::before { content: ""; height: 10px; position: absolute; top: 0; width: 10px; }
  .device-iphone-14 .device-header::after  { background: radial-gradient(circle at bottom left,  transparent 0, transparent 75%, #010101 75%, #010101 100%); left: -10px; }
  .device-iphone-14 .device-header::before { background: radial-gradient(circle at bottom right, transparent 0, transparent 75%, #010101 75%, #010101 100%); right: -10px; }
  .device-iphone-14 .device-sensors::after, .device-iphone-14 .device-sensors::before { content: ""; position: absolute; }
  .device-iphone-14 .device-sensors::after  { background: #151515; border: 1px solid #010101; border-radius: 4px; box-shadow: 0 0 4px #151515; height: 7px; left: 50%; margin-left: -35px; top: 8px; width: 70px; }
  .device-iphone-14 .device-sensors::before { background: radial-gradient(farthest-corner at 20% 20%, #6074bf 0, transparent 40%), radial-gradient(farthest-corner at 80% 80%, #513785 0, #24555e 20%, transparent 50%); border-radius: 50%; box-shadow: 0 0 1px 1px rgba(255,255,255,.05); height: 9px; left: 50%; margin-left: -60px; top: 26px; width: 9px; }
  .device-iphone-14 .device-btns { background: #101315; border-radius: 2px; height: 32px; left: -2px; position: absolute; top: 115px; width: 3px; }
  .device-iphone-14 .device-btns::after, .device-iphone-14 .device-btns::before { background: #101315; border-radius: 2px; content: ""; height: 62px; left: 0; position: absolute; width: 3px; }
  .device-iphone-14 .device-btns::after  { top: 60px; }
  .device-iphone-14 .device-btns::before { top: 140px; }
  .device-iphone-14 .device-power { background: #101315; border-radius: 2px; height: 100px; position: absolute; right: -2px; top: 200px; width: 3px; }
  .device-iphone-14 .device-home::after, .device-iphone-14 .device-home::before { border: solid rgba(1,1,1,.25); border-width: 6px 0; content: ""; height: 6px; position: absolute; width: 6px; z-index: 9; }
  .device-iphone-14 .device-home::after  { right: 86px; top: 0; }
  .device-iphone-14 .device-home::before { bottom: 0; left: 86px; }
  /* Starlight (silver/white) variant */
  .device-iphone-14.device-starlight .device-frame { border-color: #bdb4aa; box-shadow: inset 0 0 4px 2px #fff, inset 0 0 0 6px #d3cdc7; }
  .device-iphone-14.device-starlight .device-btns,
  .device-iphone-14.device-starlight .device-btns::after,
  .device-iphone-14.device-starlight .device-btns::before { background: #bdb4aa; }
  .device-iphone-14.device-starlight .device-power { background: #bdb4aa; }
`;

export default function PhoneMockup({
  mediaUrl,
  isVideo,
  bgUrl,
  phoneColor = "black",
  phoneModel = "iphone8",
  palette = 1,
}: PhoneMockupProps) {
  const gradient = PALETTE_GRADIENTS[palette] ?? PALETTE_GRADIENTS[1];
  const is14 = phoneModel === "iphone14";

  // iphone8: "black" class for dark; iphone14: no class = black, "device-starlight" for silver/white
  const colorClass = is14
    ? (phoneColor === "starlight" || phoneColor === "white" ? "device-starlight" : "")
    : (phoneColor === "black" ? "black" : "");

  const mediaContent = isVideo ? (
    <video
      src={mediaUrl}
      autoPlay muted loop playsInline
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
  ) : (
    <Image
      src={mediaUrl}
      alt=""
      fill
      className="object-cover"
    />
  );

  return (
    <div className="px-6 md:px-12 lg:px-24 py-32">
      <style dangerouslySetInnerHTML={{ __html: DEVICE_CSS }} />

      {/* aspect-[12/5] = 1920:800 — bg shows fully without crop, scales with container width */}
      <div className="max-w-6xl mx-auto relative aspect-[12/5]">

        {/* Background */}
        {bgUrl ? (
          <Image src={bgUrl} alt="" aria-hidden="true" fill className="object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}

        {/* Phone — centered, bleeds above and below the bg box */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>
          {is14 ? (
            <div className="ph-wrap iphone14-model">
              <div className="ph-scaler iphone14-model">
                <div className={`device device-iphone-14${colorClass ? ` ${colorClass}` : ""}`}>
                  <div className="device-frame">
                    <div className="device-screen">
                      {mediaContent}
                    </div>
                  </div>
                  <div className="device-stripe" />
                  <div className="device-header" />
                  <div className="device-sensors" />
                  <div className="device-btns" />
                  <div className="device-power" />
                  <div className="device-home" />
                </div>
              </div>
            </div>
          ) : (
            <div className="ph-wrap">
              <div className="ph-scaler">
                <div className={`marvel-device iphone8${colorClass ? ` ${colorClass}` : ""}`}>
                  <div className="top-bar" />
                  <div className="sleep" />
                  <div className="volume" />
                  <div className="camera" />
                  <div className="sensor" />
                  <div className="speaker" />
                  <div className="screen">{mediaContent}</div>
                  <div className="home" />
                  <div className="bottom-bar" />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
