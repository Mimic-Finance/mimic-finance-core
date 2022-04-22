import useContract from "../useContract";
import config from "../../config.json";
import FARM_ABI from "../../abis/Farming.json";

const useFarm = () => {
  const abi = FARM_ABI.abi;
  const contract = useContract(
    abi,
    FARM_ABI.networks[config.networkId].address
  );

  const methods = contract.methods;
  const address = contract._address;

  return { contract, methods, address };
};

export default useFarm;
