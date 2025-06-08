// -------------Connect MetaMask & Get Wallet Balance ------------//
//ANY EVM-BLOCKCHAIN
let provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

async function connectMetamask() {
  //Metamask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  signer = await provider.getSigner();

  console.log("Account Address:", await signer.getAddress());
}

async function getBalance() {
  const balance = await signer.getBalance();
  const convertToEth = 1e18;
  console.log("Account Balance in Ether:", balance.toString() / convertToEth);
}
