import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import '../App.css'
import AddPaymentDrawer from "../components/AddPayment";
import { fetchPayments, exportPaymentsCsv } from "../lib/api";

const PaymentPage = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Drawer Table Data
  const linkedInvoices = [
    { id: "12345", vendor: "Acme Corp", amount: "$1,200.00", date: "2023-09-15", status: "Paid" },
    { id: "12346", vendor: "Beta LLC", amount: "$750.00", date: "2023-09-20", status: "Pending" },
    { id: "12347", vendor: "Gamma Inc", amount: "$500.00", date: "2023-09-25", status: "Overdue" },
    { id: "12348", vendor: "Delta Corp", amount: "$1,250.00", date: "2023-10-01", status: "Paid" },
    { id: "12349", vendor: "Epsilon LLC", amount: "$750.00", date: "2023-10-05", status: "Overdue" },
    { id: "12350", vendor: "Zeta Systems", amount: "$300.00", date: "2023-09-30", status: "Pending" },
    { id: "12351", vendor: "Theta Solu...", amount: "$450.00", date: "2023-10-10", status: "Paid" },
  ];

  const toggleSelectAll = () => {
    if (selectedRows.length === tableData.length) setSelectedRows([]);
    else setSelectedRows(tableData.map(r => r.id));
  };

  const toggleRow = (id: number) => {
    if (selectedRows.includes(id)) setSelectedRows(selectedRows.filter(item => item !== id));
    else setSelectedRows([...selectedRows, id]);
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
              <tr key={row.id} className={selectedRows.includes(row.id) ? "selected-row" : ""}>
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
                  <div className="avatar-group" onClick={() => setIsDrawerOpen(true)} style={{ cursor: 'pointer' }}>
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

          <div className="drawer-app-title">
            <Icon icon="logos:slack-icon" className="app-icon" />
            <h3>Slack</h3>
          </div>

          <div className="details-list">
            <div className="detail-row">
              <span className="d-label">Transaction Date</span>
              <span className="d-value fw-600">01 Aug 2025</span>
            </div>
            <div className="detail-row">
              <span className="d-label">User</span>
              <span className="d-value link-blue">Emily Taylor</span>
            </div>
            <div className="detail-row">
              <span className="d-label">Amount Paid($)</span>
              <span className="d-value fw-600">$187.74</span>
            </div>
            <div className="detail-row">
              <span className="d-label">Source Type</span>
              <span className="d-value fw-600">-</span>
            </div>
            <div className="detail-row">
              <span className="d-label">Payment Status</span>
              <span className="d-value link-blue">Pending</span>
            </div>
            <div className="detail-row">
              <span className="d-label">Invoice Number</span>
              <span className="d-value fw-600">ABCD1234</span>
            </div>
          </div>

          <div className="dotted-divider"></div>

          {/* Linked Items Section */}
          <div className="linked-items-section">
            <h3 className="section-title">Linked Items</h3>

            {/* Accordion 1 */}
            <div className="accordion-item open">
              <div className="accordion-header">
                <span className="acc-title">Linked Invoice <strong>(50)</strong></span>
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
                      {linkedInvoices.map((inv, index) => (
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

                <div className="drawer-pagination">
                  <div className="page-size">
                    50 <Icon icon="lucide:chevron-down" />
                  </div>
                  <span className="page-info">1-50 of 1,250</span>
                  <div className="page-controls">
                    <button><Icon icon="lucide:chevrons-left" /></button>
                    <button><Icon icon="lucide:chevron-left" /></button>
                    <button><Icon icon="lucide:chevron-right" /></button>
                    <button><Icon icon="lucide:chevrons-right" /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <div className="accordion-header">
                <span className="acc-title">Linked Receipts <strong>(40)</strong></span>
                <Icon icon="lucide:chevron-down" className="acc-icon" />
              </div>
            </div>

            <div className="accordion-item">
              <div className="accordion-header">
                <span className="acc-title">Linked Transaction <strong>(01)</strong></span>
                <Icon icon="lucide:chevron-down" className="acc-icon" />
              </div>
            </div>

          </div>
        </div>
      </div>
      <AddPaymentDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSuccess={() => loadPayments()}
      />
    </div>
  );
};

export default PaymentPage;