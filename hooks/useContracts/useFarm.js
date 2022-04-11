import useContract from "../useContract";
import config from "../../config.json";
import FARM_ABI from "../../abis/Farming.json";

const useFarm = () => {
  const abi = FARM_ABI.abi;
  const contract = useContract(
    abi,
    FARM_ABI.networks[config.networkId].address
  );

  return { contract };
};

export default useFarm;
