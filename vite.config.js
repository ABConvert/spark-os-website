import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static landing page. Output is plain files served by nginx in k8s.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    // PNG screenshots are ~40-47KB; keep them as emitted files, not inlined.
    assetsInlineLimit: 4096,
  },
});
