/** Shared retro-arcade Tailwind preset. Consuming apps point their `content`
 *  glob at their own files; this preset only supplies theme tokens + plugins. */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: "#0b0b12",
          panel: "#14141f",
          cyan: "#39ffe4",
          magenta: "#ff2bd6",
          purple: "#8b2bff",
          amber: "#ffb000",
          green: "#39ff6a",
          red: "#ff3860",
        },
      },
      fontFamily: {
        arcade: ["'Press Start 2P'", "monospace"],
      },
      boxShadow: {
        neon: "0 0 4px currentColor, 0 0 12px currentColor",
      },
      dropShadow: {
        neon: "0 0 6px currentColor",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.85" },
          "94%": { opacity: "1" },
        },
      },
      animation: {
        flicker: "flicker 3s infinite",
      },
    },
  },
  plugins: [
    // CRT scanline overlay: apply `.crt` to a relatively-positioned container.
    function ({ addUtilities }) {
      addUtilities({
        ".crt::before": {
          content: '""',
          position: "absolute",
          inset: "0",
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "multiply",
        },
      });
    },
  ],
};
