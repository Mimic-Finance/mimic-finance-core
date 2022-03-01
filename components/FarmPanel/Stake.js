import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Center,
  Text,
  Button,
} from "@chakra-ui/react";
const Stake = () => {
  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
        <GridItem colSpan={3}>
          <Select
            placeholder="Token"
            style={{ borderRadius: "10px 0px 0px 10px" }}
          >
            <option>BNB</option>
            <option>BUSD</option>
            <option>USDT</option>
          </Select>
        </GridItem>
        <GridItem colSpan={7}>
          <FormControl id="email">
            <Input
              type="number"
              style={{ borderRadius: "0px 10px 10px 0px" }}
              placeholder="0.00"
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Center m={-2}>
        <Text fontSize="3xl">+</Text>
      </Center>

      <Grid templateColumns="repeat(10, 1fr)" gap={0} mt={0}>
        <GridItem colSpan={3}>
          <Select
            placeholder="Token"
            style={{ borderRadius: "10px 0px 0px 10px" }}
          >
            <option>BNB</option>
            <option>BUSD</option>
            <option>USDT</option>
          </Select>
        </GridItem>
        <GridItem colSpan={7}>
          <FormControl id="email">
            <Input
              type="number"
              style={{ borderRadius: "0px 10px 10px 0px" }}
              placeholder="0.00"
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Button mt={5} mb={5} w={"100%"}>
        Add More Token
      </Button>
      <hr />
      <Button
        style={{
          color: "#FFFFFF",
          background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
        }}
        mt={2}
        mb={5}
        w={"100%"}
      >
        Approve
      </Button>
    </>
  );
};

export default Stake;
