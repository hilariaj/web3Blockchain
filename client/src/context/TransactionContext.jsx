import React, {useEffect, useState} from "react";
import { ethers } from "ethers";

import { constractAbi, contractAdress } from "../utils/constants";

export const TransactionContext = React.createContext();

//Access Metamask
const {ethereum} = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    //Information to pass: contractAdress, constractAbi, signer
    const transactionContract = new ethers.Contract(contractAdress, constractAbi, signer);

    return transactionContract;

}

export const TransactionProvider = ({children}) =>{

    const[currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);


    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    //nOVO
    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const transactionsContract = createEthereumContract();
    
            const availableTransactions = await transactionsContract.getAllTransactions();
    
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
    
            console.log(structuredTransactions);
    
            setTransactions(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };


    //To verify that the wallet has been connected
    const checkIfWalletIsConnected = async ()=>{
        try {
            if(!ethereum)return alert("Please install Metamask");

            const accounts = await ethereum.request({method: "eth_accounts"});
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
    
                getAllTransactions();
                
            }else {
                console.log("No accounts found");
            }
            
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
            
        }

    }


    //nOVO 
    const checkIfTransactionsExists = async () => {
        try {
          if (ethereum) {
            const transactionsContract = createEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
    
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };


    const sendTransaction = async () => {
        try {
            if(!ethereum)return alert("Please install metamask");
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                  from: currentAccount,
                  to: addressTo,
                  gas: "0x5208", // 21000 GWEI
                  value: parsedAmount._hex,
                }],
            });

            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log('Loading - ${transactionHash.hash}');
            await transactionHash.wait();

            console.log('Success - ${transactionHash.hash}');
            setIsLoading(false);

            const transactionsCount = await transactionsContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());


        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");

        }
    }

    //To call the checkIfWalletIsConnected function
    useEffect(()=>{
        checkIfWalletIsConnected();
        //nOVO
        checkIfWalletIsConnected();
        
    }, []);


    const connectWallet = async ()=>{
        try {
            if (!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({method: "eth_requestAccounts"});

            setCurrentAccount(accounts[0]);

        } catch (error) {

            console.log(error);
            throw new Error("No ethereum object"); //When you cannot access ethereum
        }
    }

    return (
       <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    );
};
