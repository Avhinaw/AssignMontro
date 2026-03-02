import { useState } from "react";
import { Icon } from "@iconify/react";
import { createPayment } from "../lib/api";

const AddPaymentDrawer = ({ isOpen, onClose, onSuccess }: any) => {
  const [formData, setFormData] = useState({
    application: "",
    transactionDate: "",
    amount: "",
    status: "Pending",
    invoiceNumber: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const paymentPayload = {
        application: formData.application,
        amount: parseFloat(formData.amount),
        transactionDate: formData.transactionDate,
        status: formData.status,
        invoiceNumber: formData.invoiceNumber,
        description: formData.description,
      };

      const response = await createPayment(paymentPayload);
      console.log("Payment created successfully:", response);

      // Reset form
      setFormData({
        application: "",
        transactionDate: "",
        amount: "",
        status: "Pending",
        invoiceNumber: "",
        description: "",
      });

      // Call success callback to refresh table
      if (onSuccess) {
        onSuccess(response);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create payment");
      console.error("Error creating payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`drawer-panel ${isOpen ? 'open' : ''}`}>
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-area">
            <button className="back-btn" onClick={onClose}>
              <Icon icon="lucide:arrow-left" />
            </button>
            <h2 className="drawer-title">Add Payment</h2>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="drawer-content">
          <form className="add-payment-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Application</label>
              <select 
                name="application"
                value={formData.application}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Application</option>
                <option value="Slack">Slack</option>
                <option value="OpenAI">OpenAI</option>
                <option value="AWS">AWS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Transaction Date</label>
              <input 
                type="date" 
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Amount Paid ($)</label>
              <input 
                type="number" 
                step="0.01"
                name="amount"
                placeholder="0.00" 
                value={formData.amount}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Invoice Number</label>
              <input 
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Payment Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                placeholder="Enter details..." 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPaymentDrawer;