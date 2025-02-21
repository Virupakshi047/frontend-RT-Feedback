"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RTFeedbackModal from "./RTFeedbackModal";

interface Employee {
  id: number;
  name: string;
  email: string;
  bandLevel: string;
  managerId: number;
}

interface Manager {
  name: string;
}

interface FeedbackEntry {
  id: number;
  feedbackMonth: string;
  scores: { name: string; score: number; comments: string | null }[];
}

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [managerName, setManagerName] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackEntry[]>([]);
  const [showRTModal, setShowRTModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedData = JSON.parse(storedUser);

        if (parsedData.user) {
          setEmployee(parsedData.user);

          // Fetch manager details
          fetch(`http://localhost:3001/employees/${parsedData.user.managerId}`)
            .then((res) => res.json())
            .then((data: Manager) => setManagerName(data.name))
            .catch((error) =>
              console.error("Error fetching manager details:", error)
            );

          // Fetch feedback history
          fetch(`http://localhost:3001/feedback/${parsedData.user.id}`)
            .then((res) => res.json())
            .then((data) => setFeedbackHistory(data.monthlyFeedbacks || []))
            .catch((error) =>
              console.error("Error fetching feedback history:", error)
            );
        } else {
          console.error("User data missing in response:", parsedData);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        localStorage.removeItem("user");
        router.push("/auth");
      }
    } else {
      router.push("/auth");
    }
  }, [router]);

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-semibold">{employee.name}</h1>
        <img
          src="https://avatar.iran.liara.run/public/boy"
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
      </nav>

      {/* Main Content */}
      <div className="flex flex-row flex-1">
        {/* Left Panel - Employee Details */}
        <div className="w-1/4 bg-white shadow-md p-6 m-4 rounded-lg">
          <div className="flex flex-col items-center">
            <img
              src="https://avatar.iran.liara.run/public/boy"
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 mb-4"
            />
            <h2 className="text-xl font-semibold">{employee.name}</h2>
            <p className="text-gray-600">+91 9023744332</p>
          </div>
          <div className="mt-6 border-t pt-4">
            <p>
              <strong>Role:</strong> {employee.bandLevel}
            </p>
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>Manager:</strong> {managerName || "Loading..."}
            </p>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-1/2"
              onClick={() => router.push("/feedback")}
            >
              + Submit Feedback
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md w-1/2"
              onClick={() => setShowRTModal(true)}
            >
              + Submit RT
            </button>
          </div>
        </div>

        {/* Right Panel - Feedback History */}
        <div className="flex-1 bg-white shadow-md p-6 m-4 rounded-lg overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Feedback History</h2>

          {feedbackHistory.length > 0 ? (
            <div className="space-y-4">
              {feedbackHistory.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {formatMonthYear(entry.feedbackMonth)}
                  </h3>
                  <ul className="text-gray-600 space-y-1">
                    {entry.scores
                      .filter((score) => score.name !== "Comment") // ✅ Exclude "Comment" scores
                      .map((score, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{score.name}:</span>
                          <span className="font-semibold">
                            {score.score}/10
                          </span>
                        </li>
                      ))}
                  </ul>
                  {/* Display comment if available */}
                  {entry.scores.some((s) => s.comments) && (
                    <div className="mt-2 p-2 bg-gray-100 rounded">
                      <strong>Comments:</strong>
                      <p className="text-sm text-gray-700">
                        {entry.scores
                          .filter((s) => s.comments)
                          .map((s) => s.comments)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No feedback submitted</p>
          )}
        </div>
      </div>
      {showRTModal && (
        <RTFeedbackModal
          empId={employee.id}
          onClose={() => setShowRTModal(false)}
          onSuccess={() => {
            setShowRTModal(false);
            alert("RT Feedback submitted successfully!");
          }}
        />
      )}
    </div>
  );
}

/* 🔥 Function: Convert "10-2024" → "October 2024" */
const formatMonthYear = (monthYear: string) => {
  const [month, year] = monthYear.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};
