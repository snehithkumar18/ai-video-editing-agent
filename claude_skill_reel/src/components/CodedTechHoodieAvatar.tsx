import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CodedTechHoodieAvatarProps {
  pose?:
    | 'point_up_right'
    | 'both_hands_present'
    | 'direct_point'
    | 'typing_keyboard'
    | 'thumbs_up'
    | 'conversational_rest';
  scale?: number;
  isSpeaking?: boolean;
  bottomOffset?: number; // Positioned "somewhat upside"
  yOffset?: number;
  accentColor?: string;
  showHoloKeyboard?: boolean;
}

export const CodedTechHoodieAvatar: React.FC<CodedTechHoodieAvatarProps> = ({
  pose = 'point_up_right',
  scale = 1.0,
  isSpeaking = true,
  bottomOffset = 260, // Elevated "somewhat upside" position
  yOffset = 0,
  accentColor = '#F95738',
  showHoloKeyboard = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural continuous body dynamics & breathing
  const breathY = Math.sin((frame / fps) * 2.6) * 5;
  const breathScale = 1.0 + Math.sin((frame / fps) * 2.6) * 0.012;
  const swayRot = Math.sin((frame / fps) * 1.3) * 1.5;

  // Head nod & micro-tilt on speech cadence
  const headNod = isSpeaking ? Math.sin(frame * 0.45) * 3 : Math.sin(frame * 0.15) * 1;
  const headTilt = isSpeaking ? Math.cos(frame * 0.3) * 1.8 : Math.cos(frame * 0.12) * 0.7;

  // Natural eye blink: every ~90 frames, lasts 4 frames
  const blinkCycle = frame % 90;
  const isBlinking = blinkCycle > 82 && blinkCycle < 87;

  // Drawstring physics (sway with body)
  const stringSway = Math.sin((frame / fps) * 2.8) * 5;

  // Dynamic speech mouth visemes
  // Smoothly shapes vowels and closed mouth on speech cadence
  const mouthCadence = isSpeaking ? Math.abs(Math.sin(frame * 0.75)) : 0;
  const mouthOpenY = interpolate(mouthCadence, [0, 0.35, 0.7, 1], [2, 7, 18, 12]);
  const mouthWidth = interpolate(mouthCadence, [0, 0.5, 1], [32, 38, 42]);

  // Dynamic gesture spring
  const gestureSpring = spring({
    frame: frame % 120,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const finalBottom = bottomOffset + yOffset;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: finalBottom,
        left: '50%',
        transform: `translateX(-50%) translateY(${breathY}px) scale(${scale})`,
        transformOrigin: 'bottom center',
        width: 860,
        height: 760,
        zIndex: 35,
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
            'drop-shadow(0 30px 60px rgba(13, 15, 18, 0.22)) drop-shadow(0 6px 16px rgba(0,0,0,0.12))',
          overflow: 'visible',
        }}
      >
        <defs>
          {/* Healthy, youthful warm skin gradients */}
          <linearGradient id="hoodieSkinTone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5ba94" />
            <stop offset="60%" stopColor="#d39f75" />
            <stop offset="100%" stopColor="#bf875d" />
          </linearGradient>
          <linearGradient id="hoodieSkinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b57e55" />
            <stop offset="100%" stopColor="#9a653e" />
          </linearGradient>

          {/* Hair Gradient (Rich deep dark espresso with subtle warm sheen) */}
          <linearGradient id="techHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d302a" />
            <stop offset="50%" stopColor="#221b18" />
            <stop offset="100%" stopColor="#110d0c" />
          </linearGradient>
          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5a473e" />
            <stop offset="100%" stopColor="#2c221e" />
          </linearGradient>

          {/* Premium Modern Tech Streetwear Hoodie Gradients */}
          <linearGradient id="hoodieFabric" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#272b33" />
            <stop offset="45%" stopColor="#1b1e24" />
            <stop offset="100%" stopColor="#111317" />
          </linearGradient>

          <linearGradient id="hoodieInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#373d49" />
            <stop offset="100%" stopColor="#1a1d23" />
          </linearGradient>

          {/* Aglet Orange Glow */}
          <linearGradient id="agletGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F95738" />
            <stop offset="100%" stopColor="#FFA07A" />
          </linearGradient>
        </defs>

        {/* ================= TORSO & MODERN HOODIE ================= */}
        <g
          style={{
            transform: `scale(${breathScale}) rotate(${swayRot * 0.3}deg)`,
            transformOrigin: '410px 720px',
          }}
        >
          {/* Main Hoodie Silhouette (Athletic relaxed streetwear) */}
          <path
            d="M 215 760 L 238 520 C 258 460 318 438 370 435 L 450 435 C 502 438 562 460 582 520 L 605 760 Z"
            fill="url(#hoodieFabric)"
            stroke="#0b0e12"
            strokeWidth="3.5"
          />

          {/* Draped Hood Fabric Around Neck & Shoulders */}
          <path
            d="M 310 475 C 290 440 330 380 410 380 C 490 380 530 440 510 475 C 485 520 335 520 310 475 Z"
            fill="url(#hoodieInner)"
            stroke="#0b0e12"
            strokeWidth="3"
          />

          {/* Hood Collar Opening Loop (Framing neck and chest) */}
          <path
            d="M 345 435 C 370 480 450 480 475 435 C 465 510 355 510 345 435 Z"
            fill="#12151a"
            stroke="#0b0e12"
            strokeWidth="2.5"
          />

          {/* White Crewneck T-Shirt Trim Peeking Under Collar */}
          <path
            d="M 378 435 C 392 452 428 452 442 435 Z"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Minimalist Tech Founder Chest Emblem */}
          <g transform="translate(325, 520)">
            <rect x="0" y="0" width="16" height="16" rx="4" fill="url(#agletGlow)" transform="rotate(45 8 8)" />
            <circle cx="8" cy="8" r="3" fill="#ffffff" />
          </g>

          {/* Front Kangaroo Pouch Pocket Seam */}
          <path
            d="M 315 675 L 505 675 L 530 760 L 290 760 Z"
            fill="#16191f"
            stroke="#262b35"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Drawstrings with Metallic Aglets (Sways with breath and sway) */}
          {/* Left Drawstring */}
          <path
            d={`M 380 475 Q ${378 + stringSway} 530 ${376 + stringSway * 1.3} 575`}
            stroke="#e2e8f0"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <rect
            x={372 + stringSway * 1.3}
            y="575"
            width="8"
            height="18"
            rx="3"
            fill="url(#agletGlow)"
            stroke="#0b0e12"
            strokeWidth="1.5"
          />

          {/* Right Drawstring */}
          <path
            d={`M 440 475 Q ${442 + stringSway} 530 ${444 + stringSway * 1.3} 575`}
            stroke="#e2e8f0"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <rect
            x={440 + stringSway * 1.3}
            y="575"
            width="8"
            height="18"
            rx="3"
            fill="url(#agletGlow)"
            stroke="#0b0e12"
            strokeWidth="1.5"
          />
        </g>

        {/* ================= HEAD & HANDSOME TECH CREATOR FACE ================= */}
        <g
          style={{
            transform: `translateY(${headNod}px) rotate(${headTilt}deg)`,
            transformOrigin: '410px 410px',
          }}
        >
          {/* Neck with Natural Soft Shadow */}
          <rect x="375" y="360" width="70" height="85" fill="url(#hoodieSkinShadow)" rx="12" />
          <rect x="380" y="370" width="60" height="75" fill="url(#hoodieSkinTone)" rx="10" />

          {/* Well-Proportioned Youthful Masculine Head Contour */}
          <path
            d="M 334 240 C 334 150 486 150 486 240 C 486 318 460 374 410 384 C 360 374 334 318 334 240 Z"
            fill="url(#hoodieSkinTone)"
            stroke="#1c1917"
            strokeWidth="3"
          />

          {/* Ears with Natural Organic Contours */}
          <ellipse cx="330" cy="254" rx="12" ry="18" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.5" />
          <ellipse cx="490" cy="254" rx="12" ry="18" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.5" />
          <path d="M 328 248 Q 334 254 330 262" stroke="#9a653e" strokeWidth="2" fill="none" />
          <path d="M 492 248 Q 486 254 490 262" stroke="#9a653e" strokeWidth="2" fill="none" />

          {/* Subtle Groomed 5-O'Clock Stubble along Jawline (Natural soft opacity) */}
          <path
            d="M 346 280 C 352 340 375 378 410 380 C 445 378 468 340 474 280 C 468 295 448 358 410 360 C 372 358 352 295 346 280 Z"
            fill="rgba(34, 27, 24, 0.28)"
          />
          {/* Neat Trimmed Mustache */}
          <path
            d="M 386 324 Q 410 318 434 324 Q 410 330 386 324 Z"
            fill="#221b18"
            opacity="0.9"
          />
          {/* Soul patch under lip */}
          <ellipse cx="410" cy="342" rx="3.5" ry="5" fill="#221b18" opacity="0.8" />

          {/* Modern Textured Pompadour / Undercut Hair with Layered Highlights */}
          <path
            d="M 322 225 C 316 135 350 82 410 78 C 475 78 504 120 504 175 C 508 205 498 238 494 248 C 484 195 462 165 410 165 C 368 165 338 182 328 232 Z"
            fill="url(#techHairGrad)"
            stroke="#110d0c"
            strokeWidth="3"
          />
          {/* Hair volume texture highlights */}
          <path
            d="M 345 155 C 380 135 430 140 455 168 C 435 155 390 155 362 174 Z"
            fill="url(#hairHighlight)"
          />
          <path
            d="M 405 110 C 440 100 475 120 488 150 C 468 135 435 130 415 140 Z"
            fill="url(#hairHighlight)"
          />
          {/* Clean Tapered Fade on Sides */}
          <polygon points="334,210 342,210 339,242 334,238" fill="#1c1917" />
          <polygon points="486,210 478,210 481,242 486,238" fill="#1c1917" />

          {/* Expressive Arched Eyebrows */}
          <path
            d="M 360 214 Q 380 206 396 214"
            stroke="#1c1917"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 424 214 Q 440 206 460 214"
            stroke="#1c1917"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Expressive Almond Eyes with Natural Blinking & Dual Specular Catchlights */}
          {isBlinking ? (
            /* Closed eye line when blinking */
            <>
              <path d="M 362 236 Q 378 241 392 236" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 428 236 Q 442 241 458 236" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          ) : (
            /* Open natural eyes with soft curved lids */
            <>
              {/* White Sclera with soft natural boundary */}
              <path
                d="M 362 236 C 362 226 394 226 394 236 C 394 246 362 246 362 236 Z"
                fill="#ffffff"
                stroke="#1c1917"
                strokeWidth="2"
              />
              <path
                d="M 426 236 C 426 226 458 226 458 236 C 458 246 426 246 426 236 Z"
                fill="#ffffff"
                stroke="#1c1917"
                strokeWidth="2"
              />
              {/* Rich Warm Hazel/Espresso Irises */}
              <circle cx="378" cy="235" r="7.5" fill="#362218" />
              <circle cx="442" cy="235" r="7.5" fill="#362218" />
              {/* Deep Pupils */}
              <circle cx="378" cy="235" r="4" fill="#09090b" />
              <circle cx="442" cy="235" r="4" fill="#09090b" />
              {/* Lively Dual Specular Catchlights */}
              <circle cx="380" cy="232" r="2.2" fill="#ffffff" />
              <circle cx="444" cy="232" r="2.2" fill="#ffffff" />
              <circle cx="376" cy="237" r="1.1" fill="#ffffff" opacity="0.8" />
              <circle cx="440" cy="237" r="1.1" fill="#ffffff" opacity="0.8" />
            </>
          )}

          {/* Subtle Clean Nose Contour */}
          <path
            d="M 410 228 L 412 278 Q 418 284 410 286 Q 403 284 406 278"
            stroke="#9a653e"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Dynamic Enunciation Lip-Sync Mouth */}
          {isSpeaking && mouthOpenY > 5 ? (
            <g>
              {/* Open Mouth Cavity */}
              <ellipse
                cx="410"
                cy={334 + mouthOpenY * 0.28}
                rx={mouthWidth / 2}
                ry={mouthOpenY}
                fill="#3b0d14"
                stroke="#1c1917"
                strokeWidth="2.5"
              />
              {/* Upper White Teeth Row */}
              <path
                d={`M ${410 - mouthWidth * 0.38} 332 Q 410 336 ${410 + mouthWidth * 0.38} 332 Z`}
                fill="#ffffff"
              />
              {/* Tongue Highlight */}
              {mouthOpenY > 10 && (
                <ellipse
                  cx="410"
                  cy={334 + mouthOpenY * 0.72}
                  rx={mouthWidth * 0.28}
                  ry={mouthOpenY * 0.4}
                  fill="#e11d48"
                />
              )}
            </g>
          ) : (
            /* Confident Engaging Smile */
            <path
              d="M 394 334 Q 410 340 426 334"
              stroke="#1c1917"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {/* ================= REAL ARTICULATED ARMS & HANDS ================= */}

        {/* GESTURE 1: Point Up-Right toward Cards & Content */}
        {pose === 'point_up_right' && (
          <g
            style={{
              transform: `scale(${0.93 + gestureSpring * 0.07}) rotate(${-4 + gestureSpring * 3}deg)`,
              transformOrigin: '560px 520px',
            }}
          >
            {/* Right Arm in Hoodie Sleeve */}
            <path
              d="M 535 500 L 640 350 L 680 380 L 575 540 Z"
              fill="url(#hoodieFabric)"
              stroke="#0b0e12"
              strokeWidth="3.5"
            />
            {/* Ribbed Wrist Cuff */}
            <rect
              x="635"
              y="350"
              width="45"
              height="14"
              rx="4"
              fill="#262b35"
              stroke="#0b0e12"
              strokeWidth="2"
              transform="rotate(38 635 350)"
            />

            {/* Articulated Hand Pointing Up-Right */}
            <g transform="translate(630, 300)">
              {/* Natural Palm & Curled Fingers */}
              <ellipse cx="36" cy="46" rx="22" ry="18" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="3" />
              {/* Thumb resting comfortably */}
              <path d="M 22 42 C 26 56 42 56 46 42" stroke="#1c1917" strokeWidth="2.2" fill="none" />
              
              {/* Extended Pointing Index Finger with Joint Crease */}
              <path
                d="M 26 36 C 30 16 46 -22 52 -58 C 54 -68 64 -68 64 -58 C 62 -22 52 16 46 36 Z"
                fill="url(#hoodieSkinTone)"
                stroke="#1c1917"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <ellipse cx="58" cy="-58" rx="4" ry="6" fill="#fdf2f8" opacity="0.6" />
              {/* Finger knuckle crease */}
              <path d="M 46 4 Q 54 8 58 2" stroke="#9a653e" strokeWidth="2" fill="none" />
              
              {/* Glowing Energy Sparkle at Fingertip */}
              <circle cx="60" cy="-72" r={interpolate(frame % 22, [0, 11, 22], [4, 11, 4])} fill={accentColor} />
            </g>
          </g>
        )}

        {/* GESTURE 2: Both Hands Open Explaining & Presenting */}
        {pose === 'both_hands_present' && (
          <g
            style={{
              transform: `scale(${0.94 + gestureSpring * 0.06})`,
              transformOrigin: '410px 520px',
            }}
          >
            {/* Left Arm & Palm Open */}
            <path d="M 260 510 L 180 410 L 150 435 L 230 545 Z" fill="url(#hoodieFabric)" stroke="#0b0e12" strokeWidth="3.5" />
            <rect x="155" y="415" width="38" height="12" rx="3" fill="#262b35" stroke="#0b0e12" strokeWidth="2" transform="rotate(-30 155 415)" />
            <g transform="translate(140, 390)">
              <ellipse cx="0" cy="0" rx="24" ry="16" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.8" transform="rotate(-25)" />
              <path d="M -15 -8 L -24 -24 Q -16 -28 -10 -12" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.4" />
              <path d="M -5 -12 L -6 -32 Q 4 -34 4 -14" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.4" />
              <path d="M 6 -10 L 12 -28 Q 20 -28 14 -10" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.4" />
            </g>

            {/* Right Arm & Palm Open */}
            <path d="M 560 510 L 640 410 L 670 435 L 590 545 Z" fill="url(#hoodieFabric)" stroke="#0b0e12" strokeWidth="3.5" />
            <rect x="625" y="415" width="38" height="12" rx="3" fill="#262b35" stroke="#0b0e12" strokeWidth="2" transform="rotate(30 625 415)" />
            <g transform="translate(680, 390)">
              <ellipse cx="0" cy="0" rx="24" ry="16" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.8" transform="rotate(25)" />
              <path d="M 15 -8 L 24 -24 Q 16 -28 10 -12" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.4" />
              <path d="M 5 -12 L 6 -32 Q -4 -34 -4 -14" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.4" />
              <path d="M -6 -10 L -12 -28 Q -20 -28 -14 -10" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.4" />
            </g>
          </g>
        )}

        {/* GESTURE 3: Typing on Glowing Keyboard (Interactive Coding) */}
        {(pose === 'typing_keyboard' || showHoloKeyboard) && (
          <g>
            {/* Glowing Holographic Terminal Keyboard */}
            <g transform="translate(250, 520)">
              <rect
                x="0"
                y="0"
                width="320"
                height="90"
                rx="16"
                fill="rgba(15, 23, 42, 0.85)"
                stroke="#F95738"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 0 20px rgba(249, 87, 56, 0.65))' }}
              />
              {/* Keyboard status bar */}
              <rect x="12" y="10" width="8" height="8" rx="2" fill="#10B981" />
              <text x="28" y="18" fill="#94A3B8" fontSize="10" fontFamily="'Fira Code', monospace" fontWeight="700">
                REMOTION TERMINAL ACTIVE
              </text>

              {/* Key Matrix */}
              {[28, 48, 68].map((ky, rowIdx) => (
                <g key={rowIdx}>
                  {[16, 48, 80, 112, 144, 176, 208, 240, 272].map((kx, colIdx) => {
                    const isKeyActive = (frame + colIdx * 3 + rowIdx * 5) % 8 === 0;
                    return (
                      <rect
                        key={colIdx}
                        x={kx}
                        y={ky}
                        width="26"
                        height="15"
                        rx="3.5"
                        fill={isKeyActive ? '#F95738' : 'rgba(255,255,255,0.18)'}
                        stroke={isKeyActive ? '#ffffff' : 'rgba(255,255,255,0.3)'}
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>
              ))}
            </g>

            {/* Articulated Typing Hands with Active Fingertip Motion */}
            {/* Left Hand */}
            <g transform={`translate(${330 + Math.sin(frame * 0.8) * 8}, ${495 + Math.cos(frame * 0.9) * 6})`}>
              <path d="M -30 20 L 0 0 L 25 15 L 0 35 Z" fill="url(#hoodieFabric)" stroke="#0b0e12" strokeWidth="3" />
              <ellipse cx="20" cy="15" rx="18" ry="12" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.5" />
              {/* Articulated fingers resting on keys */}
              <circle cx="28" cy="18" r="4.5" fill="url(#hoodieSkinTone)" />
              <circle cx="22" cy="24" r="4.5" fill="url(#hoodieSkinTone)" />
              <circle cx="15" cy="28" r="4" fill="url(#hoodieSkinTone)" />
            </g>

            {/* Right Hand */}
            <g transform={`translate(${490 + Math.cos(frame * 0.85) * 8}, ${495 + Math.sin(frame * 0.95) * 6})`}>
              <path d="M 30 20 L 0 0 L -25 15 L 0 35 Z" fill="url(#hoodieFabric)" stroke="#0b0e12" strokeWidth="3" />
              <ellipse cx="-20" cy="15" rx="18" ry="12" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.5" />
              {/* Articulated fingers resting on keys */}
              <circle cx="-28" cy="18" r="4.5" fill="url(#hoodieSkinTone)" />
              <circle cx="-22" cy="24" r="4.5" fill="url(#hoodieSkinTone)" />
              <circle cx="-15" cy="28" r="4" fill="url(#hoodieSkinTone)" />
            </g>
          </g>
        )}

        {/* GESTURE 4: Direct Point at Viewer (CTA / Climax) */}
        {pose === 'direct_point' && (
          <g
            style={{
              transform: `scale(${0.96 + gestureSpring * 0.1})`,
              transformOrigin: '410px 480px',
            }}
          >
            {/* Forearm foreshortened coming forward */}
            <path d="M 365 530 L 410 435 L 455 435 L 455 530 Z" fill="url(#hoodieFabric)" stroke="#0b0e12" strokeWidth="3.5" />
            <rect x="390" y="430" width="40" height="12" rx="3" fill="#262b35" stroke="#0b0e12" strokeWidth="2" />

            {/* Foreshortened Hand pointing directly into camera */}
            <g transform="translate(410, 395)">
              <ellipse cx="0" cy="0" rx="44" ry="36" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="3.5" />
              <path d="M -26 -5 Q 0 9 26 -5" stroke="#1c1917" strokeWidth="2.5" fill="none" />
              {/* Index Finger Tip Pointing Straight Out */}
              <circle cx="2" cy="-22" r="19" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="3" />
              <ellipse cx="2" cy="-25" rx="11" ry="8" fill="#f8fafc" opacity="0.65" />
              {/* Energy Ring Pulsing */}
              <circle
                cx="2"
                cy="-22"
                r={26 + Math.sin(frame * 0.22) * 5}
                fill="none"
                stroke={accentColor}
                strokeWidth="3"
                opacity="0.85"
              />
            </g>
          </g>
        )}

        {/* GESTURE 5: Conversational Natural Rest */}
        {pose === 'conversational_rest' && (
          <g
            style={{
              transform: `translateY(${Math.sin(frame * 0.32) * 4}px)`,
              transformOrigin: '410px 520px',
            }}
          >
            <path d="M 270 520 L 315 610 L 340 600 L 305 515 Z" fill="url(#hoodieFabric)" stroke="#0b0e12" strokeWidth="3" />
            <ellipse cx="335" cy="615" rx="18" ry="14" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.5" />

            <path d="M 550 520 L 505 610 L 480 600 L 515 515 Z" fill="url(#hoodieFabric)" stroke="#0b0e12" strokeWidth="3" />
            <ellipse cx="485" cy="615" rx="18" ry="14" fill="url(#hoodieSkinTone)" stroke="#1c1917" strokeWidth="2.5" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CodedTechHoodieAvatar;
