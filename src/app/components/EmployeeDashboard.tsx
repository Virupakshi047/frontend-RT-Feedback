"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [managerName, setManagerName] = useState<string | null>(null);
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
            <button className="bg-green-500 text-white px-4 py-2 rounded-md w-1/2">
              + Submit RT
            </button>
          </div>
        </div>

        {/* Right Panel - Empty Content Area */}
        <div className="flex-1 bg-white shadow-md p-6 m-4 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            History of submitted feed backs
          </p>
        </div>
      </div>
    </div>
  );
}
