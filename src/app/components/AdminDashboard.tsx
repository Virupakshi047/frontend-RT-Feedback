"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  bandLevel: string;
}

interface RT_Cycle {
  cycleId: number;
  startDate: string;
  endDate: string;
  status: string;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rtCycles, setRTCycles] = useState<RT_Cycle[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get admin data from local storage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setAdmin(parsedUser);

    // Fetch employees list
    fetch("http://localhost:3001/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));


  }, [router]);

  const handleSearch = () => {
    if (!searchEmail) return;
    const filteredEmployees = employees.filter((emp) =>
      emp.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setEmployees(filteredEmployees);
  };

  const handleCreateRTCycle = () => {
    alert("RT Cycle Creation UI to be implemented!");
  };

  if (!admin) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-semibold">{admin.name}</h1>
        <img src="/profile-placeholder.png" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white" />
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Search & Create RT Cycle */}
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search By Email ID..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-2/3 p-2 border rounded-md"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Search
          </button>
          <button
            onClick={handleCreateRTCycle}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            + Create New RT Cycle
          </button>
        </div>

        {/* Admin Dashboard Sections */}
        <div className="flex gap-6">
          {/* RT Cycles Section */}
          <div className="w-1/2 bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Previous RT Cycles</h2>
            {rtCycles.length > 0 ? (
              <ul className="space-y-2">
                {rtCycles.map((cycle) => (
                  <li key={cycle.cycleId} className="p-2 border rounded-md">
                    <p><strong>Start-End:</strong> {cycle.startDate} - {cycle.endDate}</p>
                    <p><strong>Status:</strong> {cycle.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No RT cycles found</p>
            )}
          </div>

          {/* Employees List Section */}
          <div className="w-1/2 bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">List of Employees</h2>
            {employees.length > 0 ? (
              <ul className="space-y-2">
                {employees.map((emp) => (
                  <li key={emp.id} className="p-2 border rounded-md">
                    <p><strong>Name:</strong> {emp.name}</p>
                    <p><strong>Email:</strong> {emp.email}</p>
                    <p><strong>Role:</strong> {emp.bandLevel}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No employees found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
