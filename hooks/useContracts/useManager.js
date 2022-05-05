import useContract from "../useContract";
import config from "../../config.json";
import MANAGER_ABI from "../../abis/Manager.json";

const useManager = () => {
  const abi = MANAGER_ABI.abi;
  const contract = useContract(
    abi,
    MANAGER_ABI.networks[config.networkId].address
  );

  const methods = contract.methods;
  const address = contract._address;

  return { contract, methods, address };
};

export default useManager;
