import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Static files come from public/ (Vite's default). NOT data/: that holds the
  // private database copy, and Vite would copy everything in it into dist/.
  base: './', // relative paths, so the built app works in any folder on the NAS
  server: {
    port: 3000,
    open: true,
    host: true, // also reachable from the iPhone on the home Wi-Fi, via the Mac's address
  },
})
