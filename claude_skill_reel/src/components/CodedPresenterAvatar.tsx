import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CodedPresenterAvatarProps {
  pose?: 'point_up_right' | 'both_hands_present' | 'direct_point' | 'conversational_rest';
  scale?: number;
  isSpeaking?: boolean;
  bottomOffset?: number;
}

export const CodedPresenterAvatar: React.FC<CodedPresenterAvatarProps> = ({
  pose = 'point_up_right',
  scale = 1.0,
  isSpeaking = true,
  bottomOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural continuous body dynamics
  const breathY = Math.sin((frame / fps) * 2.5) * 5;
  const breathScale = 1.0 + Math.sin((frame / fps) * 2.5) * 0.012;
  const swayRot = Math.sin((frame / fps) * 1.2) * 1.4;

  // Head nod & micro-tilt on speech rhythm
  const headNod = isSpeaking ? Math.sin(frame * 0.45) * 3 : 0;
  const headTilt = isSpeaking ? Math.cos(frame * 0.3) * 1.8 : 0;

  // Natural eye blink: every ~80 frames, lasts 4 frames
  const blinkCycle = frame % 90;
  const isBlinking = blinkCycle > 82 && blinkCycle < 87;

  // Mouth talking animation synced to speech phoneme cadence
  // Oscillates between closed, small vowel, wide vowel, and smile
  const mouthCycle = isSpeaking ? Math.abs(Math.sin(frame * 0.75)) : 0;
  const mouthOpenY = interpolate(mouthCycle, [0, 0.4, 0.8, 1], [2, 10, 22, 16]);
  const mouthWidth = interpolate(mouthCycle, [0, 0.5, 1], [36, 42, 38]);

  // Dynamic gesture entrance spring
  const gestureEntrance = spring({
    frame: frame % 120,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: '50%',
        transform: `translateX(-50%) translateY(${breathY}px) scale(${scale})`,
        transformOrigin: 'bottom center',
        width: 860,
        height: 780,
        zIndex: 42,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <svg
        width="820"
        height="760"
        viewBox="0 0 820 760"
        style={{
          filter:
            'drop-shadow(0 25px 50px rgba(13, 15, 18, 0.22)) drop-shadow(0 4px 12px rgba(0,0,0,0.12))',
          overflow: 'visible',
        }}
      >
        <defs>
          {/* Skin Gradients */}
          <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d49e75" />
            <stop offset="60%" stopColor="#c58c61" />
            <stop offset="100%" stopColor="#b47b52" />
          </linearGradient>
          <linearGradient id="skinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ad764e" />
            <stop offset="100%" stopColor="#96633e" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c2523" />
            <stop offset="40%" stopColor="#1c1917" />
            <stop offset="100%" stopColor="#0f0d0c" />
          </linearGradient>

          {/* Signature Navy Checkered Shirt Pattern */}
          <pattern id="checkeredNavy" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="#1e293b" />
            <rect x="0" y="0" width="16" height="16" fill="#334155" />
            <rect x="16" y="16" width="16" height="16" fill="#334155" />
            {/* White grid pinstripes */}
            <line x1="0" y1="0" x2="32" y2="0" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
            <line x1="0" y1="16" x2="32" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="32" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
            <line x1="16" y1="0" x2="16" y2="32" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* ================= TORSO & CLOTHING ================= */}
        <g
          style={{
            transform: `scale(${breathScale}) rotate(${swayRot * 0.4}deg)`,
            transformOrigin: '410px 720px',
          }}
        >
          {/* Shoulders & Upper Body */}
          <path
            d="M 230 760 L 250 510 C 270 470 320 450 370 445 L 450 445 C 500 450 550 470 570 510 L 590 760 Z"
            fill="url(#checkeredNavy)"
            stroke="#0f172a"
            strokeWidth="4"
          />

          {/* Inner Crewneck Collar (White / Light Heather) */}
          <path d="M 365 445 C 385 470 435 470 455 445 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

          {/* Button-Down Shirt Collar Points */}
          {/* Left Collar */}
          <path
            d="M 360 440 L 400 500 L 410 470 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="3"
          />
          {/* Right Collar */}
          <path
            d="M 460 440 L 420 500 L 410 470 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="3"
          />

          {/* Shirt Center Placket & Buttons */}
          <line x1="410" y1="470" x2="410" y2="760" stroke="#0f172a" strokeWidth="3" />
          <circle cx="410" cy="530" r="4.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="410" cy="590" r="4.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="410" cy="650" r="4.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
        </g>

        {/* ================= HEAD & FACE ================= */}
        <g
          style={{
            transform: `translateY(${headNod}px) rotate(${headTilt}deg)`,
            transformOrigin: '410px 420px',
          }}
        >
          {/* Neck with Shadow */}
          <rect x="375" y="370" width="70" height="85" fill="url(#skinShadow)" rx="10" />
          <rect x="380" y="380" width="60" height="75" fill="url(#skinTone)" rx="8" />

          {/* Head Base Contour */}
          <path
            d="M 330 240 C 330 150 490 150 490 240 C 490 320 465 375 410 385 C 355 375 330 320 330 240 Z"
            fill="url(#skinTone)"
            stroke="#1c1917"
            strokeWidth="4"
          />

          {/* Ears */}
          <ellipse cx="328" cy="255" rx="12" ry="20" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="3" />
          <ellipse cx="492" cy="255" rx="12" ry="20" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="3" />
          <path d="M 326 250 Q 332 255 328 262" stroke="#96633e" strokeWidth="2.5" fill="none" />
          <path d="M 494 250 Q 488 255 492 262" stroke="#96633e" strokeWidth="2.5" fill="none" />

          {/* Well-Groomed Trimmed Beard & Mustache along Jawline */}
          <path
            d="M 340 270 C 345 340 370 380 410 383 C 450 380 475 340 480 270 C 475 285 455 355 410 358 C 365 355 345 285 340 270 Z"
            fill="#1c1917"
          />
          {/* Mustache above lip */}
          <path
            d="M 382 320 Q 410 312 438 320 Q 410 330 382 320 Z"
            fill="#1c1917"
          />
          {/* Soul patch under lip */}
          <ellipse cx="410" cy="342" rx="4.5" ry="6" fill="#1c1917" />

          {/* Styled Volumetric Hair (Short Dark Styled Hair with Volume on Top) */}
          <path
            d="M 320 220 C 315 150 340 100 410 95 C 470 95 500 130 500 180 C 505 210 495 240 490 250 C 480 200 460 170 410 170 C 370 170 340 185 330 230 Z"
            fill="url(#hairGrad)"
            stroke="#1c1917"
            strokeWidth="3.5"
          />
          {/* Sideburns */}
          <rect x="330" y="210" width="10" height="45" rx="3" fill="#1c1917" />
          <rect x="480" y="210" width="10" height="45" rx="3" fill="#1c1917" />

          {/* Eyebrows */}
          <path
            d="M 360 215 Q 380 208 395 215"
            stroke="#1c1917"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 425 215 Q 440 208 460 215"
            stroke="#1c1917"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Expressive Eyes with Natural Blinking */}
          {isBlinking ? (
            /* Closed eye line when blinking */
            <>
              <path d="M 362 235 Q 378 240 392 235" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 428 235 Q 442 240 458 235" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            /* Open eyes with pupils and white catchlight */
            <>
              <ellipse cx="377" cy="235" rx="14" ry="10" fill="#ffffff" stroke="#1c1917" strokeWidth="2.5" />
              <ellipse cx="443" cy="235" rx="14" ry="10" fill="#ffffff" stroke="#1c1917" strokeWidth="2.5" />
              {/* Dark brown irises */}
              <circle cx="378" cy="235" r="7" fill="#2d1e18" />
              <circle cx="444" cy="235" r="7" fill="#2d1e18" />
              <circle cx="378" cy="235" r="4" fill="#000000" />
              <circle cx="444" cy="235" r="4" fill="#000000" />
              {/* Catchlight */}
              <circle cx="380" cy="232" r="2" fill="#ffffff" />
              <circle cx="446" cy="232" r="2" fill="#ffffff" />
            </>
          )}

          {/* Nose */}
          <path
            d="M 410 225 L 413 280 Q 420 286 410 288 Q 402 286 405 280"
            stroke="#96633e"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Dynamic Talking Mouth Sync */}
          {isSpeaking && mouthOpenY > 6 ? (
            <g>
              {/* Open Mouth Cavity */}
              <ellipse
                cx="410"
                cy={332 + mouthOpenY * 0.3}
                rx={mouthWidth / 2}
                ry={mouthOpenY}
                fill="#4a0e17"
                stroke="#1c1917"
                strokeWidth="3"
              />
              {/* Upper teeth */}
              <path
                d={`M ${410 - mouthWidth * 0.35} 330 Q 410 334 ${410 + mouthWidth * 0.35} 330 Z`}
                fill="#ffffff"
              />
              {/* Tongue accent */}
              {mouthOpenY > 12 && (
                <ellipse cx="410" cy={332 + mouthOpenY * 0.7} rx={mouthWidth * 0.28} ry={mouthOpenY * 0.4} fill="#e11d48" />
              )}
            </g>
          ) : (
            /* Gentle Closed Confident Smile */
            <path
              d="M 394 332 Q 410 338 426 332"
              stroke="#1c1917"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {/* ================= GESTURES & ARMS ================= */}

        {/* GESTURE 1: Point Up-Right toward Cards */}
        {pose === 'point_up_right' && (
          <g
            style={{
              transform: `scale(${0.92 + gestureEntrance * 0.08}) rotate(${-6 + gestureEntrance * 4}deg)`,
              transformOrigin: '560px 520px',
            }}
          >
            {/* Right Arm Forearm & Checkered Sleeve */}
            <path
              d="M 540 500 L 650 360 L 685 390 L 580 540 Z"
              fill="url(#checkeredNavy)"
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* White/cuff band */}
            <rect x="645" y="360" width="45" height="14" rx="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" transform="rotate(38 645 360)" />

            {/* Hand with pointing index finger extending up-right */}
            <g transform="translate(640, 310)">
              {/* Palm & other fingers curled */}
              <ellipse cx="35" cy="45" rx="22" ry="18" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="3.5" />
              <path d="M 22 40 C 26 55 42 55 46 40" stroke="#1c1917" strokeWidth="2.5" fill="none" />
              {/* Extended Index Finger */}
              <path
                d="M 25 35 C 30 15 45 -20 50 -55 C 52 -65 62 -65 62 -55 C 60 -20 50 15 45 35 Z"
                fill="url(#skinTone)"
                stroke="#1c1917"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <ellipse cx="56" cy="-55" rx="4" ry="6" fill="#fdf2f8" opacity="0.6" />
              {/* Sparkle energy at finger tip */}
              <circle cx="58" cy="-68" r={interpolate(frame % 20, [0, 10, 20], [4, 9, 4])} fill="#F95738" />
            </g>
          </g>
        )}

        {/* GESTURE 2: Both Hands Open Presenting */}
        {pose === 'both_hands_present' && (
          <g
            style={{
              transform: `scale(${0.94 + gestureEntrance * 0.06})`,
              transformOrigin: '410px 520px',
            }}
          >
            {/* Left Arm & Palm Open */}
            <path d="M 270 510 L 190 420 L 160 445 L 240 545 Z" fill="url(#checkeredNavy)" stroke="#0f172a" strokeWidth="3.5" />
            <ellipse cx="160" cy="410" rx="26" ry="18" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="3" transform="rotate(-30 160 410)" />

            {/* Right Arm & Palm Open */}
            <path d="M 550 510 L 630 420 L 660 445 L 580 545 Z" fill="url(#checkeredNavy)" stroke="#0f172a" strokeWidth="3.5" />
            <ellipse cx="660" cy="410" rx="26" ry="18" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="3" transform="rotate(30 660 410)" />
          </g>
        )}

        {/* GESTURE 3: Direct Point Forward at Viewer (CTA) */}
        {pose === 'direct_point' && (
          <g
            style={{
              transform: `scale(${0.96 + gestureEntrance * 0.12})`,
              transformOrigin: '410px 480px',
            }}
          >
            {/* Forearm foreshortened coming forward */}
            <path d="M 370 520 L 410 440 L 450 440 L 450 520 Z" fill="url(#checkeredNavy)" stroke="#0f172a" strokeWidth="3.5" />
            <rect x="390" y="435" width="40" height="12" rx="3" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />

            {/* Foreshortened Hand pointing directly into camera */}
            <g transform="translate(410, 400)">
              {/* Fist Base */}
              <ellipse cx="0" cy="0" rx="42" ry="34" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="4" />
              {/* Knuckles */}
              <path d="M -25 -5 Q 0 8 25 -5" stroke="#1c1917" strokeWidth="3" fill="none" />
              {/* Index Finger Tip Pointing Straight Out */}
              <circle cx="2" cy="-22" r="18" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="3.5" />
              <ellipse cx="2" cy="-25" rx="10" ry="8" fill="#f8fafc" opacity="0.65" />
              {/* Energy Ring Pulsing */}
              <circle cx="2" cy="-22" r={24 + Math.sin(frame * 0.2) * 4} fill="none" stroke="#F95738" strokeWidth="2.5" opacity="0.75" />
            </g>
          </g>
        )}

        {/* GESTURE 4: Conversational Natural Rest */}
        {pose === 'conversational_rest' && (
          <g
            style={{
              transform: `translateY(${Math.sin(frame * 0.3) * 4}px)`,
              transformOrigin: '410px 520px',
            }}
          >
            {/* Natural relaxed arms at waist level */}
            <path d="M 280 520 L 320 600 L 345 590 L 310 515 Z" fill="url(#checkeredNavy)" stroke="#0f172a" strokeWidth="3" />
            <ellipse cx="340" cy="610" rx="18" ry="14" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="2.5" />

            <path d="M 540 520 L 500 600 L 475 590 L 510 515 Z" fill="url(#checkeredNavy)" stroke="#0f172a" strokeWidth="3" />
            <ellipse cx="480" cy="610" rx="18" ry="14" fill="url(#skinTone)" stroke="#1c1917" strokeWidth="2.5" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CodedPresenterAvatar;
