
import './App.css';
import { useState,useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Signer Address",signer.getAddress())
  const { ethereum } = window
  const [address, setAddress] = useState("0x00..")
  const [balance,setBalance] = useState(0)
  //Using events on ethereum
  useEffect(()=>{
    ethereum.on("accountsChanged",(accounts)=>{
      setAddress(accounts[0])

      const getBalance = async() =>{
        const Balance = await ethereum.request({ method: "eth_getBalance" ,params:[accounts[0],'latest']})
        setBalance(ethers.utils.formatEther(Balance))

      }
      getBalance()
    })
    ethereum.on("chainChanged",(chain)=>{
      console.log("Chain Id",chain)
    })

  })
  async function accounts() {
    await ethereum.request({
      method: "wallet_requestPermissions",
      params: [{
        eth_accounts: {}
      }]
    })
    const Accounts = await ethereum.request({ method: "eth_requestAccounts" })
    const Balance = await ethereum.request({ method: "eth_getBalance" ,params:[Accounts[0],'latest']})
    await ethereum.request({method:"eth_requestAccounts"})
    .then(acc=>{
      console.log("connected Accounts",acc)
    })
    .catch(err=>{
      console.log("Error occured")
    })
    
    console.log(Accounts)
    setAddress(Accounts[0])
    console.log(signer.getAddress())
    setBalance(ethers.utils.formatEther(Balance))
  }


  return (
    <div className="App">
      <center>
        <button onClick={accounts}>CONNECT METAMASK</button>
        <h1>AccountAddress:{address}</h1>
        <h1>AccountBalance:{balance}</h1>
      </center>

    </div>
  );
}

export default App;
