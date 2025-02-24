"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormField {
  id: number;
  name: string;
  type: string;
  maxScore: number;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  bandLevel: string;
  managerId: number;
}

type FeedbackParameter =
  | { name: string; score: number } // Rating type
  | { name: string; text: string }; // Comment type

export default function FeedbackForm() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const { register, handleSubmit, setValue, watch } = useForm();
  const router = useRouter();

  useEffect(() => {
    // Get employee data from local storage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setEmployee(parsedUser.user);

    // Fetch form fields dynamically
    fetch(`http://localhost:3001/feedback/forms/config/${parsedUser.user.id}`)
      .then((res) => res.json())
      .then((data) => setFields(data.fields))
      .catch((err) => console.error("Error fetching form fields:", err));
  }, [router]);

  const onSubmit = (data: any) => {
    if (!employee) return;

    // Convert YYYY-MM to MM-YYYY
    const [year, month] = data.feedbackMonth.split("-");
    const formattedMonth = `${month}-${year}`;

    if (Date.now() < new Date(formattedMonth).getTime()) {
      alert("Feedback month cannot be in the future.");
      return;
    }
    // Convert fields into "parameters" array
    const parameters: FeedbackParameter[] = Object.keys(data)
      .filter(
        (key) =>
          key !== "feedbackMonth" && key !== "comment" && key !== "attachment"
      )
      .map((key) => ({
        name: key,
        score: parseInt(data[key]), // Convert values to numbers
      }));

    // Add comment separately as text field
    parameters.push({ name: "Comment", text: data.comment });

    // Create final formatted payload
    const formattedData = {
      empId: employee.id,
      feedbackMonth: formattedMonth,
      parameters: parameters,
      attachmentUrl: "", // Placeholder for now
    };

    console.log("Formatted Feedback Data:", formattedData);

    // Make API Request
    fetch("http://localhost:3001/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("Feedback Submitted Successfully:", response);
        alert("Feedback Formatted and Submitted Successfully!");
      })
      .catch((error) => console.error("Error submitting feedback:", error));
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 w-full flex justify-between items-center shadow-md">
        <h1 className="text-lg font-semibold">Role: {employee.bandLevel}</h1>
        <img
          src="/profile-placeholder.png"
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
      </nav>

      {/* Centered Feedback Form */}
      <div className="bg-white shadow-lg p-8 rounded-lg mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Feedback</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium">
                {field.name} (Out of {field.maxScore})
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max={field.maxScore}
                  defaultValue={0}
                  {...register(field.name)}
                  className="w-3/4 accent-blue-500"
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
                <span className="text-lg font-semibold w-10 text-center">
                  {watch(field.name) || 0}
                </span>
              </div>
            </div>
          ))}

          {/* Month and Year Selector */}
          <div>
            <label className="block text-sm font-medium">
              Select Month & Year
            </label>
            <input
              type="month"
              {...register("feedbackMonth")}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Comment Box */}
          <div>
            <label className="block text-sm font-medium">Comment</label>
            <textarea
              {...register("comment")}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="border-dashed border-2 border-gray-400 p-4 text-center cursor-pointer rounded-md">
            <input type="file" {...register("attachment")} className="hidden" />
            <p className="text-gray-500">Drag and drop / Browse files</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
