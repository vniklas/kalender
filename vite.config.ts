import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/kodtest/', // Byt ut 'kodtest' mot ditt repo-namn om det är annorlunda
})
