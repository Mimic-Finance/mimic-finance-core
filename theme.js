import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  fonts: {
    heading: "Montserrat",
    body: "Montserrat",
  },

  styles: {
    global: () => ({
      body: {
        color: mode("gray.800", "whiteAlpha.900"),
        lineHeight: "base",
      },
      /**
       * Text Color Section
       */
      ".text-primary": {
        color: mode(Color.PRIMARY_LIGHT, Color.PRIAMRY_DARK),
      },
      "text-white": {
        color: mode(Color.PRIAMRY_DARK, Color.PRIAMRY_DARK),
      },
      ".text-normal": {
        color: mode(Color.NORMAL_LIGHT, Color.NORMAL_DARK),
      },
      ".home-title": {
        fontWeight: 900,
        fontSize: home_h1,
      },
      ".home-subtitle": {
        fontWeight: 900,
        fontSize: home_h2,
      },
      ".home-h3": {
        fontWeight: 900,
        fontSize: home_h3,
      },
      ".btn-launch-app": {},
      ".community-box": {
        color: mode(Color.NORMAL_LIGHT, Color.NORMAL_DARK),
        bg: mode("#ffffff", "#222d3b"),
        textAlign: "center",
        border: "2px solid rgba(0, 0, 0, 0.05)",
      },
      ".portfolio-box": {
        color: mode(Color.NORMAL_LIGHT, Color.NORMAL_DARK),
        bg: mode("#ffffff", "#222d3b"),
        textAlign: "center",
        borderRadius: "10px",
        border: "2px solid rgba(0, 0, 0, 0.05)",
      },
      ".community-icon": {
        paddingBottom: "15px",
      },
      ".pool-logo": {
        top: -30,
        right: -34,
        position: "absolute",
        zIndex: 1,
        width: 150,
      },
    }),
  },
});

/* Home Font Style */
const home_h1 = { base: "24px", md: "40", lg: "70" };
const home_h2 = { base: "20px", md: "30", lg: "60" };
const home_h3 = { base: "18px", md: "26px", lg: "36px" };

export default theme;
