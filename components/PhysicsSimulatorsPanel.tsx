
// components/PhysicsSimulatorsPanel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocalization } from '../context/AuraContext.tsx';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
}

export const PhysicsSimulatorsPanel = () => {
    const { t } = useLocalization();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRunning, setIsRunning] = useState(false);
    const animationRef = useRef<number | null>(null);
    const particles = useRef<Particle[]>([]);

    const initParticles = (width: number, height: number) => {
        const p: Particle[] = [];
        for (let i = 0; i < 50; i++) {
            p.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 2,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }
        particles.current = p;
    };

    const update = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        
        // Physics Loop
        for (let i = 0; i < particles.current.length; i++) {
            const p = particles.current[i];
            
            // Gravity toward center
            const dx = width / 2 - p.x;
            const dy = height / 2 - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 10) {
                p.vx += (dx / dist) * 0.05;
                p.vy += (dy / dist) * 0.05;
            }

            p.x += p.vx;
            p.y += p.vy;
            
            // Friction
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Bounds
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }

        animationRef.current = requestAnimationFrame(() => update(ctx, width, height));
    };

    const toggleSimulation = () => {
        if (isRunning) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            setIsRunning(false);
        } else {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    if (particles.current.length === 0) initParticles(canvasRef.current.width, canvasRef.current.height);
                    setIsRunning(true);
                    update(ctx, canvasRef.current.width, canvasRef.current.height);
                }
            }
        }
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <div className="side-panel">
            <p className="reason-text">
                Interactive Particle Physics Simulation (Gravity Well).
            </p>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', background: '#000' }}>
                <canvas 
                    ref={canvasRef} 
                    width={500} 
                    height={300} 
                    style={{ width: '100%', display: 'block' }}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={toggleSimulation}>
                    {isRunning ? 'Pause Simulation' : 'Start Simulation'}
                </button>
                 <button className="control-button" onClick={() => {
                     if(canvasRef.current) initParticles(canvasRef.current.width, canvasRef.current.height);
                 }}>
                    Reset
                </button>
            </div>
        </div>
    );
};
