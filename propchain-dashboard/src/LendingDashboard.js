import React, { useState, useEffect } from 'react';
import { logInfo, formatBalance } from './utils';

export default function LendingDashboard({ connectedAccounts = [] }) {
  // Fallback gracefully if no accounts are available, default to the primary address index
  const [selectedAccount, setSelectedAccount] = useState(connectedAccounts[0] || '');
  const [accountData, setAccountData] = useState({ balance: 0, stake: 0, activeEscrows: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedAccount) return;
    
    setLoading(true);
    // Simulate or query database analytics filtering elements by explicit account parameters
    fetch(`/api/lending/metrics?account=${selectedAccount}`)
      .then((res) => res.json())
      .then((data) => {
        setAccountData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to resolve metrics telemetry context:", err);
        setLoading(false);
      });
  }, [selectedAccount]);

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-sky-400">📊 Lending & Asset Allocation Profile</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time balance, stake metrics, and escrow monitors</p>
        </div>
        
        {/* Wallet Multi-Account Selector Switch */}
        <div className="flex items-center space-x-2">
          <label htmlFor="account-selector" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Wallet:</label>
          <select 
            id="account-selector"
            className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm font-mono text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {connectedAccounts.map((acc) => (
              <option key={acc} value={acc}>
                {acc.slice(0, 6)}...{acc.slice(-4)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 font-mono text-sm animate-pulse">Syncing on-chain snapshot...</div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/60">
              <span className="text-xs uppercase font-medium tracking-wider text-slate-400 block mb-1">Available Floating Capital</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{formatBalance(accountData.balance)} PROP</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/60">
              <span className="text-xs uppercase font-medium tracking-wider text-slate-400 block mb-1">Active Lock Staking Allotment</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{formatBalance(accountData.stake)} PROP</span>
            </div>
          </div>

          {/* Escrow Block Component Track */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300 mb-3">Isolated Escrow Holds ({accountData.activeEscrows.length})</h3>
            {accountData.activeEscrows.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 bg-slate-950 rounded text-center border border-slate-800">No active escrow records assigned to this address.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 bg-slate-950 rounded border border-slate-800">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                      <th className="p-3 font-semibold">Escrow ID</th>
                      <th className="p-3 font-semibold">Counterparty Address</th>
                      <th className="p-3 font-semibold text-right">Locked Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {accountData.activeEscrows.map((escrow) => (
                      <tr key={escrow.id} className="hover:bg-slate-900/40">
                        <td className="p-3 text-sky-400">#{escrow.id}</td>
                        <td className="p-3 text-slate-400">{escrow.counterparty.slice(0, 12)}...</td>
                        <td className="p-3 text-right text-emerald-400 font-bold">{formatBalance(escrow.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}