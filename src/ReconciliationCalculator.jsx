import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, DollarSign, Clock, Shield, Zap, BarChart3, Target } from 'lucide-react';
import './ReconciliationCalculator.css';

export default function ReconciliationCalculator() {
  const [datasetA, setDatasetA] = useState('');
  const [datasetB, setDatasetB] = useState('');
  const [results, setResults] = useState(null);
  const [config, setConfig] = useState({
    monthlyTurnover: 10000000000,
    reconciliationCost: 30000000,
    avgResolutionDays: 5,
    staffCount: 8
  });

  const parseData = (text) => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split(/[,\t]/);
        return {
          id: parts[0]?.trim() || '',
          amount: parseFloat(parts[1]?.trim().replace(/[^\d.-]/g, '')) || 0,
          raw: line
        };
      })
      .filter(item => item.id);
  };

  const calculateKPIs = (matched, onlyInA, onlyInB, discrepancies) => {
    const totalTransactions = matched.length + onlyInA.length + onlyInB.length + discrepancies.length;
    const totalValueA = [...matched, ...onlyInA, ...discrepancies].reduce((sum, item) => 
      sum + (item.amount || item.amountA || 0), 0);
    const totalValueB = [...matched, ...onlyInB, ...discrepancies].reduce((sum, item) => 
      sum + (item.amount || item.amountB || 0), 0);
    const matchedValue = matched.reduce((sum, item) => sum + item.amount, 0);
    const unmatchedValue = [...onlyInA, ...onlyInB].reduce((sum, item) => sum + item.amount, 0) +
      discrepancies.reduce((sum, item) => sum + Math.abs(item.difference), 0);

    const RAR = totalValueA > 0 ? (matchedValue / totalValueA) * 100 : 0;
    const UVR = totalValueA > 0 ? (unmatchedValue / totalValueA) * 100 : 0;
    const RVI = totalTransactions > 0 ? (matched.length / totalTransactions) * 100 : 0;
    const RCR = totalTransactions > 0 ? (matched.length / totalTransactions) * 100 : 0;
    const FEI = config.monthlyTurnover > 0 ? (unmatchedValue / config.monthlyTurnover) * 100 : 0;
    const AMER = totalTransactions > 0 ? (matched.length / totalTransactions) * 100 : 0;
    const CoRT = totalTransactions > 0 ? config.reconciliationCost / totalTransactions : 0;
    const FTIS = (RAR * 0.4) + (AMER * 0.3) + ((100 - UVR) * 0.2) + (RVI * 0.1);

    const potentialRecovery = unmatchedValue;
    const annualRecovery = potentialRecovery * 12;
    const staffSavings = config.reconciliationCost * 0.7;
    const totalAnnualBenefit = annualRecovery + staffSavings;
    const automationCost = 150000000;
    const ROI = automationCost > 0 ? ((totalAnnualBenefit - automationCost) / automationCost) * 100 : 0;

    return {
      RAR, UVR, RVI, RCR, FEI, AMER, CoRT, FTIS,
      totalTransactions, totalValueA, totalValueB,
      matchedValue, unmatchedValue, potentialRecovery,
      annualRecovery, staffSavings, totalAnnualBenefit, ROI
    };
  };

  const reconcile = () => {
    const setA = parseData(datasetA);
    const setB = parseData(datasetB);

    const mapA = new Map(setA.map(item => [item.id, item]));
    const mapB = new Map(setB.map(item => [item.id, item]));

    const matched = [];
    const onlyInA = [];
    const onlyInB = [];
    const discrepancies = [];

    setA.forEach(itemA => {
      if (mapB.has(itemA.id)) {
        const itemB = mapB.get(itemA.id);
        if (Math.abs(itemA.amount - itemB.amount) < 0.01) {
          matched.push({ ...itemA, match: itemB });
        } else {
          discrepancies.push({ 
            id: itemA.id, 
            amountA: itemA.amount, 
            amountB: itemB.amount,
            difference: itemA.amount - itemB.amount
          });
        }
      } else {
        onlyInA.push(itemA);
      }
    });

    setB.forEach(itemB => {
      if (!mapA.has(itemB.id)) {
        onlyInB.push(itemB);
      }
    });

    const kpis = calculateKPIs(matched, onlyInA, onlyInB, discrepancies);

    setResults({
      matched,
      onlyInA,
      onlyInB,
      discrepancies,
      kpis
    });
  };

  const getHealthClass = (score) => {
    if (score >= 95) return 'health-excellent';
    if (score >= 85) return 'health-good';
    return 'health-critical';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="recon-app">
      <div className="recon-container">
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <Shield className="header-icon" size={40} />
            <h1>Reconciliation Intelligence</h1>
          </div>
          <p className="header-subtitle">
            Strategic KPI Dashboard: Transform reconciliation from bookkeeping to enterprise assurance
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="card config-panel">
          <h3 className="section-title">
            <Target size={20} />
            Business Parameters
          </h3>
          <div className="config-grid">
            <div className="input-group">
              <label>Monthly Turnover (₦)</label>
              <input
                type="number"
                value={config.monthlyTurnover}
                onChange={(e) => setConfig({...config, monthlyTurnover: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="input-group">
              <label>Monthly Recon Cost (₦)</label>
              <input
                type="number"
                value={config.reconciliationCost}
                onChange={(e) => setConfig({...config, reconciliationCost: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="input-group">
              <label>Avg Resolution Days</label>
              <input
                type="number"
                value={config.avgResolutionDays}
                onChange={(e) => setConfig({...config, avgResolutionDays: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="input-group">
              <label>Recon Staff (FTEs)</label>
              <input
                type="number"
                value={config.staffCount}
                onChange={(e) => setConfig({...config, staffCount: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
        </div>

        {/* Data Input */}
        <div className="data-input-grid">
          <div className="card">
            <h2 className="card-title">Dataset A (Source System)</h2>
            <textarea
              value={datasetA}
              onChange={(e) => setDatasetA(e.target.value)}
              placeholder="Format: ID, Amount&#10;INV001, 150000&#10;INV002, 275500&#10;INV003, 89999"
            />
          </div>

          <div className="card">
            <h2 className="card-title">Dataset B (Bank/ERP)</h2>
            <textarea
              value={datasetB}
              onChange={(e) => setDatasetB(e.target.value)}
              placeholder="Format: ID, Amount&#10;INV001, 150000&#10;INV002, 280000&#10;INV004, 120000"
            />
          </div>
        </div>

        <div className="button-container">
          <button
            onClick={reconcile}
            disabled={!datasetA || !datasetB}
            className="btn-primary"
          >
            <BarChart3 size={24} />
            Generate Reconciliation Intelligence Report
          </button>
        </div>

        {results && results.kpis && (
          <div className="results-container">
            {/* FTIS Score */}
            <div className={`ftis-card ${getHealthClass(results.kpis.FTIS)}`}>
              <div className="ftis-content">
                <div className="ftis-header">
                  <Shield size={32} />
                  <h2>Financial Truth Integrity Score (FTIS)</h2>
                </div>
                <div className="ftis-score">
                  {results.kpis.FTIS.toFixed(1)}
                </div>
                <p className="ftis-status">
                  {results.kpis.FTIS >= 95 ? '✓ Excellent - Data Truth Assurance Achieved' :
                   results.kpis.FTIS >= 85 ? '⚠ Good - Minor Improvements Needed' :
                   '✗ Critical - Immediate Action Required'}
                </p>
                <p className="ftis-formula">
                  Composite Score: RAR (40%) + AMER (30%) + (100-UVR) (20%) + RVI (10%)
                </p>
              </div>
            </div>

            {/* Core KPI Dashboard */}
            <div className="kpi-grid">
              <div className="kpi-card kpi-rar">
                <div className="kpi-header">
                  <h3>RAR</h3>
                  <CheckCircle size={20} />
                </div>
                <p className="kpi-value">{results.kpis.RAR.toFixed(2)}%</p>
                <p className="kpi-label">Reconciliation Accuracy</p>
                <p className="kpi-target">Target: &gt;98%</p>
              </div>

              <div className="kpi-card kpi-uvr">
                <div className="kpi-header">
                  <h3>UVR</h3>
                  <AlertCircle size={20} />
                </div>
                <p className="kpi-value">{results.kpis.UVR.toFixed(2)}%</p>
                <p className="kpi-label">Unmatched Value Ratio</p>
                <p className="kpi-target">Target: &lt;1%</p>
              </div>

              <div className="kpi-card kpi-rvi">
                <div className="kpi-header">
                  <h3>RVI</h3>
                  <Zap size={20} />
                </div>
                <p className="kpi-value">{results.kpis.RVI.toFixed(2)}%</p>
                <p className="kpi-label">Resolution Velocity</p>
                <p className="kpi-target">Higher is better</p>
              </div>

              <div className="kpi-card kpi-amer">
                <div className="kpi-header">
                  <h3>AMER</h3>
                  <TrendingUp size={20} />
                </div>
                <p className="kpi-value">{results.kpis.AMER.toFixed(2)}%</p>
                <p className="kpi-label">Auto-Match Efficiency</p>
                <p className="kpi-target">Automation maturity</p>
              </div>
            </div>

            {/* Financial Impact */}
            <div className="impact-grid">
              <div className="card impact-card">
                <div className="impact-header">
                  <DollarSign size={24} />
                  <h3>Unmatched Value</h3>
                </div>
                <p className="impact-value impact-warning">
                  {formatCurrency(results.kpis.unmatchedValue)}
                </p>
                <p className="impact-label">Cash trapped in suspense</p>
              </div>

              <div className="card impact-card">
                <div className="impact-header">
                  <Shield size={24} />
                  <h3>FEI</h3>
                </div>
                <p className="impact-value impact-danger">
                  {results.kpis.FEI.toFixed(3)}%
                </p>
                <p className="impact-label">Financial Exposure Index</p>
              </div>

              <div className="card impact-card">
                <div className="impact-header">
                  <Clock size={24} />
                  <h3>CoRT</h3>
                </div>
                <p className="impact-value impact-info">
                  {formatCurrency(results.kpis.CoRT)}
                </p>
                <p className="impact-label">Cost per Transaction</p>
              </div>
            </div>

            {/* ROI Framework */}
            <div className="roi-card">
              <h2 className="roi-title">
                <TrendingUp size={28} />
                ROI Framework: Automation Business Case
              </h2>
              
              <div className="roi-grid">
                <div className="roi-section">
                  <h3>Annual Benefits</h3>
                  <div className="roi-items">
                    <div className="roi-item">
                      <span>Cash Recovery (12 months)</span>
                      <span className="roi-amount">{formatCurrency(results.kpis.annualRecovery)}</span>
                    </div>
                    <div className="roi-item">
                      <span>Staff Cost Savings (70%)</span>
                      <span className="roi-amount">{formatCurrency(results.kpis.staffSavings)}</span>
                    </div>
                    <div className="roi-item roi-total">
                      <span>Total Annual Benefit</span>
                      <span className="roi-amount">{formatCurrency(results.kpis.totalAnnualBenefit)}</span>
                    </div>
                  </div>
                </div>

                <div className="roi-section">
                  <h3>Investment & Return</h3>
                  <div className="roi-items">
                    <div className="roi-item">
                      <span>Automation Cost (Est.)</span>
                      <span>{formatCurrency(150000000)}</span>
                    </div>
                    <div className="roi-item">
                      <span>Net Annual Benefit</span>
                      <span className="roi-amount">{formatCurrency(results.kpis.totalAnnualBenefit - 150000000)}</span>
                    </div>
                    <div className="roi-item roi-total">
                      <span>ROI</span>
                      <span className="roi-percentage">{results.kpis.ROI.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="roi-summary">
                <p className="roi-summary-title">Executive Summary:</p>
                <p className="roi-summary-text">
                  For every ₦1 invested in reconciliation automation, you recover <strong>₦{(results.kpis.ROI / 100 + 1).toFixed(1)}</strong> in financial assurance, speed, and risk prevention.
                </p>
              </div>
            </div>

            {/* Discrepancies Table */}
            {results.discrepancies.length > 0 && (
              <div className="card discrepancies-card">
                <h3 className="section-title">
                  <AlertCircle />
                  Amount Discrepancies ({results.discrepancies.length})
                </h3>
                <div className="table-container">
                  <table className="discrepancies-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Dataset A</th>
                        <th>Dataset B</th>
                        <th>Variance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.discrepancies.slice(0, 10).map((item, idx) => (
                        <tr key={idx}>
                          <td className="mono">{item.id}</td>
                          <td className="text-right">{formatCurrency(item.amountA)}</td>
                          <td className="text-right">{formatCurrency(item.amountB)}</td>
                          <td className="text-right variance">{formatCurrency(Math.abs(item.difference))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {results.discrepancies.length > 10 && (
                    <p className="table-note">
                      Showing 10 of {results.discrepancies.length} discrepancies
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Executive Summary */}
            <div className="card executive-summary">
              <h2>Executive Impact Summary</h2>
              <div className="summary-grid">
                <div>
                  <h3>Business Questions Answered:</h3>
                  <ul className="summary-list">
                    <li>✓ <strong>Audit Integrity:</strong> {results.kpis.RAR.toFixed(1)}% of transactions verified</li>
                    <li>✓ <strong>Cash Visibility:</strong> {formatCurrency(results.kpis.unmatchedValue)} unverified</li>
                    <li>✓ <strong>Operational Speed:</strong> {results.kpis.RVI.toFixed(1)}% resolution rate</li>
                    <li>✓ <strong>Automation Maturity:</strong> {results.kpis.AMER.toFixed(1)}% auto-matched</li>
                    <li>✓ <strong>Data Trust:</strong> FTIS score of {results.kpis.FTIS.toFixed(1)}/100</li>
                  </ul>
                </div>
                <div>
                  <h3>Key Takeaway:</h3>
                  <div className="takeaway-box">
                    <p>
                      "What OEE is to manufacturing, these Reconciliation KPIs are to financial health. 
                      Reconciliation is now visible, measurable, and strategic — not just bookkeeping, 
                      but <strong>enterprise assurance</strong>."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}