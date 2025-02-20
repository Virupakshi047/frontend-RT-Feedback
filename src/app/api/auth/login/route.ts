import { NextResponse } from "next/server";
import { api } from "../../../utils/api";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    const endpoint = role === "admin" ? "/admin/login" : "/employees/login";
    const response = await api.post(endpoint, { email, password });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.response?.data || "Login failed" }, { status: 400 });
  }
}
