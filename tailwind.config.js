/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#EDAC22",
        white: "#FFFFFF",
        black: "#000000",
        light: "#F9FAFB",
        dark: "#1E1E1E",
        subtext: "#808080",
        border: "#D1D5DB",
        red: "#DC2626",
        green: "#25A925",
        blue: "#1F72FA",
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
