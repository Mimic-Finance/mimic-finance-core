import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
const WithDraw = () => {
  return (
    <>
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

      <div style={{ paddingTop: "20px" }}></div>
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
        Withdraw
      </Button>
    </>
  );
};

export default WithDraw;
