import ERC20ABI from "constants/ERC20ABI.json";
import Toast from "components/Utils/Toast/Toast";

const useApprove = async (_account, _token, _spender, _amount, callBack) => {
  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const TokenContract = new web3.eth.Contract(ERC20ABI, _token);

  await TokenContract.methods
    .approve(_spender, _amount)
    .send({ from: _account })
    .on("transactionHash", (hash) => {
      const approveCheck = setInterval(async () => {
        const tx_status = await txStatus(hash);
        if (tx_status && tx_status.status) {
          clearInterval(approveCheck);
          Toast.fire({
            icon: "success",
            title: "Approve Success!",
          });
          callBack();
        }
      }, 1500);
    });
};

export default useApprove;
