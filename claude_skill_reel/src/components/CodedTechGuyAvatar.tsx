import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CodedTechGuyAvatarProps {
  scale?: number;
  isSpeaking?: boolean;
  bottomOffset?: number; // Positioned elevated "somewhat upside"
  xOffset?: number;
  pointingIntensity?: number;
  pose?: 'point_and_present' | 'both_hands_present' | 'direct_cta' | 'thinking';
}

export const CodedTechGuyAvatar: React.FC<CodedTechGuyAvatarProps> = ({
  scale = 0.98,
  isSpeaking = true,
  bottomOffset = 210,
  xOffset = 0,
  pointingIntensity = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Natural breathing & continuous body micro-motion
  const breathY = Math.sin((frame / fps) * 2.2) * 4.5;
  const breathScale = 1.0 + Math.sin((frame / fps) * 2.2) * 0.008;
  const bodySway = Math.sin((frame / fps) * 1.1) * 1.2;

  // 2. Head tilt & nod synced to conversational cadence
  const headBaseTilt = -2.5;
  const headNod = isSpeaking ? Math.sin(frame * 0.44) * 2.8 : Math.sin(frame * 0.15) * 0.8;
  const headTilt = headBaseTilt + (isSpeaking ? Math.cos(frame * 0.28) * 1.6 : Math.cos(frame * 0.12) * 0.5);

  // 3. Eye blinking: every ~85 frames, lasts 5 frames
  const blinkCycle = frame % 85;
  const isBlinking = blinkCycle >= 79 && blinkCycle <= 83;

  // 4. Hoodie drawstrings sway with physics
  const stringSway = Math.sin((frame / fps) * 2.5) * 4.5;

  // 5. Speech-driven mouth visemes (talking vs charming smile)
  const mouthCadence = isSpeaking ? Math.abs(Math.sin(frame * 0.72)) : 0;
  const mouthOpenY = interpolate(mouthCadence, [0, 0.25, 0.7, 1], [0, 2, 10, 6]);
  const mouthWidth = interpolate(mouthCadence, [0, 0.5, 1], [38, 44, 48]);

  // 6. Right Arm (Viewer's Left) Pointing Up
  const rightPointBounce = isSpeaking
    ? Math.abs(Math.sin(frame * 0.36)) * 14 * pointingIntensity
    : Math.sin((frame / fps) * 1.5) * 3.5;
  const rightArmSpring = spring({
    frame: frame % 80,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // 7. Left Arm (Viewer's Right) Presenting Outward
  const leftPresentFloatY = Math.sin((frame / fps) * 1.8) * 7;
  const leftPresentRot = Math.sin((frame / fps) * 1.2) * 2.8;

  // Eyebrow lift on speech cadence
  const browY = isSpeaking ? -Math.sin(frame * 0.36) * 2.5 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: `calc(50% + ${xOffset}px)`,
        transform: `translateX(-50%) translateY(${breathY}px) scale(${scale * breathScale}) rotate(${bodySway}deg)`,
        transformOrigin: 'bottom center',
        width: 900,
        height: 870,
        zIndex: 35,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <svg
        width="900"
        height="870"
        viewBox="0 0 900 870"
        style={{
          filter:
            'drop-shadow(0 25px 50px rgba(13, 15, 18, 0.22)) drop-shadow(0 6px 16px rgba(0,0,0,0.12))',
          overflow: 'visible',
        }}
      >
        <defs>
          {/* Handsome Warm Pixar Healthy Skin Gradients */}
          <linearGradient id="skinBase" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#fee8d8" />
            <stop offset="35%" stopColor="#f7cca8" />
            <stop offset="75%" stopColor="#e8af87" />
            <stop offset="100%" stopColor="#d39268" />
          </linearGradient>

          <linearGradient id="skinContour" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c58356" />
            <stop offset="100%" stopColor="#9e5f35" />
          </linearGradient>

          <linearGradient id="skinCheekGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f48b78" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f48b78" stopOpacity="0" />
          </linearGradient>

          {/* Voluminous Messy Wavy Hair Gradients (Short tapered sides, spiky waves on top!) */}
          <linearGradient id="hairDark" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#36241c" />
            <stop offset="35%" stopColor="#221611" />
            <stop offset="75%" stopColor="#130c08" />
            <stop offset="100%" stopColor="#080503" />
          </linearGradient>

          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#644333" />
            <stop offset="45%" stopColor="#482f23" />
            <stop offset="100%" stopColor="#261710" />
          </linearGradient>

          <linearGradient id="hairFadeSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1511" />
            <stop offset="100%" stopColor="#100b08" />
          </linearGradient>

          {/* Deep Amber-Hazel Irises */}
          <radialGradient id="irisGrad" cx="44%" cy="44%" r="56%">
            <stop offset="0%" stopColor="#94582a" />
            <stop offset="40%" stopColor="#683917" />
            <stop offset="75%" stopColor="#3e1e08" />
            <stop offset="100%" stopColor="#180b03" />
          </radialGradient>

          {/* Designer Thick Black Rounded-Square Glasses */}
          <linearGradient id="glassesFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#32343c" />
            <stop offset="35%" stopColor="#1b1c20" />
            <stop offset="100%" stopColor="#0a0b0d" />
          </linearGradient>

          <linearGradient id="lensReflect" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="65%" stopColor="rgba(255,255,255,0.0)" />
          </linearGradient>

          {/* Streetwear Black Zip-Up Hoodie Fabric */}
          <linearGradient id="hoodieBody" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#2e323a" />
            <stop offset="25%" stopColor="#21252c" />
            <stop offset="75%" stopColor="#16181d" />
            <stop offset="100%" stopColor="#0d0e12" />
          </linearGradient>

          <linearGradient id="hoodieSleeve" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#363a44" />
            <stop offset="45%" stopColor="#24282f" />
            <stop offset="100%" stopColor="#14161a" />
          </linearGradient>

          {/* White Crewneck T-Shirt Inside */}
          <linearGradient id="whiteTee" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f5f7fa" />
            <stop offset="85%" stopColor="#e3e7ee" />
            <stop offset="100%" stopColor="#d3d9e2" />
          </linearGradient>

          {/* Coral Energy Ring Glow at Fingertip */}
          <radialGradient id="coralGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F95738" stopOpacity="1" />
            <stop offset="55%" stopColor="#FF7A59" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F95738" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ================= 1. TORSO, HOODIE & T-SHIRT ================= */}
        <g transform="translate(0, 0)">
          {/* Black Cargo Pants / Lower Waistband */}
          <path
            d="M 305 750 L 530 750 L 555 860 L 285 860 Z"
            fill="#0f1115"
            stroke="#07080a"
            strokeWidth="3"
          />

          {/* Natural Organic Hoodie Torso */}
          <path
            d="M 235 760 C 240 640 255 520 295 470 C 330 435 375 425 420 425 C 470 425 525 435 565 470 C 605 520 620 640 630 760 Z"
            fill="url(#hoodieBody)"
            stroke="#0b0d10"
            strokeWidth="3.5"
          />

          {/* White Crewneck T-Shirt Exposed in the Open Front */}
          <path
            d="M 370 428 C 390 438 410 442 425 442 C 442 442 465 438 482 428 L 498 755 L 358 755 Z"
            fill="url(#whiteTee)"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          {/* Ribbed crewneck collar */}
          <path
            d="M 370 428 C 392 444 458 444 482 428"
            stroke="#94a3b8"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Natural soft cloth ripples across white tee */}
          <path d="M 375 510 Q 425 532 475 508" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.65" />
          <path d="M 380 580 Q 425 604 470 576" stroke="#cbd5e1" strokeWidth="2.5" fill="none" opacity="0.65" />
          <path d="M 374 650 Q 425 672 476 646" stroke="#cbd5e1" strokeWidth="2.2" fill="none" opacity="0.6" />

          {/* Draped Hood Collar behind the neck */}
          <path
            d="M 285 475 C 265 420 325 365 420 365 C 515 365 575 420 555 475 C 515 525 330 525 285 475 Z"
            fill="#1a1d23"
            stroke="#090a0d"
            strokeWidth="3.5"
          />

          {/* Open Hoodie Lapels & Silver Metallic Zipper Tracks */}
          <path
            d="M 360 430 L 372 755 L 346 755 L 325 475 Z"
            fill="#16181d"
            stroke="#090a0d"
            strokeWidth="2"
          />
          <line x1="372" y1="430" x2="372" y2="755" stroke="#94a3b8" strokeWidth="3" strokeDasharray="3 3" />

          <path
            d="M 490 430 L 478 755 L 504 755 L 525 475 Z"
            fill="#16181d"
            stroke="#090a0d"
            strokeWidth="2"
          />
          <line x1="478" y1="430" x2="478" y2="755" stroke="#94a3b8" strokeWidth="3" strokeDasharray="3 3" />

          {/* Kangaroo Pocket Contour on Hoodie */}
          <path
            d="M 305 655 L 345 640 L 505 640 L 545 655 L 530 750 L 320 750 Z"
            fill="#181a1f"
            stroke="#0b0d10"
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* Drawstrings with Metallic Silver Aglets */}
          <path
            d={`M 356 465 Q ${352 + stringSway} 540 ${350 + stringSway * 1.3} 615`}
            stroke="#e2e8f0"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <rect
            x={346 + stringSway * 1.3}
            y="615"
            width="8"
            height="18"
            rx="3"
            fill="#94a3b8"
            stroke="#334155"
            strokeWidth="1.5"
          />

          <path
            d={`M 494 465 Q ${496 + stringSway} 540 ${498 + stringSway * 1.3} 615`}
            stroke="#e2e8f0"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <rect
            x={494 + stringSway * 1.3}
            y="615"
            width="8"
            height="18"
            rx="3"
            fill="#94a3b8"
            stroke="#334155"
            strokeWidth="1.5"
          />
        </g>

        {/* ================= 2. HEAD, HANDSOME BOY FACE, GLASSES & SPIKY HAIR ================= */}
        <g
          style={{
            transform: `translateY(${headNod + 32}px) rotate(${headTilt}deg)`,
            transformOrigin: '425px 360px',
          }}
        >
          {/* Neck with Warm Ambient Shadow */}
          <path
            d="M 382 325 L 468 325 L 480 435 C 445 448 400 448 370 435 Z"
            fill="url(#skinContour)"
          />
          <path
            d="M 386 330 L 464 330 L 472 425 C 442 438 404 438 376 425 Z"
            fill="url(#skinBase)"
          />

          {/* Structured Handsome Boy Face Contour (Defined jaw, clean-shaven boyish chin) */}
          <path
            d="M 334 220 C 334 145 516 145 516 220 C 516 288 478 346 425 350 C 372 346 334 288 334 220 Z"
            fill="url(#skinBase)"
            stroke="#211812"
            strokeWidth="3.0"
          />

          {/* Soft Boyish Cheek Warmth */}
          <ellipse cx="366" cy="272" rx="24" ry="13" fill="url(#skinCheekGlow)" filter="blur(7px)" />
          <ellipse cx="484" cy="272" rx="24" ry="13" fill="url(#skinCheekGlow)" filter="blur(7px)" />

          {/* Tapered Hair Sides (Behind and above ears - clean masculine boy haircut!) */}
          <path
            d="M 326 215 C 322 235 324 255 330 265 L 338 260 L 335 218 Z"
            fill="url(#hairFadeSide)"
          />
          <path
            d="M 524 215 C 528 235 526 255 520 265 L 512 260 L 515 218 Z"
            fill="url(#hairFadeSide)"
          />

          {/* Clean Exposed Ears (High on both sides) */}
          {/* Left Ear (Viewer's Left) */}
          <ellipse cx="324" cy="242" rx="15" ry="22" fill="url(#skinBase)" stroke="#211812" strokeWidth="2.6" />
          <path d="M 322 235 Q 330 242 324 252" stroke="#c58356" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Right Ear (Viewer's Right) */}
          <ellipse cx="526" cy="242" rx="15" ry="22" fill="url(#skinBase)" stroke="#211812" strokeWidth="2.6" />
          <path d="M 528 235 Q 520 242 526 252" stroke="#c58356" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Handsome Almond-Shaped Pixar Eyes */}
          {isBlinking ? (
            /* Smooth closed blinking eyelids with curved lashline */
            <g>
              <path d="M 364 226 Q 388 238 412 226" stroke="#211812" strokeWidth="4.2" strokeLinecap="round" fill="none" />
              <path d="M 444 226 Q 468 238 492 226" stroke="#211812" strokeWidth="4.2" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            /* Lively Hazel-Amber Eyes with Double Catchlights */
            <g>
              {/* Sclera */}
              <ellipse cx="388" cy="225" rx="22" ry="17" fill="#ffffff" stroke="#211812" strokeWidth="2.4" />
              <ellipse cx="468" cy="225" rx="22" ry="17" fill="#ffffff" stroke="#211812" strokeWidth="2.4" />

              {/* Upper Sclera Soft Shadow */}
              <path d="M 368 217 Q 388 221 408 217 A 22 17 0 0 1 368 217" fill="rgba(197, 131, 86, 0.28)" />
              <path d="M 448 217 Q 468 221 488 217 A 22 17 0 0 1 448 217" fill="rgba(197, 131, 86, 0.28)" />

              {/* Amber-Hazel Irises */}
              <circle cx="390" cy="225" r="12" fill="url(#irisGrad)" />
              <circle cx="466" cy="225" r="12" fill="url(#irisGrad)" />

              {/* Pupils */}
              <circle cx="390" cy="225" r="6.5" fill="#0c0704" />
              <circle cx="466" cy="225" r="6.5" fill="#0c0704" />

              {/* Specular Catchlights */}
              <circle cx="394" cy="220" r="3.8" fill="#ffffff" />
              <circle cx="470" cy="220" r="3.8" fill="#ffffff" />
              <circle cx="386" cy="228" r="1.8" fill="#ffffff" opacity="0.85" />
              <circle cx="462" cy="228" r="1.8" fill="#ffffff" opacity="0.85" />
            </g>
          )}

          {/* Designer Thick Black Rounded-Square Glasses */}
          <g>
            {/* Left Lens Frame (Viewer's Left) */}
            <rect
              x="354"
              y="196"
              width="68"
              height="55"
              rx="18"
              fill="none"
              stroke="url(#glassesFrame)"
              strokeWidth="5.2"
            />
            {/* Frame Top Bevel Highlight */}
            <path
              d="M 362 197 Q 388 195 414 197"
              stroke="#525660"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Glass Sheen Reflection */}
            <rect
              x="357"
              y="199"
              width="62"
              height="49"
              rx="16"
              fill="url(#lensReflect)"
            />

            {/* Right Lens Frame (Viewer's Right) */}
            <rect
              x="432"
              y="196"
              width="68"
              height="55"
              rx="18"
              fill="none"
              stroke="url(#glassesFrame)"
              strokeWidth="5.2"
            />
            {/* Frame Top Bevel Highlight */}
            <path
              d="M 440 197 Q 466 195 492 197"
              stroke="#525660"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Glass Sheen Reflection */}
            <rect
              x="435"
              y="199"
              width="62"
              height="49"
              rx="16"
              fill="url(#lensReflect)"
            />

            {/* Nose Bridge Connecting Frames */}
            <path
              d="M 422 215 Q 427 210 432 215"
              stroke="url(#glassesFrame)"
              strokeWidth="4.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Glasses Temples extending to ears */}
            <line x1="354" y1="209" x2="320" y2="224" stroke="url(#glassesFrame)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="500" y1="209" x2="530" y2="224" stroke="url(#glassesFrame)" strokeWidth="4.5" strokeLinecap="round" />

            {/* Metallic Silver Rivet Pins on Frame Corners */}
            <circle cx="358" cy="203" r="1.4" fill="#e2e8f0" />
            <circle cx="496" cy="203" r="1.4" fill="#e2e8f0" />
          </g>

          {/* Confident Masculine Boy Eyebrows above glasses */}
          <g transform={`translate(0, ${browY})`}>
            {/* Left Eyebrow */}
            <path
              d="M 358 184 Q 388 172 418 182"
              stroke="#1b120c"
              strokeWidth="5.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Eyebrow (Confident boyish lift) */}
            <path
              d="M 438 181 Q 468 170 498 183"
              stroke="#1b120c"
              strokeWidth="5.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Cute Stylized Pixar Nose */}
          <path
            d="M 424 222 L 427 258 Q 434 264 424 266 Q 414 264 418 258"
            stroke="#c58356"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="424" cy="264" rx="3.8" ry="2.4" fill="#c58356" opacity="0.45" />

          {/* Dynamic Talking Mouth & Teeth / Charming Boyish Smirk */}
          {isSpeaking && mouthOpenY > 2.5 ? (
            <g>
              {/* Open Talking Cavity */}
              <ellipse
                cx="424"
                cy={310 + mouthOpenY * 0.25}
                rx={mouthWidth / 2}
                ry={mouthOpenY}
                fill="#360f15"
                stroke="#1b120c"
                strokeWidth="2.4"
              />
              {/* Upper White Teeth Row */}
              <path
                d={`M ${424 - mouthWidth * 0.38} 308 Q 424 313 ${424 + mouthWidth * 0.38} 308 Z`}
                fill="#ffffff"
              />
              {/* Rosy Tongue Accent */}
              {mouthOpenY > 6 && (
                <ellipse
                  cx="424"
                  cy={310 + mouthOpenY * 0.72}
                  rx={mouthWidth * 0.28}
                  ry={mouthOpenY * 0.42}
                  fill="#de5b6d"
                />
              )}
              {/* Plump Lower Lip Line */}
              <path
                d={`M ${424 - mouthWidth * 0.44} ${310 + mouthOpenY * 0.9} Q 424 ${314 + mouthOpenY * 1.1} ${424 + mouthWidth * 0.44} ${310 + mouthOpenY * 0.9}`}
                stroke="#c76158"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            /* Charming Confident Boyish Smirk (Exact Smile from Reference Character) */
            <g>
              <path
                d="M 406 310 Q 425 320 450 308"
                stroke="#c76158"
                strokeWidth="3.8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Smirk Dimple Crease */}
              <path
                d="M 450 307 Q 454 303 453 299"
                stroke="#b04e46"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Lower Lip Subtle Shading */}
              <path
                d="M 416 318 Q 428 322 440 318"
                stroke="#c58356"
                strokeWidth="2.0"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
            </g>
          )}

          {/* ================= VOLUMINOUS MESSY/WAVY SPIKED HAIR ON TOP ================= */}
          {/* Natural textured curls on crown, completely short on the sides! */}
          <g>
            {/* Main Volumetric Hair Crown Silhouette */}
            <path
              d="M 334 195 C 314 115 350 40 430 35 C 512 36 550 88 540 155 C 536 185 522 208 514 218 C 508 170 478 145 428 145 C 380 145 348 165 334 195 Z"
              fill="url(#hairDark)"
              stroke="#0a0705"
              strokeWidth="3.2"
            />

            {/* Dynamic Spiky Wavy Hair Clusters Curling Upwards & to the Right */}
            <path
              d="M 425 35 C 465 18 508 32 542 78 C 518 64 478 54 435 58 Z"
              fill="url(#hairHighlight)"
            />
            <path
              d="M 500 75 C 540 94 558 138 548 185 C 535 148 510 124 478 114 Z"
              fill="url(#hairHighlight)"
            />
            <path
              d="M 348 145 C 328 94 372 46 418 40 C 386 56 358 92 355 138 Z"
              fill="url(#hairDark)"
            />

            {/* Dynamic Swirling Forehead Bangs */}
            <path
              d="M 348 152 C 388 122 455 132 480 172 C 445 152 402 152 372 182 Z"
              fill="url(#hairHighlight)"
            />
            <path
              d="M 406 134 C 446 100 510 114 530 160 C 500 140 462 140 436 160 Z"
              fill="url(#hairHighlight)"
            />
            {/* Front fringe locks dangling above the glasses */}
            <path
              d="M 356 160 C 376 184 405 186 422 176 C 408 166 390 162 372 162 Z"
              fill="url(#hairDark)"
            />
            <path
              d="M 426 152 C 448 180 478 180 498 166 C 478 160 462 156 442 156 Z"
              fill="url(#hairDark)"
            />
            {/* Whimsical Stray Curl at top crown */}
            <path
              d="M 420 26 C 410 2 435 -8 442 8 C 434 5 426 14 424 25 Z"
              fill="url(#hairHighlight)"
            />
          </g>
        </g>

        {/* ================= 3. REAL ARTICULATED ARMS & HANDS ================= */}

        {/* RIGHT ARM & HAND (Viewer's Left): Pointing Index Finger Straight Up at Cards */}
        <g
          style={{
            transform: `scale(${0.96 + rightArmSpring * 0.04}) rotate(${-1.5 + rightArmSpring * 2.0}deg)`,
            transformOrigin: '280px 480px',
          }}
        >
          {/* Curved Realistic Sleeve connecting naturally to shoulder */}
          <path
            d="M 305 460 C 275 480 248 540 252 605 L 296 620 C 306 565 322 505 348 472 Z"
            fill="url(#hoodieSleeve)"
            stroke="#0b0d10"
            strokeWidth="3.2"
          />

          {/* Forearm curving upward from elbow to wrist */}
          <path
            d="M 252 605 C 242 545 238 455 248 385 L 288 390 C 285 455 288 545 296 620 Z"
            fill="url(#hoodieSleeve)"
            stroke="#0b0d10"
            strokeWidth="3.2"
          />
          {/* Ribbed Wrist Cuff */}
          <rect
            x="246"
            y="375"
            width="44"
            height="16"
            rx="4"
            fill="#1c1f25"
            stroke="#0b0d10"
            strokeWidth="2.5"
          />
          <line x1="246" y1="383" x2="290" y2="383" stroke="#333942" strokeWidth="2" />

          {/* Pointing Right Hand with Dynamic Conversational Bounce */}
          <g
            transform={`translate(242, ${280 - rightPointBounce})`}
            style={{
              transition: 'transform 0.08s ease-out',
            }}
          >
            {/* Natural Palm Base & Knuckles */}
            <ellipse cx="26" cy="65" rx="20" ry="17" fill="url(#skinBase)" stroke="#211812" strokeWidth="2.8" />
            <path d="M 32 60 C 44 64 42 78 30 80" stroke="#211812" strokeWidth="2.4" fill="none" />
            <path d="M 22 62 C 34 66 32 80 20 82" stroke="#211812" strokeWidth="2.4" fill="none" />
            <path d="M 12 60 C 16 72 30 72 32 60" stroke="#211812" strokeWidth="2.4" fill="none" />

            {/* Extended Pointing Index Finger with Joint Knuckles & Highlight */}
            <path
              d="M 16 55 C 18 30 22 -15 25 -65 C 26 -76 38 -76 38 -65 C 38 -15 36 30 34 55 Z"
              fill="url(#skinBase)"
              stroke="#211812"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            {/* Fingernail Highlight */}
            <ellipse cx="32" cy="-66" rx="3.5" ry="5.5" fill="#ffffff" opacity="0.7" />
            {/* Knuckle Creases */}
            <path d="M 20 4 Q 28 8 32 2" stroke="#c58356" strokeWidth="2" fill="none" />
            <path d="M 22 -28 Q 30 -24 34 -30" stroke="#c58356" strokeWidth="2" fill="none" />

            {/* Animated Pulsing Coral Energy Ring at Fingertip */}
            <circle
              cx="32"
              cy="-78"
              r={interpolate(frame % 24, [0, 12, 24], [5, 13, 5])}
              fill="url(#coralGlow)"
              filter="drop-shadow(0 0 14px #F95738)"
            />
          </g>
        </g>

        {/* LEFT ARM & HAND (Viewer's Right): Open Palm Presenting Gracefully Outward */}
        <g
          transform={`translate(0, ${leftPresentFloatY}) rotate(${leftPresentRot} 560 480)`}
          style={{
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Upper Arm */}
          <path
            d="M 545 470 C 580 490 610 540 615 600 L 580 615 C 570 560 550 510 520 480 Z"
            fill="url(#hoodieSleeve)"
            stroke="#0b0d10"
            strokeWidth="3.2"
          />

          {/* Forearm extending outward with natural sleeve thickness */}
          <path
            d="M 615 600 C 655 595 705 580 750 565 L 745 524 C 700 538 650 555 580 615 Z"
            fill="url(#hoodieSleeve)"
            stroke="#0b0d10"
            strokeWidth="3.2"
          />
          {/* Ribbed Wrist Cuff */}
          <rect
            x="740"
            y="522"
            width="20"
            height="46"
            rx="4"
            fill="#1c1f25"
            stroke="#0b0d10"
            strokeWidth="2.5"
            transform="rotate(-12 740 522)"
          />

          {/* Open Presenting Palm (Facing Upward) */}
          <g transform="translate(755, 516)">
            <ellipse
              cx="25"
              cy="20"
              rx="24"
              ry="16"
              fill="url(#skinBase)"
              stroke="#211812"
              strokeWidth="2.6"
              transform="rotate(8)"
            />

            <path d="M 8 10 C 14 -5 26 -2 22 14" fill="url(#skinBase)" stroke="#211812" strokeWidth="2.2" />

            <path d="M 32 10 L 62 4 Q 68 12 40 18" fill="url(#skinBase)" stroke="#211812" strokeWidth="2.2" />
            <path d="M 35 18 L 72 15 Q 76 24 42 26" fill="url(#skinBase)" stroke="#211812" strokeWidth="2.2" />
            <path d="M 33 26 L 68 28 Q 72 36 38 34" fill="url(#skinBase)" stroke="#211812" strokeWidth="2.2" />
            <path d="M 28 34 L 56 40 Q 60 48 32 40" fill="url(#skinBase)" stroke="#211812" strokeWidth="2.2" />

            {/* Presentation Magic Sparkle */}
            <circle
              cx="78"
              cy="12"
              r={3.2 + Math.sin(frame * 0.3) * 1.5}
              fill="#F95738"
              opacity="0.85"
              filter="drop-shadow(0 0 8px #F95738)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default CodedTechGuyAvatar;
