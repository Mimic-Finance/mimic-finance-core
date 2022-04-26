import { Text, Box, Button, IconButton } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import Link from "next/link";
import { FaGavel } from "react-icons/fa";

export const Pool = (props) => {
  const getImage = (address) => {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  };

  return (
    <Box
      p={8}
      style={{ borderRadius: 10, color: "#000000", position: "relative" }}
      bg={props.color}
    >
      <Image
        src={getImage(props.address)}
        alt={props.label}
        fallbackSrc="/assets/images/logo-box.png"
        className="pool-logo"
        width="70px"
      />
      <Text fontWeight="bold" fontSize="2xl">
        {props.poolName}
      </Text>
      {props.description}
      <Text pt={3}>{props.token}</Text>
      <Text pt={3} fontWeight="bold">
        APY : {props.apy} %
      </Text>
      <Link href={"/farm/" + props.address} passHref>
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
