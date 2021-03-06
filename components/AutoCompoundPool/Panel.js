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
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Stake</Tab>
          <Tab>Withdraw</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stake symbol={symbol} tokenAddress={tokenAddress} />
          </TabPanel>
          <TabPanel>
            <WithDraw symbol={symbol} tokenAddress={tokenAddress} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
