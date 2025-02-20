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

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedData = JSON.parse(storedUser);

        // Extract user data correctly
        if (parsedData.user) {
          setEmployee(parsedData.user);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center">{employee.name}</h2>

        <div className="mt-4 p-4 border rounded-md">
          <p>
            <strong>Role:</strong> {employee.bandLevel}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Manager ID:</strong> {employee.managerId}
          </p>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-1/2">
            + Submit Feedback
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md w-1/2">
            + Submit RT
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-200 rounded-md">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p>Updates about RT cycle and admin changes will appear here.</p>
        </div>
      </div>
    </div>
  );
}
