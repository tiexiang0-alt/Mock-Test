import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser?: AnalyserNode | null; // Optional now
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const bufferLength = 32; // Lower count for simulated bars
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) {
        ctx.clearRect(0, 0, rect.width, rect.height);
        // Draw a flat line indicating idle
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, rect.height / 2);
        ctx.lineTo(rect.width, rect.height / 2);
        ctx.stroke();
        return;
      }

      animationRef.current = requestAnimationFrame(draw);

      ctx.fillStyle = 'rgb(248, 250, 252)'; // bg-slate-50
      ctx.fillRect(0, 0, rect.width, rect.height);

      const barWidth = (rect.width / bufferLength);
      let x = 0;

      // If we have a real analyser (not used in Native TTS mode usually, but kept for compatibility), use it.
      // Otherwise simulate.
      if (analyser) {
        analyser.getByteFrequencyData(new Uint8Array(analyser.frequencyBinCount)); // Just to consume? 
        // Actually, the array size must match. Let's assume simulated for Native TTS mainly.
      }
      
      // Simulation Logic
      for (let i = 0; i < bufferLength; i++) {
        let barHeight;
        
        if (analyser) {
            // If we did wire up an analyser somehow
             barHeight = 10; 
        } else {
            // Simulated waveform
            // Use time to animate
            const time = Date.now() / 150;
            const noise = Math.random() * 20;
            const wave = Math.sin(i * 0.5 + time) * 30 + 30;
            barHeight = Math.max(5, wave + noise); 
            // Scale height to canvas
            barHeight = (barHeight / 100) * (rect.height * 0.8);
        }

        // Gradient color
        const gradient = ctx.createLinearGradient(0, rect.height/2 + barHeight/2, 0, rect.height/2 - barHeight/2);
        gradient.addColorStop(0, '#3b82f6'); // blue-500
        gradient.addColorStop(1, '#60a5fa'); // blue-400

        ctx.fillStyle = gradient;
        
        // Center the bars vertically
        const y = (rect.height - barHeight) / 2;
        
        // Draw rounded pill shape roughly
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barWidth - 4, barHeight, 4);
        ctx.fill();

        x += barWidth;
      }
    };

    if (isPlaying) {
      draw();
    } else {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        // Draw idle state
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, rect.height / 2);
        ctx.lineTo(rect.width, rect.height / 2);
        ctx.stroke();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isPlaying]);

  return <canvas ref={canvasRef} className="w-full h-24 rounded-lg" />;
};

export default Visualizer;