import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, AlertCircle, TrendingUp, DollarSign, 
  Clock, Shield, Zap, BarChart3, Target, Calendar, Database, 
  PieChart, FileText, BookOpen, Percent, Layers, ChevronDown, ChevronUp 
} from 'lucide-react';
import './ReconciliationCalculator.css';

export default function ReconciliationCalculator() {
  const [results, setResults] = useState(null);
  const [showStatementFields, setShowStatementFields] = useState(false);
  const [config, setConfig] = useState({
    // ledger data
    workingPeriod: 30, 
    totalRecordsLedgerCount: 5000,
    totalRecordsMatchedLedgerCount:3000,
    totalOutstandingLedgerCount: 250,
    totalLedgerMatchedValue: 4750000000,
    totalLedgerUnmatchedValue: 250000000,
    
    // Statement data (not very necessary)
    totalStatementCount: 0,
    totalStatementValue: 0
  });

  const calculateKPIs = () => {
    const {
      workingPeriod,
      totalRecordsLedgerCount,
      totalRecordsMatchedLedgerCount,
      totalOutstandingLedgerCount,
      totalLedgerMatchedValue,
      totalLedgerUnmatchedValue,
      totalStatementCount,
      totalStatementValue
    } = config;

    // calculations
    const totalLedgerValue = totalLedgerMatchedValue + totalLedgerUnmatchedValue;
    const matchedRecordsCount = totalRecordsLedgerCount - totalOutstandingLedgerCount;
    
    // FTIS KPIs
    const RAR = totalLedgerValue > 0 ? (totalLedgerMatchedValue / totalLedgerValue) * 100 : 0;
    const UVR = totalLedgerValue > 0 ? (totalLedgerUnmatchedValue / totalLedgerValue) * 100 : 0;
    const RVI = totalRecordsLedgerCount > 0 ? (matchedRecordsCount / totalRecordsLedgerCount) * 100 : 0;
    const AMER = totalRecordsLedgerCount > 0 ? (matchedRecordsCount / totalRecordsLedgerCount) * 100 : 0;
    
    // Statement completeness metrics
    let statementCoveragePercent = 0;
    let valueCoveragePercent = 0;
    let completenessScore = 0;
    let statementMetricsAvailable = false;
    
    if (totalStatementCount > 0 && totalStatementValue > 0) {
      statementMetricsAvailable = true;
      statementCoveragePercent = totalRecordsLedgerCount > 0 ? 
        (totalRecordsLedgerCount / totalStatementCount) * 100 : 0;
      valueCoveragePercent = totalStatementValue > 0 ? 
        (totalLedgerValue / totalStatementValue) * 100 : 0;
      
      // Calculate completeness score (50% count coverage, 50% value coverage)
      completenessScore = (statementCoveragePercent * 0.5) + (valueCoveragePercent * 0.5);
    }
    
    // FTIS Calculation (with optional completeness bonus)
    let FTIS = (RAR * 0.4) + (AMER * 0.3) + ((100 - UVR) * 0.2) + (RVI * 0.1);
    
    // If statement metrics available, add completeness component (10% weight)
    if (statementMetricsAvailable) {
      FTIS = (FTIS * 0.9) + (completenessScore * 0.1);
    }
    
    // estimated Financial metrics 
    const avgTransactionValue = totalLedgerValue / totalRecordsLedgerCount;
    const reconciliationCost = totalRecordsLedgerCount * 1500; // Estimated cost per transaction
    const monthlyTurnover = (totalLedgerValue / workingPeriod) * 30; // Extrapolate to monthly
    const FEI = monthlyTurnover > 0 ? (totalLedgerUnmatchedValue / monthlyTurnover) * 100 : 0;
    const CoRT = totalRecordsLedgerCount > 0 ? reconciliationCost / totalRecordsLedgerCount : 0;
    
    // ROI
    const potentialRecovery = totalLedgerUnmatchedValue * 0.7; // Assume 70% recoverable
    const annualRecovery = (potentialRecovery / workingPeriod) * 365;
    const staffSavings = reconciliationCost * 0.7;
    const totalAnnualBenefit = annualRecovery + staffSavings;
    const automationCost = 150000000;
    const ROI = automationCost > 0 ? ((totalAnnualBenefit - automationCost) / automationCost) * 100 : 0;

    return {
      RAR, UVR, RVI, AMER, FTIS,
      FEI, CoRT,
      totalRecordsLedgerCount,
      totalRecordsMatchedLedgerCount,
      totalOutstandingLedgerCount,
      matchedRecordsCount,
      totalLedgerValue,
      totalLedgerMatchedValue,
      totalLedgerUnmatchedValue,
      avgTransactionValue,
      reconciliationCost,
      monthlyTurnover,
      potentialRecovery,
      annualRecovery,
      staffSavings,
      totalAnnualBenefit,
      ROI,
      
      // statement side 
      totalStatementCount,
      totalStatementValue,
      statementCoveragePercent,
      valueCoveragePercent,
      completenessScore,
      statementMetricsAvailable
    };
  };

  const generateReport = () => {
    const kpis = calculateKPIs();
    setResults({ kpis });
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

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-NG').format(value);
  };

  return (
    <div className="recon-app">
      <div className="recon-container">
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <Shield className="header-icon" size={40} />
            <h1>Reconciliation Intelligence Dashboard</h1>
          </div>
          <p className="header-subtitle">
            Real-time KPI monitoring and Reconciliation Health check
          </p>
        </div>

        <div className="card config-panel">
          <h3 className="section-title">
            <Database size={20} />
            Reconciliation Software Data Input
          </h3>
          <p className="config-description">
            Input key reconciliation data metrics extracted from CLIREC to calculate real-time KPIs.
          </p>
          
          <div className="config-grid">
            <div className="input-group">
              <label>
                <Calendar size={16} />
                Working Period (Days)
              </label>
              <input
                type="number"
                value={config.workingPeriod}
                onChange={(e) => setConfig({...config, workingPeriod: parseFloat(e.target.value) || 0})}
                placeholder="e.g., 30"
              />
            </div>
            
            <div className="input-group">
              <label>
                <FileText size={16} />
                Total Records Ledger Count
              </label>
              <input
                type="number"
                value={config.totalRecordsLedgerCount}
                onChange={(e) => setConfig({...config, totalRecordsLedgerCount: parseFloat(e.target.value) || 0})}
                placeholder="Total processed records"
              />
            </div>
            
             <div className="input-group">
              <label>
                <FileText size={16} />
                Total Records Matched Ledger Count
              </label>
              <input
                type="number"
                value={config.totalRecordsMatchedLedgerCount}
                onChange={(e) => setConfig({...config, totalRecordsMatchedLedgerCount: parseFloat(e.target.value) || 0})}
                placeholder="Total processed ledger records"
              />
            </div>

            <div className="input-group">
              <label>
                <AlertCircle size={16} />
                Total Outstanding Ledger Count
              </label>
              <input
                type="number"
                value={config.totalOutstandingLedgerCount}
                onChange={(e) => setConfig({...config, totalOutstandingLedgerCount: parseFloat(e.target.value) || 0})}
                placeholder="Unmatched records"
              />
            </div>
            
            <div className="input-group">
              <label>
                <CheckCircle size={16} />
                Total Ledger Matched Value (₦)
              </label>
              <input
                type="number"
                value={config.totalLedgerMatchedValue}
                onChange={(e) => setConfig({...config, totalLedgerMatchedValue: parseFloat(e.target.value) || 0})}
                placeholder="Value of matched items"
              />
            </div>
            
            <div className="input-group">
              <label>
                <XCircle size={16} />
                Total Ledger Unmatched Value (₦)
              </label>
              <input
                type="number"
                value={config.totalLedgerUnmatchedValue}
                onChange={(e) => setConfig({...config, totalLedgerUnmatchedValue: parseFloat(e.target.value) || 0})}
                placeholder="Value of unmatched items"
              />
            </div>
          </div>
          <div className="statement-section">
            <button 
              className="statement-toggle"
              onClick={() => setShowStatementFields(!showStatementFields)}
            >
              <div className="toggle-header">
                <BookOpen size={18} />
                <span>Statement Coverage Metrics</span>
                {showStatementFields ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              <p className="toggle-description">
                Statement totals to calculate reconciliation completeness percentages
              </p>
            </button>
            
            {showStatementFields && (
              <div className="statement-grid">
                <div className="input-group">
                  <label>
                    <Layers size={16} />
                    Total Statement Count
                  </label>
                  <input
                    type="number"
                    value={config.totalStatementCount}
                    onChange={(e) => setConfig({...config, totalStatementCount: parseFloat(e.target.value) || 0})}
                    placeholder="Total items on bank statement"
                  />
                  <p className="input-hint">Leave as 0 if not available</p>
                </div>
                
                <div className="input-group">
                  <label>
                    <DollarSign size={16} />
                    Total Statement Value (₦)
                  </label>
                  <input
                    type="number"
                    value={config.totalStatementValue}
                    onChange={(e) => setConfig({...config, totalStatementValue: parseFloat(e.target.value) || 0})}
                    placeholder="Total value on bank statement"
                  />
                  <p className="input-hint">Leave as 0 if not available</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="config-summary">
            <div className="summary-item">
              <span className="summary-label">Total Ledger Value:</span>
              <span className="summary-value">
                {formatCurrency(config.totalLedgerMatchedValue + config.totalLedgerUnmatchedValue)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Matched Records:</span>
              <span className="summary-value">
                {formatNumber(config.totalRecordsLedgerCount - config.totalOutstandingLedgerCount)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Match Rate:</span>
              <span className="summary-value">
                {config.totalRecordsLedgerCount > 0 
                  ? (((config.totalRecordsLedgerCount - config.totalOutstandingLedgerCount) / config.totalRecordsLedgerCount) * 100).toFixed(1) + '%'
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
        <div className="button-container">
          <button
            onClick={generateReport}
            className="btn-primary"
          >
            <BarChart3 size={24} />
            Calculate Reconciliation KPIs
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
                  {results.kpis.statementMetricsAvailable 
                    ? 'Composite Score: RAR (40%) + AMER (30%) + (100-UVR) (20%) + RVI (10%) + Completeness (10%)'
                    : 'Composite Score: RAR (40%) + AMER (30%) + (100-UVR) (20%) + RVI (10%)'}
                </p>
              </div>
            </div>
            <div className="kpi-grid">
              <div className="kpi-card kpi-rar">
                <div className="kpi-header">
                  <h3>RAR</h3>
                  <CheckCircle size={20} />
                </div>
                <p className="kpi-value">{results.kpis.RAR.toFixed(2)}%</p>
                <p className="kpi-label">Reconciliation Accuracy Ratio</p>
                <p className="kpi-target">Target: &gt;98%</p>
                <div className="kpi-detail">
                  {formatCurrency(results.kpis.totalLedgerMatchedValue)} matched
                </div>
              </div>

              <div className="kpi-card kpi-uvr">
                <div className="kpi-header">
                  <h3>UVR</h3>
                  <AlertCircle size={20} />
                </div>
                <p className="kpi-value">{results.kpis.UVR.toFixed(2)}%</p>
                <p className="kpi-label">Unmatched Value Ratio</p>
                <p className="kpi-target">Target: &lt;1%</p>
                <div className="kpi-detail">
                  {formatCurrency(results.kpis.totalLedgerUnmatchedValue)} at risk
                </div>
              </div>

              <div className="kpi-card kpi-rvi">
                <div className="kpi-header">
                  <h3>RVI</h3>
                  <Zap size={20} />
                </div>
                <p className="kpi-value">{results.kpis.RVI.toFixed(2)}%</p>
                <p className="kpi-label">Reconciliation Velocity Index</p>
                <p className="kpi-target">Higher is better</p>
                <div className="kpi-detail">
                  {formatNumber(results.kpis.matchedRecordsCount)} records resolved
                </div>
              </div>

              <div className="kpi-card kpi-amer">
                <div className="kpi-header">
                  <h3>AMER</h3>
                  <TrendingUp size={20} />
                </div>
                <p className="kpi-value">{results.kpis.AMER.toFixed(2)}%</p>
                <p className="kpi-label">Automated Match Efficiency Rate</p>
                <p className="kpi-target">Automation maturity</p>
                <div className="kpi-detail">
                  {formatNumber(results.kpis.totalOutstandingLedgerCount)} outstanding
                </div>
              </div>
            </div>
            {results.kpis.statementMetricsAvailable && (
              <div className="card completeness-card">
                <h3 className="section-title">
                  <BookOpen size={20} />
                  Statement Coverage Analysis
                </h3>
                <div className="completeness-grid">
                  <div className="completeness-metric">
                    <div className="completeness-header">
                      <span className="completeness-label">Record Coverage</span>
                      <Percent size={16} />
                    </div>
                    <div className="completeness-value">
                      {results.kpis.statementCoveragePercent.toFixed(1)}%
                    </div>
                    <div className="completeness-detail">
                      {formatNumber(results.kpis.totalRecordsLedgerCount)} / {formatNumber(results.kpis.totalStatementCount)} records
                    </div>
                  </div>
                  
                  <div className="completeness-metric">
                    <div className="completeness-header">
                      <span className="completeness-label">Value Coverage</span>
                      <DollarSign size={16} />
                    </div>
                    <div className="completeness-value">
                      {results.kpis.valueCoveragePercent.toFixed(1)}%
                    </div>
                    <div className="completeness-detail">
                      {formatCurrency(results.kpis.totalLedgerValue)} / {formatCurrency(results.kpis.totalStatementValue)}
                    </div>
                  </div>
                  
                  <div className="completeness-metric">
                    <div className="completeness-header">
                      <span className="completeness-label">Overall Completeness</span>
                      <Shield size={16} />
                    </div>
                    <div className="completeness-value completeness-score">
                      {results.kpis.completenessScore.toFixed(1)}%
                    </div>
                    <div className="completeness-detail">
                      Weighted score (50% count, 50% value)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*Summary*/}
            <div className="card data-summary">
              <h3 className="section-title">
                <PieChart size={20} />
                Reconciliation Data Summary
              </h3>
              <div className="summary-grid">
                <div className="summary-card">
                  <h4>Volume Metrics</h4>
                  <div className="metric">
                    <span>Total Records Processed:</span>
                    <span className="metric-value">{formatNumber(results.kpis.totalRecordsLedgerCount)}</span>
                  </div>
                  <div className="metric">
                    <span>Matched Records:</span>
                    <span className="metric-value success">{formatNumber(results.kpis.matchedRecordsCount)}</span>
                  </div>
                  <div className="metric">
                    <span>Outstanding Records:</span>
                    <span className="metric-value warning">{formatNumber(results.kpis.totalOutstandingLedgerCount)}</span>
                  </div>
                </div>
                
                <div className="summary-card">
                  <h4>Value Metrics</h4>
                  <div className="metric">
                    <span>Total Value Processed:</span>
                    <span className="metric-value">{formatCurrency(results.kpis.totalLedgerValue)}</span>
                  </div>
                  <div className="metric">
                    <span>Matched Value:</span>
                    <span className="metric-value success">{formatCurrency(results.kpis.totalLedgerMatchedValue)}</span>
                  </div>
                  <div className="metric">
                    <span>Unmatched Value:</span>
                    <span className="metric-value danger">{formatCurrency(results.kpis.totalLedgerUnmatchedValue)}</span>
                  </div>
                </div>
                
                <div className="summary-card">
                  <h4>Efficiency Metrics</h4>
                  <div className="metric">
                    <span>Avg Transaction Value:</span>
                    <span className="metric-value">{formatCurrency(results.kpis.avgTransactionValue)}</span>
                  </div>
                  <div className="metric">
                    <span>Match Rate:</span>
                    <span className="metric-value">{results.kpis.AMER.toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Value Match Rate:</span>
                    <span className="metric-value">{results.kpis.RAR.toFixed(1)}%</span>
                  </div>
                </div>
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

            {/* Executive Summary */}
            <div className="card executive-summary">
              <h2>Executive Impact Summary</h2>
              <div className="summary-grid">
                <div>
                  <h3>Business Questions Answered:</h3>
                  <ul className="summary-list">
                    <li>✓ <strong>Audit Integrity:</strong> {results.kpis.RAR.toFixed(1)}% of value verified</li>
                    <li>✓ <strong>Cash Visibility:</strong> {formatCurrency(results.kpis.totalLedgerUnmatchedValue)} at risk</li>
                    <li>✓ <strong>Operational Speed:</strong> {results.kpis.RVI.toFixed(1)}% resolution rate</li>
                    <li>✓ <strong>Automation Maturity:</strong> {results.kpis.AMER.toFixed(1)}% auto-matched</li>
                    <li>✓ <strong>Data Trust:</strong> FTIS score of {results.kpis.FTIS.toFixed(1)}/100</li>
                    {results.kpis.statementMetricsAvailable && (
                      <li>✓ <strong>Coverage Completeness:</strong> {results.kpis.completenessScore.toFixed(1)}% of statement items analyzed</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3>Key Takeaway:</h3>
                  <div className="takeaway-box">
                    <p>
                      What OEE is to manufacturing, these Reconciliation KPIs are to financial health.
                      Reconciliation is now visible, measurable, and strategic -not just bookkeeping, but <strong>enterprise assurance</strong>."
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