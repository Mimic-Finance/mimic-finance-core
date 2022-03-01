import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const PRIMARY_LIGHT = "#466dec";
const PRIAMRY_DARK = "#8bc4ff";

const NORMAL_LIGHT = "gray.700";
const NORMAL_DARK = "whiteAlpha.900";

const theme = extendTheme({
  fonts: {
    heading: "Montserrat",
    body: "Montserrat",
  },

  styles: {
    global: (props) => ({
      body: {
        color: mode("gray.800", "whiteAlpha.900")(props),
        lineHeight: "base",
      },
      /**
       * Text Color Section
       */
      ".text-primary": {
        color: mode(PRIMARY_LIGHT, PRIAMRY_DARK)(props),
      },
      "text-white": {
        color: mode(PRIAMRY_DARK, PRIAMRY_DARK)(props),
      },
      ".text-normal": {
        color: mode(NORMAL_LIGHT, NORMAL_DARK)(props),
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
        color: mode(NORMAL_LIGHT, NORMAL_DARK)(props),
        bg: mode("#ffffff", "#222d3b"),
        textAlign: "center",
        border: "2px solid rgba(0, 0, 0, 0.05)",
      },
      ".portfolio-box": {
        color: mode(NORMAL_LIGHT, NORMAL_DARK)(props),
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
