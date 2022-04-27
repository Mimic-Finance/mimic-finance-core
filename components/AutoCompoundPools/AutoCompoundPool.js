import { Text, Box, Button, IconButton } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import Link from "next/link";
import { FaGavel } from "react-icons/fa";

const AutoCompoundPool = (props) => {
  const getImage = (address) => {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  };

  return (
    <Box
      pt={"50px"}
      pl={8}
      pr={8}
      pb={8}
      style={
        props.gradient
          ? {
              background: `linear-gradient(40deg ,${props.gradient.color1} 0%, ${props.gradient.color2} 100%)`,
            }
          : { background: props.color }
      }
      className="pool-box"
    >
      <Image
        src={getImage(props.address)}
        alt={props.label}
        fallbackSrc="/assets/images/logo-box.png"
        className="pool-logo"
        width="80px"
      />
      <Text fontWeight="bold" fontSize="2xl">
        {props.poolName}
      </Text>
      {props.type === "lp-token" ? (
        <>
          <Text>
            <Link passHref href="https://mimic-exchange.vercel.app/">
              <a>
                <u>{props.description}</u>
              </a>
            </Link>
          </Text>
        </>
      ) : (
        <>{props.description}</>
      )}

      {/* <Text pt={3}>{props.token}</Text> */}
      <Text pt={3} fontWeight="bold">
        APY : {props.apy} %
      </Text>
      <Link href={"/auto/" + props.address} passHref>
        <Button
          leftIcon={<FaGavel />}
          mt={4}
          style={{ backgroundColor: "#232137", color: "#fff" }}
          width={"100%"}
          variant="solid"
        >
          Stake
        </Button>
      </Link>
    </Box>
  );
};

export default AutoCompoundPool;
