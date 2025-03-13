import { useCallback, useState, useEffect } from "react";
import {
  AccountId,
  Hbar,
  TransactionId,
  TransferTransaction,
  TokenId,
} from "@hashgraph/sdk";
import { getConnectedAccountIds, hc, hcInitPromise, executeTransaction } from "../services/hashconnect";
import { DONATION_RECIPIENT_ID, DEFAULT_NODE_ID, USDC_TOKEN_ID } from "../constants";
import "./Donation.css";

const HashConnectClient = ({ onConnectionUpdate }) => {
  const syncWithHashConnect = useCallback(() => {
    const connectedAccountIds = getConnectedAccountIds();
    const isConnected = connectedAccountIds.length > 0;
    const accountIds = connectedAccountIds.map((o) => o.toString());
    onConnectionUpdate({ isConnected, accountIds });
  }, [onConnectionUpdate]);

  useEffect(() => {
    syncWithHashConnect();

    hcInitPromise.then(() => {
      syncWithHashConnect();
    });

    hc.pairingEvent.on(syncWithHashConnect);
    hc.disconnectionEvent.on(syncWithHashConnect);
    hc.connectionStatusChangeEvent.on(syncWithHashConnect);

    return () => {
      hc.pairingEvent.off(syncWithHashConnect);
      hc.disconnectionEvent.off(syncWithHashConnect);
      hc.connectionStatusChangeEvent.off(syncWithHashConnect);
    };
  }, [syncWithHashConnect]);

  return null;
};

function Donation() {
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('HBAR')
  const [isConnected, setIsConnected] = useState(false);
  const [accountIds, setAccountIds] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  const handleConnectionUpdate = useCallback(({ isConnected, accountIds }) => {
    setIsConnected(isConnected);
    setAccountIds(accountIds);
    if (isConnected && accountIds.length > 0) {
      setSelectedAccount(accountIds[0]);
    } else {
      setSelectedAccount('');
    }
  }, []);

  const handleDonate = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if (!selectedAccount) {
      alert('Please select an account');
      return;
    }

    const fromAccountId = AccountId.fromString(selectedAccount);
    const toAccountId = AccountId.fromString(DONATION_RECIPIENT_ID);
    const transferTransaction = new TransferTransaction()
      .setNodeAccountIds([AccountId.fromString(DEFAULT_NODE_ID)])
      .setTransactionId(TransactionId.generate(fromAccountId));

    if (selectedToken === 'HBAR') {
      transferTransaction
        .addHbarTransfer(fromAccountId, new Hbar(-amount))
        .addHbarTransfer(toAccountId, new Hbar(amount));
    } else if (selectedToken === 'USDC') {
      const tokenId = TokenId.fromString(USDC_TOKEN_ID);
      transferTransaction
        .addTokenTransfer(tokenId, fromAccountId, -amount)
        .addTokenTransfer(tokenId, toAccountId, amount);
    }

    const frozenTransaction = transferTransaction.freeze();
    try {
      const executeResult = await executeTransaction(fromAccountId, frozenTransaction);
      console.log({ executeResult });
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <div className="donation-widget">
      <h2>Support Us</h2>
      <div className="donation-form">
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            min="0"
            step="0.1"
          />
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
          >
            <option value="HBAR">HBAR</option>
            <option value="USDC">USDC</option>
          </select>
        </div>
        
        {isConnected && accountIds.length > 0 && (
          <div className="input-group">
            <label htmlFor="account-select">Select account to donate from:</label>
            <select
              id="account-select"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="account-select"
            >
              {accountIds.map((accountId) => (
                <option key={accountId} value={accountId}>
                  Account: {accountId}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <button className="connect-wallet" 
        onClick={async () => {
          if (isConnected) {
            console.log("come to isConnected?")
            await hcInitPromise;
            if (isConnected) {
              if (getConnectedAccountIds().length > 0) {
                hc.disconnect();
              }
            }
          } else {
            console.log("come to else?")
            // open walletconnect modal
            hc.openPairingModal();
          }
        }}>
          {isConnected
          ? `Disconnect Account${accountIds.length > 1 ? "s" : ""}`
          : "Connect"}
        </button>
        
        <button 
          className="donate-button" 
          onClick={handleDonate}
          disabled={!amount || !selectedAccount}
        >
          Donate
        </button>
      </div>
      <HashConnectClient onConnectionUpdate={handleConnectionUpdate} />
    </div>
  )
}

export default Donation 