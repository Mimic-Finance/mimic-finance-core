import useContract from "../useContract";
import config from "../../config.json";
import AUTO_Compound_ABI from "../../abis/Auto.json";

const useAutoCompound = () => {
  const abi = AUTO_Compound_ABI.abi;
  const contract = useContract(
    abi,
    AUTO_Compound_ABI.networks[config.networkId].address
  );

  const methods = contract.methods;
  const address = contract._address;

  return { contract, methods, address };
};

export default useAutoCompound;
