/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#EDAC22",
        white: "#FFFFFF",
        subtext: "#9CA3AF",
        border: "#D1D5DB",
        red: "#dc2626",
        blue: "#155dfc",
      },
      fontFamily: {
        inter: ["Inter-Regular"],
        "inter-thin": ["Inter-Thin"],
        "inter-light": ["Inter-Light"],
        "inter-medium": ["Inter-Medium"],
        "inter-semibold": ["Inter-SemiBold"],
        "inter-bold": ["Inter-Bold"],
        "inter-extrabold": ["Inter-ExtraBold"],
      },
    },
  },
  plugins: [],
};
