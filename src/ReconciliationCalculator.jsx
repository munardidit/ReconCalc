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
    // Working period dates
    startDate: '',
    endDate: '',
    
    // Ledger counts
    totalRecordsLedgerCount: 5000,
    totalRecordsMatchedLedgerCount: 3000,
    totalOutstandingLedgerCount: 250,
    
    // Ledger values
    totalLedgerValue: 5000000000,
    totalLedgerMatchedValue: 4750000000,
    totalLedgerUnmatchedValue: 250000000,
    
    // Statement counts
    totalStatementCount: 5500,
    totalRecordsMatchedStatementCount: 3200,
    totalOutstandingStatementCount: 300,
    
    // Statement values
    totalStatementValue: 5200000000,
    totalStatementMatchedValue: 4900000000,
    totalStatementUnmatchedValue: 300000000,
    
    // SLA metrics for RVI
    itemsResolvedWithinSLA: 2800,
    totalExceptionsRaised: 3000
  });

  const calculateKPIs = () => {
    const {
      startDate,
      endDate,
      totalRecordsLedgerCount,
      totalRecordsMatchedLedgerCount,
      totalOutstandingLedgerCount,
      totalLedgerValue,
      totalLedgerMatchedValue,
      totalLedgerUnmatchedValue,
      totalStatementCount,
      totalRecordsMatchedStatementCount,
      totalOutstandingStatementCount,
      totalStatementValue,
      totalStatementMatchedValue,
      totalStatementUnmatchedValue,
      itemsResolvedWithinSLA,
      totalExceptionsRaised
    } = config;

    // Calculate working period from dates
    let workingPeriod = 30;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      workingPeriod = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    // Combined totals
    const totalRecordsCount = totalRecordsLedgerCount + totalStatementCount;
    const totalMatchedCount = totalRecordsMatchedLedgerCount + totalRecordsMatchedStatementCount;
    const totalValue = totalLedgerValue + totalStatementValue;
    const totalMatchedValue = totalLedgerMatchedValue + totalStatementMatchedValue;
    const totalUnmatchedValue = totalLedgerUnmatchedValue + totalStatementUnmatchedValue;
    
    // FTIS KPIs with new formulas
    const RAR = totalRecordsCount > 0 ? (totalMatchedCount / totalRecordsCount) * 100 : 0;
    const UVR = totalValue > 0 ? (totalUnmatchedValue / totalValue) * 100 : 0;
    const RVI = totalExceptionsRaised > 0 ? (itemsResolvedWithinSLA / totalExceptionsRaised) * 100 : 0;
    const AMER = totalRecordsLedgerCount > 0 ? (totalRecordsMatchedLedgerCount / totalRecordsLedgerCount) * 100 : 0;
    
    // FTIS Calculation
    const FTIS = (RAR * 0.4) + (AMER * 0.3) + ((100 - UVR) * 0.2) + (RVI * 0.1);
    
    // estimated Financial metrics 
    const avgTransactionValue = totalValue / totalRecordsCount;
    const reconciliationCost = totalRecordsCount * 1500; // Estimated cost per transaction
    const monthlyTurnover = (totalValue / workingPeriod) * 30; // Extrapolate to monthly
    const FEI = monthlyTurnover > 0 ? (totalUnmatchedValue / monthlyTurnover) * 100 : 0;
    const CoRT = totalRecordsCount > 0 ? reconciliationCost / totalRecordsCount : 0;
    
    // ROI
    const potentialRecovery = totalUnmatchedValue * 0.7; // Assume 70% recoverable
    const annualRecovery = (potentialRecovery / workingPeriod) * 365;
    const staffSavings = reconciliationCost * 0.7;
    const totalAnnualBenefit = annualRecovery + staffSavings;
    const automationCost = 150000000;
    const ROI = automationCost > 0 ? ((totalAnnualBenefit - automationCost) / automationCost) * 100 : 0;

    return {
      RAR, UVR, RVI, AMER, FTIS,
      FEI, CoRT,
      workingPeriod,
      totalRecordsCount,
      totalMatchedCount,
      totalRecordsLedgerCount,
      totalRecordsMatchedLedgerCount,
      totalOutstandingLedgerCount,
      totalStatementCount,
      totalRecordsMatchedStatementCount,
      totalOutstandingStatementCount,
      totalValue,
      totalMatchedValue,
      totalUnmatchedValue,
      totalLedgerValue,
      totalLedgerMatchedValue,
      totalLedgerUnmatchedValue,
      totalStatementValue,
      totalStatementMatchedValue,
      totalStatementUnmatchedValue,
      itemsResolvedWithinSLA,
      totalExceptionsRaised,
      avgTransactionValue,
      reconciliationCost,
      monthlyTurnover,
      potentialRecovery,
      annualRecovery,
      staffSavings,
      totalAnnualBenefit,
      ROI
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

  const formatInputNumber = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('en-NG').format(value);
  };

  const parseInputNumber = (value) => {
    if (!value) return 0;
    
    return parseFloat(value.toString().replace(/,/g, '')) || 0;
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
            Business Parameters
          </h3>
          <p className="config-description">
            Input key reconciliation data metrics extracted from your reconciliation system to calculate real-time KPIs.
          </p>
          
          {/* Working Period */}
          <div className="period-section">
            <h4 className="subsection-title">
              <Calendar size={18} />
              Working Period
            </h4>
            <div className="date-grid">
              <div className="input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig({...config, startDate: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig({...config, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Ledger & Statement Data */}
          <div className="data-section">
            <h4 className="subsection-title">
              <FileText size={18} />
              Reconciliation Data
            </h4>
            
            <div className="data-box">
              {/* Counts Section */}
              <div className="data-column">
                <h5 className="column-title">Counts</h5>
                
                <div className="data-group">
                  <p className="group-label">Ledger</p>
                  <div className="input-group">
                    <label>Total Records (Ledger)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalRecordsLedgerCount)}
                      onChange={(e) => setConfig({...config, totalRecordsLedgerCount: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 5,000"
                    />
                  </div>
                  <div className="input-group">
                    <label>Matched Records (Ledger)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalRecordsMatchedLedgerCount)}
                      onChange={(e) => setConfig({...config, totalRecordsMatchedLedgerCount: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 3,000"
                    />
                  </div>
                  <div className="input-group">
                    <label>Outstanding Records (Ledger)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalOutstandingLedgerCount)}
                      onChange={(e) => setConfig({...config, totalOutstandingLedgerCount: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 250"
                    />
                  </div>
                </div>

                <div className="data-group">
                  <p className="group-label">Statement</p>
                  <div className="input-group">
                    <label>Total Records (Statement)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalStatementCount)}
                      onChange={(e) => setConfig({...config, totalStatementCount: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 5,500"
                    />
                  </div>
                  <div className="input-group">
                    <label>Matched Records (Statement)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalRecordsMatchedStatementCount)}
                      onChange={(e) => setConfig({...config, totalRecordsMatchedStatementCount: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 3,200"
                    />
                  </div>
                  <div className="input-group">
                    <label>Outstanding Records (Statement)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalOutstandingStatementCount)}
                      onChange={(e) => setConfig({...config, totalOutstandingStatementCount: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 300"
                    />
                  </div>
                </div>
              </div>

              {/* Values Section */}
              <div className="data-column">
                <h5 className="column-title">Values (₦)</h5>
                
                <div className="data-group">
                  <p className="group-label">Ledger</p>
                  <div className="input-group">
                    <label>Total Value (Ledger)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalLedgerValue)}
                      onChange={(e) => setConfig({...config, totalLedgerValue: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 5,000,000,000"
                    />
                  </div>
                  <div className="input-group">
                    <label>Matched Value (Ledger)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalLedgerMatchedValue)}
                      onChange={(e) => setConfig({...config, totalLedgerMatchedValue: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 4,750,000,000"
                    />
                  </div>
                  <div className="input-group">
                    <label>Unmatched Value (Ledger)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalLedgerUnmatchedValue)}
                      onChange={(e) => setConfig({...config, totalLedgerUnmatchedValue: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 250,000,000"
                    />
                  </div>
                </div>

                <div className="data-group">
                  <p className="group-label">Statement</p>
                  <div className="input-group">
                    <label>Total Value (Statement)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalStatementValue)}
                      onChange={(e) => setConfig({...config, totalStatementValue: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 5,200,000,000"
                    />
                  </div>
                  <div className="input-group">
                    <label>Matched Value (Statement)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalStatementMatchedValue)}
                      onChange={(e) => setConfig({...config, totalStatementMatchedValue: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 4,900,000,000"
                    />
                  </div>
                  <div className="input-group">
                    <label>Unmatched Value (Statement)</label>
                    <input
                      type="text"
                      value={formatInputNumber(config.totalStatementUnmatchedValue)}
                      onChange={(e) => setConfig({...config, totalStatementUnmatchedValue: parseInputNumber(e.target.value)})}
                      placeholder="e.g., 300,000,000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLA Metrics for RVI */}
          <div className="sla-section">
            <h4 className="subsection-title">
              <Clock size={18} />
              SLA Performance Metrics
            </h4>
            <div className="sla-grid">
              <div className="input-group">
                <label>Items Resolved Within SLA</label>
                <input
                  type="text"
                  value={formatInputNumber(config.itemsResolvedWithinSLA)}
                  onChange={(e) => setConfig({...config, itemsResolvedWithinSLA: parseInputNumber(e.target.value)})}
                  placeholder="e.g., 2,800"
                />
              </div>
              <div className="input-group">
                <label>Total Exceptions Raised</label>
                <input
                  type="text"
                  value={formatInputNumber(config.totalExceptionsRaised)}
                  onChange={(e) => setConfig({...config, totalExceptionsRaised: parseInputNumber(e.target.value)})}
                  placeholder="e.g., 3,000"
                />
              </div>
            </div>
          </div>

          <div className="config-summary">
            <div className="summary-item">
              <span className="summary-label">Working Period:</span>
              <span className="summary-value">
                {config.startDate && config.endDate 
                  ? `${Math.ceil((new Date(config.endDate) - new Date(config.startDate)) / (1000 * 60 * 60 * 24))} days`
                  : '30 days (default)'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Combined Records:</span>
              <span className="summary-value">
                {formatNumber(config.totalRecordsLedgerCount + config.totalStatementCount)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Combined Value:</span>
              <span className="summary-value">
                {formatCurrency(config.totalLedgerValue + config.totalStatementValue)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Overall Match Rate:</span>
              <span className="summary-value">
                {(config.totalRecordsLedgerCount + config.totalStatementCount) > 0 
                  ? (((config.totalRecordsMatchedLedgerCount + config.totalRecordsMatchedStatementCount) / (config.totalRecordsLedgerCount + config.totalStatementCount)) * 100).toFixed(1) + '%'
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
                  Composite Score: RAR (40%) + AMER (30%) + (100-UVR) (20%) + RVI (10%)
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
                  {formatNumber(results.kpis.totalMatchedCount)} / {formatNumber(results.kpis.totalRecordsCount)} matched
                </div>
                <div className="kpi-formula">
                  Formula: (Ledger + Statement Matched) / (Ledger + Statement Total) × 100
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
                  {formatCurrency(results.kpis.totalUnmatchedValue)} at risk
                </div>
                <div className="kpi-formula">
                  Formula: Total Unmatched Value / Total Value × 100
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
                  {formatNumber(results.kpis.itemsResolvedWithinSLA)} / {formatNumber(results.kpis.totalExceptionsRaised)} within SLA
                </div>
                <div className="kpi-formula">
                  Formula: Items Resolved Within SLA / Total Exceptions Raised × 100
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
                  {formatNumber(results.kpis.totalOutstandingLedgerCount)} ledger outstanding
                </div>
                <div className="kpi-formula">
                  Formula: Ledger Matched / Total Ledger Records × 100
                </div>
              </div>
            </div>

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
                    <span>Total Combined Records:</span>
                    <span className="metric-value">{formatNumber(results.kpis.totalRecordsCount)}</span>
                  </div>
                  <div className="metric">
                    <span>Total Matched Records:</span>
                    <span className="metric-value success">{formatNumber(results.kpis.totalMatchedCount)}</span>
                  </div>
                  <div className="metric">
                    <span>Ledger Records:</span>
                    <span className="metric-value">{formatNumber(results.kpis.totalRecordsLedgerCount)}</span>
                  </div>
                  <div className="metric">
                    <span>Statement Records:</span>
                    <span className="metric-value">{formatNumber(results.kpis.totalStatementCount)}</span>
                  </div>
                </div>
                
                <div className="summary-card">
                  <h4>Value Metrics</h4>
                  <div className="metric">
                    <span>Total Combined Value:</span>
                    <span className="metric-value">{formatCurrency(results.kpis.totalValue)}</span>
                  </div>
                  <div className="metric">
                    <span>Total Matched Value:</span>
                    <span className="metric-value success">{formatCurrency(results.kpis.totalMatchedValue)}</span>
                  </div>
                  <div className="metric">
                    <span>Total Unmatched Value:</span>
                    <span className="metric-value danger">{formatCurrency(results.kpis.totalUnmatchedValue)}</span>
                  </div>
                </div>
                
                <div className="summary-card">
                  <h4>Performance Metrics</h4>
                  <div className="metric">
                    <span>Working Period:</span>
                    <span className="metric-value">{results.kpis.workingPeriod} days</span>
                  </div>
                  <div className="metric">
                    <span>SLA Compliance Rate:</span>
                    <span className="metric-value">{results.kpis.RVI.toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Overall Match Rate:</span>
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
                    <li>✓ <strong>Audit Integrity:</strong> {results.kpis.RAR.toFixed(1)}% of records verified</li>
                    <li>✓ <strong>Cash Visibility:</strong> {formatCurrency(results.kpis.totalUnmatchedValue)} at risk</li>
                    <li>✓ <strong>SLA Performance:</strong> {results.kpis.RVI.toFixed(1)}% resolved within SLA</li>
                    <li>✓ <strong>Automation Maturity:</strong> {results.kpis.AMER.toFixed(1)}% ledger auto-matched</li>
                    <li>✓ <strong>Data Trust:</strong> FTIS score of {results.kpis.FTIS.toFixed(1)}/100</li>
                    <li>✓ <strong>Reconciliation Scope:</strong> {formatNumber(results.kpis.totalRecordsCount)} combined records analyzed</li>
                  </ul>
                </div>
                <div>
                  <h3>Key Takeaway:</h3>
                  <div className="takeaway-box">
                    <p>
                      What OEE is to manufacturing, these Reconciliation KPIs are to financial health.
                      Reconciliation is now visible, measurable, and strategic - not just bookkeeping, but <strong>enterprise assurance</strong>.
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