import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import '../App.css'
import AddPaymentDrawer from "../components/AddPayment";
import { fetchPayments, fetchPaymentDetails, exportPaymentsCsv } from "../lib/api";

const PaymentPage = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // details drawer state
  const [details, setDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Fetch payments on component mount
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const payments = await fetchPayments();
      console.log("Fetched payments:", payments);
      
      // Transform API data to table format
      const formattedData = Array.isArray(payments) 
        ? payments.map((payment: any, index: number) => ({
            id: index + 1,
            _id: payment._id,
            type: payment.application || "Unknown",
            code: payment.invoiceNumber || null,
            users: payment.users || [],
            file: "document_file_name.pdf",
            label: payment.description || payment.application,
          }))
        : [];
      
      setTableData(formattedData);
    } catch (err: any) {
      setError(err.message || "Failed to load payments");
      console.error("Error loading payments:", err);
    } finally {
      setLoading(false);
    }
  };


  const toggleSelectAll = () => {
    if (selectedRows.length === tableData.length) setSelectedRows([]);
    else setSelectedRows(tableData.map(r => r.id));
  };

  const toggleRow = (id: number) => {
    if (selectedRows.includes(id)) setSelectedRows(selectedRows.filter(item => item !== id));
    else setSelectedRows([...selectedRows, id]);
  };

  const openDetails = async (paymentId: string) => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const detailData = await fetchPaymentDetails(paymentId);
      setDetails(detailData);
      setIsDrawerOpen(true);
    } catch (err: any) {
      setDetailsError(err.message || "Failed to load details");
      console.error("detail fetch error", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportPaymentsCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payments.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Export failed', err);
      setError(err.message || 'Export failed');
    }
  };

  return (
    <div className="payment-page">
      <div className="page-header-actions">
        <h1 className="page-title">Payment</h1>
        <div className="header-buttons">
          <button className="btn-secondary" onClick={handleExport}><Icon icon="lucide:upload" /> <span className="hide-mobile">Export CSV</span></button>
          <button className="btn-primary" onClick={() => setIsAddDrawerOpen(true)}>
            <Icon icon="lucide:plus" /> <span>Add Payment</span>
          </button>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-input-wrapper">
          <Icon icon="lucide:search" className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
        <button className="filter-btn"><Icon icon="lucide:filter" /> Filter By</button>
        <button className="filter-btn_edit"><Icon icon="lucide:layout-panel-left" /> Edit Columns</button>
      </div>

      <div className="transaction-tabs">
        <div className="tab active">Transaction <span className="tab-count">{tableData.length}</span></div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-spinner">Loading payments...</div>}

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr className="header-labels">
              <th><input type="checkbox" onChange={toggleSelectAll} checked={selectedRows.length === tableData.length} /></th>
              <th>Application <Icon icon="lucide:chevrons-up-down" className="sort-icon" /></th>
              <th>Invoices <Icon icon="lucide:chevrons-up-down" className="sort-icon" /></th>
              <th>Receipts <Icon icon="lucide:chevrons-up-down" className="sort-icon" /></th>
              <th>Transactions <Icon icon="lucide:chevrons-up-down" className="sort-icon" /></th>
              <th>User <Icon icon="lucide:chevrons-up-down" className="sort-icon" /></th>
              <th>Invoice File</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.id}
                className={selectedRows.includes(row.id) ? "selected-row" : ""}
                onClick={() => row._id && openDetails(row._id)}
              >
                <td><input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => toggleRow(row.id)} /></td>
                <td>
                  <div className="cell-with-icon">
                    <Icon icon="logos:slack-icon" /> {row.type}
                  </div>
                </td>
                {[1, 2, 3].map(i => (
                  <td key={i}>
                    {row.code ? <span className="badge-blue">{row.code} <small>2+</small></span> : <Icon icon="lucide:plus-circle" className="add-icon-btn" />}
                  </td>
                ))}
                <td>
                  <div className="avatar-group" onClick={(e) => { e.stopPropagation(); row._id && openDetails(row._id); }} style={{ cursor: 'pointer' }}>
                    {row.users.map((u: string, i: number) => (
                      <span key={i} className={`avatar avatar-color-${i % 5}`}>{u}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="file-pill">
                    <Icon icon="lucide:file-text" /> {row.file}
                  </div>
                </td>
                <td className="label-text">{row.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}></div>

      <div className={`drawer-panel ${isDrawerOpen ? 'open' : ''}`}>

        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-area">
            <button className="back-btn" onClick={() => setIsDrawerOpen(false)}>
              <Icon icon="lucide:arrow-left" />
            </button>
            <h2 className="drawer-title">Payments</h2>
          </div>
          <button className="edit-details-btn">
            <Icon icon="lucide:pencil" /> Edit Details
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="drawer-content">
          {detailsLoading && <div className="loading-spinner">Loading details...</div>}
          {detailsError && <div className="error-banner">{detailsError}</div>}

          {details && !detailsLoading && (
            <>
              <div className="drawer-app-title">
                <Icon icon="logos:slack-icon" className="app-icon" />
                <h3>{details.application}</h3>
              </div>

              <div className="details-list">
                <div className="detail-row">
                  <span className="d-label">Transaction Date</span>
                  <span className="d-value fw-600">{new Date(details.transactionDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">User</span>
                  <span className="d-value link-blue">
                    {details.users && details.users.length ? details.users.join(', ') : '-'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Amount Paid($)</span>
                  <span className="d-value fw-600">{details.amount ? `$${details.amount}` : '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Source Type</span>
                  <span className="d-value fw-600">{details.sourceType || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Payment Status</span>
                  <span className="d-value link-blue">{details.status}</span>
                </div>
                <div className="detail-row">
                  <span className="d-label">Invoice Number</span>
                  <span className="d-value fw-600">{details.invoiceNumber}</span>
                </div>
              </div>

              <div className="dotted-divider"></div>

              {/* Linked Items Section */}
              <div className="linked-items-section">
                <h3 className="section-title">Linked Items</h3>

                {/* Invoices Accordion */}
                <div className="accordion-item open">
                  <div className="accordion-header">
                    <span className="acc-title">
                      Linked Invoice <strong>({details.linkedInvoices?.length || 0})</strong>
                    </span>
                    <Icon icon="lucide:chevron-up" className="acc-icon" />
                  </div>
                  <div className="accordion-body">
                    <div className="drawer-table-wrapper">
                      <table className="drawer-table">
                        <thead>
                          <tr>
                            <th>Invoice</th>
                            <th>Vendor</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(details.linkedInvoices || []).map((inv: any, index: number) => (
                            <tr key={index}>
                              <td>{inv.id}</td>
                              <td>{inv.vendor}</td>
                              <td>{inv.amount}</td>
                              <td>{inv.date}</td>
                              <td>
                                <span className={`status-text status-${inv.status.toLowerCase()}`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td>
                                <Icon icon="lucide:link-2-off" className="unlink-icon" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Receipts Accordion */}
                <div className="accordion-item">
                  <div className="accordion-header">
                    <span className="acc-title">
                      Linked Receipts <strong>({details.linkedReceipts?.length || 0})</strong>
                    </span>
                    <Icon icon="lucide:chevron-down" className="acc-icon" />
                  </div>
                </div>

                {/* Transactions Accordion */}
                <div className="accordion-item">
                  <div className="accordion-header">
                    <span className="acc-title">
                      Linked Transaction <strong>({(details.linkedTransactions || details.linkedTransaction || []).length || 0})</strong>
                    </span>
                    <Icon icon="lucide:chevron-down" className="acc-icon" />
                  </div>
                </div>

              </div>
            </>
          )}
        </div> {/* end drawer-content */}
      </div> {/* end drawer-panel */}
      <AddPaymentDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSuccess={() => loadPayments()}
      />
    </div>
  );
};

export default PaymentPage;