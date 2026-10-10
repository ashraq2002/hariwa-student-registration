import { useEffect, useRef } from 'react';
import { useTheme } from '../controllers/ThemeContext.jsx';

export default function ParticlesBackground({ quantity = 75, className = '' }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = document.documentElement.clientWidth || window.innerWidth);
    let height = (canvas.height = document.documentElement.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = document.documentElement.clientWidth || window.innerWidth;
      height = canvas.height = document.documentElement.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking across window for interactive repulsion
    let mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Shockwave ripples on click
    let ripples = [];

    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.4,
        speed: 8,
        maxForce: 16,
        alpha: 0.85,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Create particle array
    const particles = Array.from({ length: quantity }, () => {
      const vx = (Math.random() - 0.5) * 0.7;
      const vy = (Math.random() - 0.5) * 0.7;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        size: Math.random() * 2.2 + 1.2,
        alpha: Math.random() * 0.45 + 0.45,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Dynamically evaluate theme on each frame for seamless theme switching
      const isDark = document.documentElement.classList.contains('dark');
      // Dark theme: crisp glowing pure white; Light theme: vibrant celestial blue matching screenshot
      const particleColor = isDark ? '255, 255, 255' : '59, 130, 246';
      const lineBaseColor = isDark ? '255, 255, 255' : '59, 130, 246';

      // Process and render click shockwave ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.radius += ripple.speed;
        ripple.alpha = Math.max(0, (1 - ripple.radius / ripple.maxRadius) * 0.85);

        if (ripple.radius >= ripple.maxRadius || ripple.alpha <= 0) {
          ripples.splice(r, 1);
          continue;
        }

        // Draw expanding visual shockwave ring
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${lineBaseColor}, ${ripple.alpha * 0.45})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${particleColor}, ${ripple.alpha * 0.7})`;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Repel particles at the expanding wavefront
        particles.forEach((p) => {
          const dx = p.x - ripple.x;
          const dy = p.y - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const waveDist = Math.abs(dist - ripple.radius);
          if (waveDist < 40 && dist > 0) {
            const wavePower = (1 - waveDist / 40) * (ripple.alpha / 0.85);
            const pushX = (dx / dist) * wavePower * ripple.maxForce;
            const pushY = (dy / dist) * wavePower * ripple.maxForce;

            p.vx += pushX * 0.15;
            p.vy += pushY * 0.15;
            p.x += pushX * 0.25;
            p.y += pushY * 0.25;
          }
        });
      }

      // Draw constellation connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 145) {
            const lineAlpha = (1 - dist / 145) * (isDark ? 0.24 : 0.22);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineBaseColor}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Damp extra impulse back to base wandering speed smoothly
        p.vx += (p.baseVx - p.vx) * 0.04;
        p.vy += (p.baseVy - p.vy) * 0.04;

        // Continuous travel across the page
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges for continuous floating flow
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse repulsion interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }

        // Pulsate glow
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const currentAlpha = Math.max(0.25, Math.min(0.95, p.alpha));

        // Render particle glow and node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${currentAlpha})`;
        ctx.shadowBlur = isDark ? 9 : 6;
        ctx.shadowColor = `rgba(${particleColor}, ${isDark ? 0.8 : 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [quantity, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full max-w-full max-h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}
    />
  );
}
