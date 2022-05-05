import useContract from "../useContract";
import config from "../../config.json";
import JUSDTocJUSD_ABI from "../../abis/JUSDTocJUSD.json";

const useJUSDTocJUSD = () => {
  const abi = JUSDTocJUSD_ABI.abi;
  const contract = useContract(
    abi,
    JUSDTocJUSD_ABI.networks[config.networkId].address
  );

  const methods = contract.methods;
  const address = contract._address;

  return { contract, methods, address };
};

export default useJUSDTocJUSD;
