const invoices = [
  {
    name: "Redesign Website",
    company: "Logistics",
    number: "INVOO2",
    amount: 3560,
    status: "Unpaid",
  },
  {
    name: "Module Completion",
    company: "Yip Corp",
    number: "INVOO5",
    amount: 4175,
    status: "Unpaid",
  },
  {
    name: "Change on Emp Module",
    company: "Ignis LLP",
    number: "INVOO3",
    amount: 6985,
    status: "Unpaid",
  },
  {
    name: "Changes on the Board",
    company: "Ignis LLP",
    number: "INVOO2",
    amount: 1457,
    status: "Unpaid",
  },
  {
    name: "Hospital Management",
    company: "HCL Corp",
    number: "INVOO6",
    amount: 6458,
    status: "Paid",
  },
];

const Invoices = () => {
  return (
    <div className="card-body p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Invoices</h5>
        <div>
          Invoices ▼{" "}
          <button className="btn btn-outline-secondary btn-sm ms-2">
            This Week
          </button>
        </div>
      </div>
      {invoices.map((inv, i) => (
        <div
          className="d-flex justify-content-between align-items-center mb-3"
          key={i}
        >
          <div>
            <div className="fw-semibold">{inv.name}</div>
            <small className="text-muted">
              #{inv.number} • {inv.company}
            </small>
          </div>
          <div className="text-end">
            <div className="fw-bold">${inv.amount}</div>
            <span
              className={`badge ${inv.status === "Paid" ? "bg-success" : "bg-danger"} text-white`}
            >
              {inv.status}
            </span>
          </div>
        </div>
      ))}
      <div className="text-center">
        <button className="btn btn-outline-secondary w-100">View All</button>
      </div>
    </div>
  );
};

export default Invoices;
