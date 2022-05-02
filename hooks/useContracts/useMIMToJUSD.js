import useContract from "../useContract";
import config from "../../config.json";
import MIMToJUSD_ABI from "../../abis/MIMToJUSD.json";

const useMIMToJUSD = () => {
  const abi = MIMToJUSD_ABI.abi;
  const contract = useContract(
    abi,
    MIMToJUSD_ABI.networks[config.networkId].address
  );

  const methods = contract.methods;
  const address = contract._address;

  return { contract, methods, address };
};

export default useFarm;
