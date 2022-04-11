import useContract from "../useContract";
import config from "../../config.json";
import AUTO_Compound_ABI from "../../abis/Auto.json";

const useAutoCompound = () => {
  const abi = AUTO_Compound_ABI.abi;
  const contract = useContract(
    abi,
    AUTO_Compound_ABI.networks[config.networkId].address
  );

  return { contract };
};

export default useAutoCompound;
