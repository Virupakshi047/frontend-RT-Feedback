"use client";

import { useState } from "react";

export default function RTFeedbackModal({
  empId,
  onClose,
  onSuccess,
}: {
  empId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }

    const response = await fetch(`http://localhost:3001/employee/rt-cycles/1/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empId,
        additionalComments: comment,
      }),
    });

    if (response.ok) {
      onSuccess();
    } else {
      alert("Failed to submit RT Feedback.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">RT Feedback</h2>

        <label className="block text-sm font-medium">Details</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded-md mt-1"
          placeholder="Add something..."
          rows={4}
        ></textarea>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-md mt-4"
        >
          Submit
        </button>
        <button onClick={onClose} className="w-full mt-2 text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
