import { NextResponse } from "next/server";
import { api } from "../../../utils/api";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (role === "admin") {
      const response = await api.post("/admin", { name, email, password });
      return NextResponse.json(response.data);
    } else {
      const bands = ["B6", "B7", "B8"];
      const randomBandLevel = bands[Math.floor(Math.random() * bands.length)];
      const employeeData = { name, email, password, bandLevel: randomBandLevel, managerId: 3 };

      const response = await api.post("/employees", employeeData);
      return NextResponse.json(response.data);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.response?.data || "Signup failed" }, { status: 400 });
  }
}
