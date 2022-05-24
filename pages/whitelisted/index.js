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
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";

const WhitelistedPage = () => {
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);

  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  const getImage = (address) => {
    return `/assets/images/tokens/${address}.png`;

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
                          <Link passHref href={"/farm/" + token.address}>
                            <a>
                              <Text>
                                {token.address} <ExternalLinkIcon />
                              </Text>
                            </a>
                          </Link>
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
