import Image from "next/image";
import { useColorMode } from "@chakra-ui/react";

export const Logo = () => {
  const { colorMode } = useColorMode();
  return (
    <>
      <Image
        src={
          colorMode === "dark"
            ? "/assets/images/logo.png"
            : "/assets/images/logo-light.png"
        }
        width={150}
        height={46}
        alt="Mimic Finance Logo"
      />
    </>
  );
};
