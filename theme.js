import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import {
  PRIMARY_LIGHT,
  PRIAMRY_DARK,
  NORMAL_DARK,
  NORMAL_LIGHT,
} from "./constants/Color";

const theme = extendTheme({
  fonts: {
    heading: "Inter",
    body: "Inter",
  },

  styles: {
    global: (props) => ({
      body: {
        bg: mode("#fffff", "#2c2f35")(props),
        color: mode("gray.800", "whiteAlpha.900")(props),
        lineHeight: "base",
        backgroundImage: mode(
          "radial-gradient(50% 50% at 50% 50%,rgba(247,110,17,0.1) 0%,rgba(255,255,255,0) 100%)",
          "radial-gradient(50% 50% at 50% 50%,rgba(247,110,17,0.1) 0%,rgba(33,36,41,0) 100%)"
        )(props),
        backgroundPosition: "0 -30vh",
        backgroundRepeat: "no-repeat",
        justifyContent: "center",
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
        bg: mode("#ffffff", "#292d33")(props),
        textAlign: "center",
        border: "2px solid rgba(0, 0, 0, 0.05)",
      },
      ".swap-box": {
        color: mode(NORMAL_LIGHT, NORMAL_DARK)(props),
        bg: mode("#ffffff", "#292d33")(props),
        textAlign: "center",
        borderRadius: "20px",
        boxShadow:
          "rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;",
        border: "0px solid rgba(0, 0, 0, 0.05)",
      },
      ".currency-box": {
        padding: "20px",
        color: mode(NORMAL_LIGHT, NORMAL_DARK)(props),
        bg: mode("#ffffff", "#292d33")(props),
        textAlign: "center",
        borderRadius: "20px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
      },
      ".swap-button": {
        marginTop: "20px",
        padding: "20px",
        borderRadius: "20px",
      },
      ".portfolio-box": {
        color: mode(NORMAL_LIGHT, NORMAL_DARK)(props),
        bg: mode("#ffffff", "#292d33")(props),
        textAlign: "center",
        borderRadius: "10px",
        border: "2px solid rgba(0, 0, 0, 0.05)",
      },
      ".community-icon": {
        paddingBottom: "15px",
      },
      ".pool-logo": {
        left: "38%",
        top: -10,
        position: "absolute",
        zIndex: 1,
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "50%",
      },
      ".autopool-logo": {
        left: "40%",
        top: -10,
        position: "absolute",
        zIndex: 1,
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "50%",
      },
      ".pool-box": {
        borderRadius: 10,
        color: "#000000",
        position: "relative",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
      },
      ".stat-active": {
        bg: mode("#f5f5f5", "#4c4f53")(props),
      },
      ".stat-deactive": {
        bg: mode("#ffffff", "#292d33")(props),
      },
      ".stat-box": {
        color: mode("gray.700", "whiteAlpha.900")(props),
        borderRadius: "10px",
        border: "2px solid rgba(0, 0, 0, 0.05)",
        margin: "0.5rem",
        padding: "1rem",
      },
      ".balance-box": {
        color: mode("gray.700", "whiteAlpha.900")(props),
        borderRadius: "10px",
        border: mode(
          "2px solid rgba(0, 0, 0, 0.05)",
          "2px solid #515151"
        )(props),
        // margin: "0.5rem",
        padding: "1rem",
      },
    }),
  },
});

/* Home Font Style */
const home_h1 = { base: "24px", md: "40", lg: "70" };
const home_h2 = { base: "20px", md: "30", lg: "60" };
const home_h3 = { base: "18px", md: "26px", lg: "36px" };

export default theme;
