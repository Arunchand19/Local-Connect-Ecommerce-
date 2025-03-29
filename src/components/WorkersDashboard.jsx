import React, { useState, useEffect } from 'react';
import './WorkersDashboard.css';

const WorkersDashboard = () => {
  // Sample data for demonstration
  const [shiftData] = useState({
    currentShift: "9:00 AM - 5:00 PM",
    availableSlots: "8:00 AM - 4:00 PM, 4:00 PM - 12:00 AM",
    breakTimes: "12:00 PM - 12:30 PM",
    shiftHistory: "Mon-Fri, last week: 5 shifts",
  });

  const [customerData] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      contact: "123-456-7890",
      shippingAddress: "123 Main St, City, Country",
      orderStatus: "Shipped",
      orderHistory: ["Order #101", "Order #102"],
      feedback: "Please deliver between 9-11 AM.",
      image: "https://via.placeholder.com/100"  // Placeholder image URL
    },
  ]);

  const [tasks] = useState([
    { id: 1, title: "Package Order #101", priority: "High", deadline: "Today 3 PM" },
    { id: 2, title: "Update Inventory", priority: "Low", deadline: "Tomorrow" },
  ]);

  const [compensation] = useState({
    paymentDetails: "$15/hr",
    bonus: "$20 bonus for order #101",
    workRate: "Hourly",
    earningsSummary: "$120 today",
  });

  const [performanceMetrics] = useState({
    completionRate: "90%",
    customerSatisfaction: "4.5/5",
    efficiencyStats: "Average 30 mins/task",
    errorRate: "1 error per 50 tasks",
  });

  const [notifications] = useState([
    "New task assigned: Package Order #101",
    "Break time in 10 minutes",
  ]);

  const [communicationMessages] = useState([
    "Message from supervisor: Please review your shift timings.",
  ]);

  const [workHistory] = useState([
    "Task: Package Order #100",
    "Task: Inventory Update",
  ]);

  // Dummy event handlers
  const handleAcceptTask = (taskId) => {
    console.log(`Task ${taskId} accepted`);
  };

  const handleRejectTask = (taskId, reason) => {
    console.log(`Task ${taskId} rejected. Reason: ${reason}`);
  };

  const handleFeedbackSubmit = (feedbackText) => {
    console.log(`Feedback submitted: ${feedbackText}`);
  };

  useEffect(() => {
    // Here you can load your API data
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Workers Dashboard</h1>
      </header>

      <div className="cards-container">
        {/* Time Slots and Shift Management */}
        <div className="card">
          <h2>Time Slots &amp; Shift Management</h2>
          <div className="card-content">
            <div className="card-item">
              <strong>Current Work Shift:</strong>
              <p>{shiftData.currentShift}</p>
            </div>
            <div className="card-item">
              <strong>Available Time Slots:</strong>
              <p>{shiftData.availableSlots}</p>
            </div>
            <div className="card-item">
              <strong>Break Times:</strong>
              <p>{shiftData.breakTimes}</p>
            </div>
            <div className="card-item">
              <strong>Shift History:</strong>
              <p>{shiftData.shiftHistory}</p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="card">
          <h2>Customer Details</h2>
          <div className="card-content customer-card">
            {customerData.map((customer, index) => (
              <div key={index} className="customer">
                <div className="customer-img">
                <img src="/images/WhatsApp Image 2025-03-26 at 4.16.27 AM.jpeg" alt={customer.name} />
                </div>
                <div className="customer-info">
                  <h3>{customer.name}</h3>
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Contact:</strong> {customer.contact}</p>
                  <p><strong>Address:</strong> {customer.shippingAddress}</p>
                  <p><strong>Order Status:</strong> {customer.orderStatus}</p>
                  <div>
                    <strong>Order History:</strong>
                    <ul>
                      {customer.orderHistory.map((order, i) => (
                        <li key={i}>{order}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Feedback:</strong>
                    <p>{customer.feedback}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Tasks */}
        <div className="card">
          <h2>Work Tasks</h2>
          <div className="card-content">
            {tasks.map((task) => (
              <div key={task.id} className={`task-card ${task.priority.toLowerCase()}`}>
                <h3>{task.title}</h3>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Deadline:</strong> {task.deadline}</p>
                <div className="task-actions">
                  <button className="btn accept" onClick={() => handleAcceptTask(task.id)}>Accept Task</button>
                  <button className="btn reject" onClick={() => handleRejectTask(task.id, 'Not available')}>Reject Task</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compensation */}
        <div className="card">
          <h2>Compensation</h2>
          <div className="card-content">
            <p><strong>Payment Details:</strong> {compensation.paymentDetails}</p>
            <p><strong>Bonus:</strong> {compensation.bonus}</p>
            <p><strong>Work Rate:</strong> {compensation.workRate}</p>
            <p><strong>Earnings Summary:</strong> {compensation.earningsSummary}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <h2>Performance Metrics</h2>
          <div className="card-content">
            <p><strong>Task Completion Rate:</strong> {performanceMetrics.completionRate}</p>
            <p><strong>Customer Satisfaction:</strong> {performanceMetrics.customerSatisfaction}</p>
            <p><strong>Efficiency Stats:</strong> {performanceMetrics.efficiencyStats}</p>
            <p><strong>Error Rate:</strong> {performanceMetrics.errorRate}</p>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="card notifications-card">
          <h2>Notifications &amp; Alerts</h2>
          <div className="card-content">
            <ul>
              {notifications.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Internal Messaging */}
        <div className="card">
          <h2>Internal Messaging</h2>
          <div className="card-content">
            <ul>
              {communicationMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
            <div className="escalation">
              <p><strong>Escalation:</strong> <a href="#escalate">Click here to escalate tasks</a></p>
            </div>
          </div>
        </div>

        {/* Work History & Reports */}
        <div className="card collapsible">
          <h2>Work History &amp; Reports</h2>
          <div className="card-content">
            <div>
              <strong>Task History:</strong>
              <ul>
                {workHistory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Time Tracking:</strong>
              <p>Logged hours and shift details are displayed here.</p>
            </div>
            <div>
              <strong>Reports:</strong>
              <p>Performance and earnings reports available for review.</p>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="card">
          <h2>Additional Functionalities</h2>
          <div className="card-content">
            <p><strong>Work Requests:</strong> Request shifts, time off, or changes in task assignments.</p>
            <p><strong>Collaboration:</strong> Collaborate on joint tasks or larger projects.</p>
          </div>
        </div>

        {/* Training & Feedback */}
        <div className="card">
          <h2>Training &amp; Feedback</h2>
          <div className="card-content">
            <div className="feedback-section">
              <strong>Worker Feedback:</strong>
              <textarea placeholder="Enter your feedback here"></textarea>
              <button className="btn feedback-btn" onClick={() => handleFeedbackSubmit("Sample feedback")}>Submit Feedback</button>
            </div>
            <p><strong>Learning Opportunities:</strong> Access training resources and development opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkersDashboard;
