"use client";

import React, { useState, useEffect } from "react";

const AuraBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-30 h-full w-full bg-[#030014]" />
    );
  }

  return (
    <>
      {/* Deep Purple-to-Black radial gradient base */}
      <div
        className="fixed inset-0 -z-30 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, #0b0118 0%, #030014 60%, #000000 100%)",
        }}
      />

      {/* CSS-only moving starfield */}
      <div className="starfield-wrap -z-20">
        <div className="star-layer-1" />
        <div className="star-layer-2" />
        <div className="star-layer-3" />
      </div>

      {/* Subtle nebula glow blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[5%] w-[50%] h-[50%] rounded-full bg-purple-600/8 blur-[180px]" />
        <div className="absolute bottom-[-5%] left-[0%] w-[45%] h-[45%] rounded-full bg-cyan-500/6 blur-[160px]" />
      </div>
    </>
  );
};

export default AuraBackground;
