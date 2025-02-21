"use client";

import { useState } from "react";

export default function RTCycleModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    const today = new Date().toISOString().slice(0, 7); // Get YYYY-MM format

    if (endDate > today) {
      alert("End date cannot be in the future.");
      return;
    }
    if(startDate > endDate) {
      alert("Start date cannot be after end date.");
      return;
    }

    const response = await fetch("http://localhost:3001/admin/rt-cycles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate }),
    });

    if (response.ok) {
      alert("RT Cycle Created Successfully!");
      onSuccess();
    } else {
      alert("Failed to create RT Cycle.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create RT Cycle</h2>

        <label className="block text-sm font-medium">Start Date</label>
        <input type="month" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border rounded-md mb-4" />

        <label className="block text-sm font-medium">End Date</label>
        <input type="month" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border rounded-md mb-4" />

        <button onClick={handleSubmit} className="w-full bg-green-500 text-white py-2 rounded-md">Create</button>
        <button onClick={onClose} className="w-full mt-2 text-gray-600">Cancel</button>
      </div>
    </div>
  );
}
