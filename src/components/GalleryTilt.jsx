import { useEffect, useRef } from 'react';

// Keep hover motion separate from carousel positioning, arrival and card flipping.
export default function GalleryTilt({ children, disabled }) {
  const root = useRef(null);
  const controls = useRef(null);
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  useEffect(() => {
    const element = root.current;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const current = [0, 0, 1, 0], target = [...current], velocity = [0, 0, 0, 0];
    let frame = 0, previous = 0;
    const paint = () => {
      element.style.transform = `perspective(900px) rotateX(${current[0]}deg) rotateY(${current[1]}deg) scale(${current[2]})`;
      element.style.setProperty('--glare-opacity', current[3]);
    };
    const tick = time => {
      const dt = Math.min((time - (previous || time - 16.67)) / 1000, .032);
      previous = time;
      let moving = false;
      current.forEach((value, i) => {
        const stiffness = i === 3 ? 120 : 180, damping = i === 3 ? 20 : 18;
        velocity[i] += ((target[i] - value) * stiffness - velocity[i] * damping) * dt;
        current[i] += velocity[i] * dt;
        if (Math.abs(target[i] - current[i]) + Math.abs(velocity[i]) > .0005) moving = true;
      });
      paint();
      if (moving) frame = requestAnimationFrame(tick);
      else { frame = 0; previous = 0; }
    };
    const animate = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const reset = () => { target.splice(0, 4, 0, 0, 1, 0); animate(); };
    const move = event => {
      if (disabledRef.current || preference.matches || event.pointerType !== 'mouse' || element.closest('.is-dragging')) return;
      const rect = element.parentElement.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      target.splice(0, 4, -(y - .5) * 12, (x - .5) * 16, 1.03, 1);
      element.style.setProperty('--light-x', `${x * 100}%`);
      element.style.setProperty('--light-y', `${y * 100}%`);
      animate();
    };
    const changed = () => {
      if (preference.matches) { cancelAnimationFrame(frame); frame = 0; previous = 0; current.splice(0, 4, 0, 0, 1, 0); target.splice(0, 4, ...current); velocity.fill(0); paint(); }
    };
    controls.current = { reset };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', reset);
    preference.addEventListener('change', changed);
    return () => { cancelAnimationFrame(frame); element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset); preference.removeEventListener('change', changed); };
  }, []);
  useEffect(() => { if (disabled) controls.current?.reset(); }, [disabled]);
  return <div ref={root} className="gallery-tilt">{children}<div className="gallery-glare" aria-hidden="true" /></div>;
}
