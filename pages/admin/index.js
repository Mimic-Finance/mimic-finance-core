import { Box, Text, Container } from "@chakra-ui/react";
import { AdminContextProvider } from "contexts/AdminContext";
import useAccount from "hooks/useAccount";

import Panel from "components/Admin/Panel";

const Admin = () => {
  const account = useAccount();
  return (
    <>
      <AdminContextProvider>
        <Box style={{ textAlign: "center" }}>
          <Text fontSize="4xl">Admin Panel</Text>
          <Text>{account}</Text>
        </Box>

        <Container maxW="5xl" pt={7}>
          <Panel />
        </Container>
      </AdminContextProvider>
    </>
  );
};

export default Admin;
