import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    rotation: number;
    rotationSpeed: number;
    color: string;
    type: "lotus" | "dot" | "flag";
}

const COLORS = [
    "rgba(251, 191, 36, 0.4)", // amber
    "rgba(249, 115, 22, 0.3)", // orange
    "rgba(239, 68, 68, 0.2)",  // red
    "rgba(234, 179, 8, 0.3)",  // gold
    "rgba(217, 119, 6, 0.25)", // amber dark
];

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = (): Particle => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: Math.random() * -0.8 - 0.2,
            opacity: Math.random() * 0.6 + 0.1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            type: ["lotus", "dot", "flag"][Math.floor(Math.random() * 3)] as Particle["type"],
        });

        const initParticles = () => {
            particles = Array.from({ length: 30 }, createParticle);
        };

        const drawLotus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
            ctx.save();
            ctx.globalAlpha = opacity;
            const petalCount = 6;
            for (let i = 0; i < petalCount; i++) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((i * Math.PI * 2) / petalCount);
                ctx.beginPath();
                ctx.ellipse(0, -size * 0.8, size * 0.35, size * 0.8, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(251, 191, 36, ${opacity * 0.6})`;
                ctx.fill();
                ctx.restore();
            }
            // Center circle
            ctx.beginPath();
            ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(249, 115, 22, ${opacity * 0.8})`;
            ctx.fill();
            ctx.restore();
        };

        const drawParticle = (p: Particle) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);

            if (p.type === "lotus") {
                drawLotus(ctx, 0, 0, p.size, p.opacity);
            } else if (p.type === "flag") {
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
            } else {
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            ctx.restore();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.rotation += p.rotationSpeed;

                // Fade out near edges
                if (p.y < 0) {
                    p.y = canvas.height;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;

                drawParticle(p);
            });

            animationId = requestAnimationFrame(animate);
        };

        resize();
        initParticles();
        animate();

        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ opacity: 0.6 }}
        />
    );
};

export default ParticleBackground;
