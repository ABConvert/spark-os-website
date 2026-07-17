import React from "react";
import { MotionCtx, useReducedMotion } from "./ui.jsx";
import { WaitlistProvider } from "./WaitlistModal.jsx";
import {
  TopNav,
  Hero,
  Observe,
  Measure,
  Squads,
  Operate,
  Brain,
  Integrations,
  UseCases,
  FinalCta,
  Footer,
} from "./sections.jsx";

export default function App() {
  const reduce = useReducedMotion();
  return (
    <MotionCtx.Provider value={{ reduce }}>
      <WaitlistProvider>
        <TopNav />
        <Hero />
        <Observe />
        <Measure />
        <Squads />
        <Operate />
        <Brain />
        <Integrations />
        <UseCases />
        <FinalCta />
        <Footer />
      </WaitlistProvider>
    </MotionCtx.Provider>
  );
}
