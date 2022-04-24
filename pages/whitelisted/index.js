import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Container,
  TableContainer,
  Table,
  Tr,
  Td,
  Th,
  Thead,
  Tbody,
  Image,
  Center,
} from "@chakra-ui/react";
import { useWhitelisted } from "hooks/useFunctions";

const WhitelistedPage = () => {
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);

  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  const getImage = (address) => {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;

    //return `/assets/images/logo-box.png`;
  };
  return (
    <>
      <Box style={{ textAlign: "center" }}>
        <Text fontSize="4xl">Whitelisted Token</Text>
      </Box>

      <Container maxW="5xl" pt={7}>
        <Center>
          <TableContainer maxWidth="100%">
            <Table>
              <Thead>
                <Tr>
                  <Th>Icon</Th>
                  <Th>Symbol</Th>
                  <Th>Token Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {whitelisted &&
                  whitelisted.map((token, i) => {
                    return (
                      <Tr key={i}>
                        <Td>
                          <Image
                            w={8}
                            src={getImage(token.address)}
                            alt={token.symbol}
                            fallbackSrc="/assets/images/logo-box.png"
                          ></Image>
                        </Td>
                        <Td>{token.symbol}</Td>
                        <Td>
                          <a
                            href={"https://etherscan.io/token/" + token.address}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {token.address}
                          </a>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Center>
      </Container>
    </>
  );
};

export default WhitelistedPage;
