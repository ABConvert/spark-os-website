import React from "react";
import { MotionCtx, useReducedMotion } from "./ui.jsx";
import { WaitlistProvider, useWaitlist } from "./WaitlistModal.jsx";
import { TopNav, Hero, Pillars, CompoundBand, Proof, FinalCta, Footer } from "./sections.jsx";

function Site() {
  const { open } = useWaitlist();
  return (
    <>
      <TopNav onCta={() => open()} />
      <Hero />
      <Pillars />
      <CompoundBand />
      <Proof />
      <FinalCta />
      <Footer />
    </>
  );
}

export default function App() {
  const reduce = useReducedMotion();
  return (
    <MotionCtx.Provider value={{ reduce }}>
      <WaitlistProvider>
        <Site />
      </WaitlistProvider>
    </MotionCtx.Provider>
  );
}
