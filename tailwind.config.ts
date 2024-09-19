/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        "2xl": "1440px",
      },
    },
    fontSize: {
      xs: ["10px", "12px"],
      sm: ["12px", "16px"],
      sm2: ["14px", "16px"],
      md: ["14px", "18px"],
      md2: ["15px", "24px"],
      lg: ["16px", "20px"],
      xl: ["20px", "24px"],
      "2xl": ["24px", "36px"],
      "3xl": ["28px", "36px"],
      "4xl": ["32px", "40px"],
      "5xl": ["36px", "44px"],
      "6xl": ["40px", "48px"],
      "7xl": ["56px", "68px"],
      btnSm: ["13px", "16px"],
      btnMd: ["15px", "24px"],
      logoSize: ["40px", "44px"],
      logoMobile: ["20px", "28px"],
      cartDesktop: ["28px", "40px"],
      faq: ["24px", "32px"],
      aboutUs: ["24px", "36px"],
      faqExtended: ["20px", "28px"],
      featured: ["32px", "44px"],
      blueTitle: ["56px", "68px"],
      smallTitles: ["16px", "22px"],
      profileTitle: ["28px", "36px"],
    },
    extend: {
      backdropBlur: {
        "3xl": "60px",
      },
      blur: { xl: "20px" },
      backgroundImage: {
        backgroundImg: "url('/background.png')",
        rectangleImg: "url('/img/rectangle.png')",
        "custom-gradient":
          "linear-gradient(158.32deg, #242E35 100%, rgba(36, 46, 53, 0) 100%)",
        "secondary-less": "var(--Black-less-opacity, rgba(33, 37, 41, 0.70))",
      },
      fontFamily: {
        chakra: ["Chakra Petch", "sans-serif"],
      },
      colors: {
        brand: "#D3F85A",
        background: "#1B2328",
        brandBlack: "var(--Black-less-opacity, rgba(52, 61, 64, 0.50))",
        bannerBlack: "var(--Black-less-opacity, rgba(33, 37, 41, 0.70))",
        gray00: "#ffffff",
        gray50: "#D7DADC",
        gray100: "#9AA2A7",
        gray200: "#58646C",
        gray300: "#36454F",
        gray400: "#2D3A42",
        gray500: "#242E35",
        gray600: "#1B2328",
        gradientStart: "#FDAD32",
        gradientEnd: "#F187FB",
        systemSuccess: "#2CB59E",
        systemError: "#FF5C69",
        systemInformation: "#007FFF",
        borderColor: "rgba(189, 184, 175, 0.62)",
        qrGradientStart: "rgba(36, 46, 53, 1)",
        qrGradientEnd: "rgba(36, 46, 53, 0)",
      },
      border: { "1": "1px" },
      rounded: { "4xl": "48px" },
      backgrounds: {
        primaryBrandGrad: "",
        neutral500: "#2B2B2B",
      },
      boxShadow: {
        shadowBrand: "0 0 240px 0 #FD7C5B",
        shadowFeatured: "0 0 240px 0 #464DFF",
        scanner: "0px 0px 80px rgba(133, 82, 245, 0.40)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-in-out",
      },
    },
    screens: {
      xs2: "360px",
      
      xs: "400px",

      sm: "640px",
      // => @media (min-width: 576px) { ... }

      md: "768px",
      // => @media (min-width: 960px) { ... }

      lg: "960px",
      // => @media (min-width: 1440px) { ... }
      xl: "1024px",
      // => @media (min-width: 1920px) { ... }
      xl2: "1280px",
      xl3: "1440px",
      // => @media (min-width: 2560px) { ... }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
