import {
  Box,
  Link,
  SimpleGrid,
  SimpleGridProps,
  Stack,
} from "@chakra-ui/react";
import { FooterHeading } from "./FooterHeading";

export const LinkGrid = (props) => (
  <SimpleGrid columns={2} {...props}>
    <Box minW="130px">
      <FooterHeading mb="4">Site Map</FooterHeading>
      <Stack>
        <Link>Home</Link>
        <Link>Vault</Link>
        <Link>Documentation</Link>
      </Stack>
    </Box>
    <Box minW="130px">
      <FooterHeading mb="4">Community</FooterHeading>
      <Stack>
        <Link>Twitter</Link>
        <Link>Telegram</Link>
        <Link>GitBook</Link>
      </Stack>
    </Box>
  </SimpleGrid>
);
