"use client";

import { useEffect, useRef } from "react";

const BackgroundEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // ── STARS ──
    const stars = [];
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
      });
    }

    // ── CUBES ──
    const cubes = [];
    const cubeCount = 6;
    for (let i = 0; i < cubeCount; i++) {
      cubes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.2 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Stars
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw Floating Cubes
      cubes.forEach((cube) => {
        ctx.save();
        ctx.translate(cube.x, cube.y);
        ctx.rotate(cube.rotation);
        ctx.globalAlpha = cube.opacity;
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 1;
        
        // Simple 3D Cube representation (wireframe)
        ctx.strokeRect(-cube.size / 2, -cube.size / 2, cube.size, cube.size);
        ctx.strokeRect(-cube.size / 4, -cube.size / 4, cube.size, cube.size);
        
        // Connect corners for 3D effect
        ctx.beginPath();
        ctx.moveTo(-cube.size / 2, -cube.size / 2);
        ctx.lineTo(-cube.size / 4, -cube.size / 4);
        ctx.moveTo(cube.size / 2, -cube.size / 2);
        ctx.lineTo(cube.size * 0.75, -cube.size / 4);
        ctx.moveTo(-cube.size / 2, cube.size / 2);
        ctx.lineTo(-cube.size / 4, cube.size * 0.75);
        ctx.moveTo(cube.size / 2, cube.size / 2);
        ctx.lineTo(cube.size * 0.75, cube.size * 0.75);
        ctx.stroke();

        ctx.restore();

        cube.x += cube.speedX;
        cube.y += cube.speedY;
        cube.rotation += cube.rotationSpeed;

        if (cube.x < -cube.size) cube.x = canvas.width + cube.size;
        if (cube.x > canvas.width + cube.size) cube.x = -cube.size;
        if (cube.y < -cube.size) cube.y = canvas.height + cube.size;
        if (cube.y > canvas.height + cube.size) cube.y = -cube.size;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#030207] overflow-hidden">
      {/* Radial Purple Glow (Aurora Effect) */}
      <div className="absolute top-[20%] left-[30%] w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full" />
      
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>
    </div>
  );
};

export default BackgroundEffect;
