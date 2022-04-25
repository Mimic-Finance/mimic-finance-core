import {
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";

import Stake from "./Stake";
import WithDraw from "./Withdraw";

export const Panel = ({ symbol, tokenAddress }) => {
  return (
    <>
      <Text fontSize={"3xl"}>{symbol}</Text>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Stake</Tab>
          <Tab>Withdraw</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stake tokenAddress={tokenAddress} />
          </TabPanel>
          <TabPanel>
            <WithDraw tokenAddress={tokenAddress} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
