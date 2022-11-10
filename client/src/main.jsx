import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {TransactionProvider} from "./context/TransactionContext";


//Inserir a aplicação dentro do TransacttionProvider
//ReactDOM.createRoot(document.getElementById('root')).render(
  ReactDOM.render(
  <TransactionProvider>

      <App />

  </TransactionProvider>
  ,
  document.getElementById("root")
  
);