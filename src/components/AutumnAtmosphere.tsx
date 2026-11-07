import React, { useEffect, useState } from 'react';

const leaves = [
  {left: 3, size: 22, duration: 25, delay: -8, drift: 34, color: '#B87B48'},
  {left: 94, size: 28, duration: 29, delay: -19, drift: -30, color: '#B59355'},
  {left: 16, size: 17, duration: 32, delay: -4, drift: 45, color: '#AC7B8C'},
  {left: 84, size: 21, duration: 27, delay: -13, drift: -42, color: '#BE9455'},
  {left: 39, size: 14, duration: 36, delay: -25, drift: 28, color: '#AA8FB9'},
  {left: 68, size: 18, duration: 31, delay: -15, drift: -34, color: '#C38E66'},
];

export const AutumnAtmosphere: React.FC = () => {
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return (
    <div aria-hidden="true" className={`autumn-atmosphere ${hidden ? 'atmosphere-paused' : ''}`}>
      <svg className="atmosphere-mountains" viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none">
        <path d="M0 380C140 310 210 370 340 260S510 290 660 205 870 280 1010 170 1260 230 1440 110V600H0Z" fill="#D5C2E1" opacity=".16" />
        <path d="M0 445C190 400 270 470 450 350S720 430 880 320 1160 370 1440 280V600H0Z" fill="#BAA2CD" opacity=".12" />
        <path d="M0 520C230 450 350 530 570 445S900 520 1120 430 1300 440 1440 400V600H0Z" fill="#E0C49B" opacity=".12" />
      </svg>
      {leaves.map((leaf, index) => (
        <span key={index} className="falling-leaf" style={{
          left: `${leaf.left}%`, width: leaf.size, height: leaf.size,
          animationDuration: `${leaf.duration}s`, animationDelay: `${leaf.delay}s`,
          '--leaf-drift': `${leaf.drift}px`, color: leaf.color,
        } as React.CSSProperties}>
          <svg viewBox="0 0 64 64" fill="currentColor">
            <path d="m32 3 6 16 9-7-2 15 14-3-8 12 8 5-19 6-7-3 2 16h-3l-2-16-7 4-18-7 8-6L5 24l14 3-2-15 10 7Z" />
            <path d="M32 15v32M20 29l12 10 12-10" fill="none" stroke="white" strokeOpacity=".35" strokeWidth="1" />
          </svg>
        </span>
      ))}
    </div>
  );
};
