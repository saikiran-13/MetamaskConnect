
import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Signer Address", signer.getAddress())
  const { ethereum } = window
  const [address, setAddress] = useState("0x00..")
  const [balance, setBalance] = useState(0)
  const [toAddress,setToAddress] = useState("")
  const [amount,setAmount] = useState("")

  //Using events on ethereum
  useEffect(() => {

    ethereum.on("accountsChanged", (accounts) => {
      accountDetails()
    })

    ethereum.on("chainChanged", (chain) => {
      console.log("Chain Id", chain)
      accountDetails()
    })

  })


  async function accountDetails() {

    const Accounts = await ethereum.request({ method: "eth_requestAccounts" })
    const Balance = await ethereum.request({ method: "eth_getBalance", params: [Accounts[0], 'latest'] })

    await ethereum.request({ method: "eth_requestAccounts" })
      .then(acc => {
        console.log("connected Accounts", acc)
      })
      .catch(err => {
        console.log("Error occured")
      })

    setAddress(Accounts[0])
    console.log("Signer",signer.getAddress())
    setBalance(ethers.utils.formatEther(Balance))
  }


  async function addChain() {
    // await ethereum.request({
    //   method: "wallet_addEthereumChain",
    //   params: [{
    //     chainId:"0x4",
    //     chainName:"Rinkeby Testnet",
    //     nativeCurrency:{
    //       name:"RINKEBY",
    //       symbol:"ETH",
    //       decimals:18,
    //     },
    //     rpcUrls:["https://rpc.ankr.com/eth_rinkeby"],
    //     blockExplorerUrls:["https://rinkeby.etherscan.io/"],

    //   }]
    // })
  }

  async function switchChain(){
    await ethereum.request({method:'wallet_switchEthereumChain',params:[{
      chainId:"0xaa36a7"
    }]})
  }

  async function sendTransaction(target,ether){
      console.log("Target",target,"Value",ether)
      const transaction = {
        from:address,
        to:target.toString(),
        value:`0x${(parseInt(ethers.utils.parseEther(ether))).toString()}`
      }

      await ethereum.request({method:"eth_sendTransaction",params:[transaction]})
  }

  return (
    <div className="App">
      <center>
        <button onClick={accountDetails}>CONNECT METAMASK</button>
        <button onClick={addChain}>CHANGE NETWORK</button>
        <button onClick={switchChain}>SWITCH NETWORK</button>
       
        <h1>AccountAddress:{address}</h1>
        <h1>AccountBalance:{balance}</h1>
        <div><h1>To Address:</h1><input type="text" onChange = {(event)=>{setToAddress(event.target.value)}}></input></div>
        <div><h1>Value:</h1><input type="text" onChange = {(event)=>{setAmount(event.target.value)}}></input></div>
        <button onClick={()=>sendTransaction(toAddress,amount)}>SEND TRANSCATION</button>
      </center>

    </div>
  );
}

export default App;
