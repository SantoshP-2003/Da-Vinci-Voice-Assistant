import React, { useEffect, useRef } from 'react';

export default function InteractiveGrid({ theme, isChatActive }) {
  const canvasRef = useRef(null);
  const sketchesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Generate sketches on initialize or parent resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Define grid columns and rows to guarantee spacing control
      const cols = 9;
      const rows = 8;
      const colWidth = width / cols;
      const rowHeight = height / rows;

      const generated = [];
      const types = [
        // Originals
        'emc2', 'triangle', 'venn', 'quadratic', 'axes', 'integral', 'molecule',
        'wave', 'pythagorean', 'limit', 'matrix', 'chemical', 'venn2',
        'trig', 'derivative', 'dna', 'binary', 'atom', 'gravity', 'relativity',
        // High elegance additions
        'euler', 'entropy', 'golden', 'fourier', 'planck', 'schrodinger', 'navier',
        'maxwell', 'bayes', 'fibonacci', 'gaussian', 'logarithm', 'derivative2',
        'comb', 'laplace', 'riemann', 'circle_geom', 'limit_inf', 'boltzmann',
        'chaos', 'reactance', 'astronomy', 'boolean'
      ];

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cellX = c * colWidth + colWidth / 2;
          const cellY = r * rowHeight + rowHeight / 2;

          // Skip drawing cells in the middle logo welcome zone (only if we're on the home screen)
          const distFromCenter = Math.sqrt((cellX - cx) * (cellX - cx) + (cellY - cy) * (cellY - cy));
          if (!isChatActive && distFromCenter < 240) continue;

          // Slightly jitter positions to look natural, but keep bounds restricted to prevent overlap
          const rx = cellX + (Math.random() - 0.5) * (colWidth * 0.4);
          const ry = cellY + (Math.random() - 0.5) * (rowHeight * 0.35);

          // Tilt and size factors to look like an organic, handdrawn chalkboard clutter!
          const rotation = (Math.random() - 0.5) * 0.38; // Tilt angle (approx ±11 degrees)
          const scale = Math.random() * 0.55 + 0.75; // Diverse sizes from 0.75x to 1.30x

          const type = types[Math.floor(Math.random() * types.length)];
          generated.push({ x: rx, y: ry, type, rotation, scale });
        }
      }
      sketchesRef.current = generated;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isChatActive]);

  // Animation loop and mouse listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId;
    const speed = 0.25; // Smooth slow downward flow

    const drawSketch = (ctx, sketch, opacity) => {
      const { x, y, type, rotation, scale } = sketch;
      
      ctx.save();
      // Translate to formula's local center, rotate it, and scale it!
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      ctx.strokeStyle = theme === 'dark' 
        ? `rgba(255, 255, 255, ${opacity})` 
        : `rgba(9, 9, 11, ${opacity})`;
      ctx.fillStyle = theme === 'dark' 
        ? `rgba(255, 255, 255, ${opacity})` 
        : `rgba(9, 9, 11, ${opacity})`;
      ctx.lineWidth = 1.5;

      switch (type) {
        case 'emc2':
          ctx.font = 'italic 17px "Libre Baskerville", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('E = mc²', 0, 0);
          break;

        case 'venn':
          ctx.beginPath();
          ctx.arc(-5, -3, 11, 0, Math.PI * 2);
          ctx.arc(5, -3, 11, 0, Math.PI * 2);
          ctx.arc(0, 5, 11, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(-15, 10);
          ctx.lineTo(15, 10);
          ctx.lineTo(-15, -15);
          ctx.closePath();
          ctx.stroke();
          break;

        case 'quadratic':
          ctx.font = 'italic 11px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('x = -b ± √b² - 4ac', 0, -5);
          ctx.beginPath();
          ctx.moveTo(-45, 1);
          ctx.lineTo(45, 1);
          ctx.stroke();
          ctx.fillText('2a', 0, 11);
          break;

        case 'axes':
          ctx.beginPath();
          ctx.moveTo(0, -15);
          ctx.lineTo(0, 15);
          ctx.moveTo(-15, 0);
          ctx.lineTo(15, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI, true);
          ctx.stroke();
          break;

        case 'integral':
          ctx.font = 'italic 13px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('∫ x² dx = x³/3 + C', 0, 0);
          break;

        case 'molecule':
          ctx.beginPath();
          ctx.arc(-10, 0, 4, 0, Math.PI * 2);
          ctx.arc(6, -8, 3, 0, Math.PI * 2);
          ctx.arc(6, 8, 3, 0, Math.PI * 2);
          ctx.moveTo(-6, 0);
          ctx.lineTo(3, -6);
          ctx.moveTo(-6, 0);
          ctx.lineTo(3, 6);
          ctx.stroke();
          break;

        case 'wave':
          ctx.beginPath();
          for (let k = -20; k <= 20; k++) {
            const py = Math.sin(k * 0.25) * 8;
            if (k === -20) ctx.moveTo(k, py);
            else ctx.lineTo(k, py);
          }
          ctx.stroke();
          break;

        case 'pythagorean':
          ctx.font = 'italic 14px "Libre Baskerville", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('a² + b² = c²', 0, 0);
          break;

        case 'limit':
          ctx.font = '11px Courier New';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('lim (x→0) sin(x)/x = 1', 0, 0);
          break;

        case 'matrix':
          ctx.font = '11px Courier New';
          ctx.textAlign = 'center';
          ctx.fillText('[ 1  0 ]', 0, -5);
          ctx.fillText('[ 0  1 ]', 0, 6);
          break;

        case 'chemical':
          ctx.font = '12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('CO₂ + H₂O → H₂CO₃', 0, 0);
          break;

        case 'venn2':
          ctx.beginPath();
          ctx.arc(-5, 0, 10, 0, Math.PI * 2);
          ctx.arc(5, 0, 10, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'trig':
          ctx.font = '12px "Libre Baskerville", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('sin²(θ) + cos²(θ) = 1', 0, 0);
          break;

        case 'derivative':
          ctx.font = 'italic 13px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('d/dx [e^x] = e^x', 0, 0);
          break;

        case 'dna':
          ctx.beginPath();
          for (let k = -18; k <= 18; k += 4) {
            const y1 = Math.sin(k * 0.35) * 5;
            const y2 = Math.sin(k * 0.35 + Math.PI) * 5;
            ctx.arc(k, y1, 1, 0, Math.PI * 2);
            ctx.arc(k, y2, 1, 0, Math.PI * 2);
            ctx.moveTo(k, y1);
            ctx.lineTo(k, y2);
          }
          ctx.stroke();
          break;

        case 'binary':
          ctx.font = '9px Courier New';
          ctx.textAlign = 'center';
          ctx.fillText('01101001', 0, -4);
          ctx.fillText('01110100', 0, 6);
          break;

        case 'atom':
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.save();
          ctx.scale(1, 0.35);
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          ctx.save();
          ctx.rotate(Math.PI / 3);
          ctx.scale(1, 0.35);
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          break;

        case 'gravity':
          ctx.font = 'italic 12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('F = G · m₁m₂/r²', 0, 0);
          break;

        case 'relativity':
          ctx.font = 'italic 12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('R_μν - 1/2 R g_μν = T_μν', 0, 0);
          break;

        case 'euler':
          ctx.font = 'italic 15px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('e^(iπ) + 1 = 0', 0, 0);
          break;

        case 'entropy':
          ctx.font = '12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('H(X) = -∑ Plog P', 0, 0);
          break;

        case 'golden':
          ctx.font = 'italic 14px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('φ = (1 + √5)/2', 0, 0);
          break;

        case 'fourier':
          ctx.font = 'italic 12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('F(ω) = ∫ f(t) e^(-iωt) dt', 0, 0);
          break;

        case 'planck':
          ctx.font = 'italic 14px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('E = hν', 0, 0);
          break;

        case 'schrodinger':
          ctx.font = 'italic 13px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('iħ ∂/∂t Ψ = ĤΨ', 0, 0);
          break;

        case 'navier':
          ctx.font = 'italic 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('ρ(∂u/∂t + u·∇u) = -∇p + μ∇²u', 0, 0);
          break;

        case 'maxwell':
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('∇ × E = -∂B/∂t', 0, 0);
          break;

        case 'bayes':
          ctx.font = '12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('P(A|B) = P(B|A)P(A)/P(B)', 0, 0);
          break;

        case 'fibonacci':
          ctx.font = '11px Courier New';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('F_n = F_(n-1) + F_(n-2)', 0, 0);
          break;

        case 'gaussian':
          ctx.beginPath();
          for (let k = -20; k <= 20; k++) {
            const py = -Math.exp(-(k * k) / 100) * 12;
            if (k === -20) ctx.moveTo(k, py);
            else ctx.lineTo(k, py);
          }
          ctx.stroke();
          break;

        case 'logarithm':
          ctx.font = '12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('ln(xy) = ln(x) + ln(y)', 0, 0);
          break;

        case 'derivative2':
          ctx.font = 'italic 12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('dy/dx = (dy/du)·(du/dx)', 0, 0);
          break;

        case 'comb':
          ctx.font = '12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('C(n,k) = n! / [k!(n-k)!]', 0, 0);
          break;

        case 'laplace':
          ctx.font = 'italic 12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('L{f(t)} = ∫ e^(-st)f(t) dt', 0, 0);
          break;

        case 'riemann':
          ctx.font = 'italic 13px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('ζ(s) = ∑ 1/nˢ', 0, 0);
          break;

        case 'circle_geom':
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(7, -7);
          ctx.stroke();
          break;

        case 'limit_inf':
          ctx.font = '11px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('lim(n→∞)(1+1/n)ⁿ = e', 0, 0);
          break;

        case 'boltzmann':
          ctx.font = 'italic 13px "Libre Baskerville", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('S = k · log W', 0, 0);
          break;

        case 'chaos':
          ctx.font = 'italic 12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('x_(n+1) = r x_n(1-x_n)', 0, 0);
          break;

        case 'reactance':
          ctx.font = '12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('X_C = 1 / (2π f C)', 0, 0);
          break;

        case 'astronomy':
          ctx.font = '12px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('T² = 4π²a³ / GM', 0, 0);
          break;

        case 'boolean':
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('A·(B+C) = A·B + A·C', 0, 0);
          break;

        default:
          break;
      }
      ctx.restore();
    };

    const loop = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      sketchesRef.current.forEach(sketch => {
        // Apply slow downward drift flow
        sketch.y += speed;

        // Wrap around when passing off-screen boundaries
        if (sketch.y > height + 60) {
          sketch.y = -60;
        }

        let opacity = 0.0;

        if (isChatActive) {
          // If we are actively in chat: no spotlight animation. Just a soft uniform backdrop glow!
          opacity = theme === 'dark' ? 0.035 : 0.025;
        } else {
          // Home page: Spotlight is active. Only illuminated under the cursor!
          const dx = mouse.x - sketch.x;
          const dy = mouse.y - sketch.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const torchRadius = 220;

          if (dist < torchRadius) {
            const factor = (torchRadius - dist) / torchRadius;
            opacity = factor * (theme === 'dark' ? 0.85 : 0.65);
          }
        }

        if (opacity > 0.01) {
          drawSketch(ctx, sketch, opacity);
        }
      });

      animFrameId = requestAnimationFrame(loop);
    };

    loop();

    const handleMouseMove = (e) => {
      if (isChatActive) return; // ignore mouse coordinate calculations during chat to boost performance
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [theme, isChatActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}
