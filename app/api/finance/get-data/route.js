import { NextResponse } from "next/server";

export async function GET() {
  const transactions = [
    {
      patientName: "Aarav Sharma",
      method: "CASH",
      amount: 20000,
      date: "2025-09-20",
      branch: "Delhi",
    },
    {
      patientName: "Radhika Pillai",
      method: "UPI",
      amount: 15000,
      date: "2025-09-21",
      branch: "Mumbai",
    },
    {
      patientName: "Imran Khan",
      method: "CARD",
      amount: 25000,
      date: "2025-09-22",
      branch: "Hyderabad",
    },
    {
      patientName: "Neha Singh",
      method: "TRANSFER",
      amount: 30000,
      date: "2025-09-23",
      branch: "Delhi",
    },
    {
      patientName: "Rohit Verma",
      method: "UPI",
      amount: 18000,
      date: "2025-09-24",
      branch: "Mumbai",
    },
  ];

  const expenses = [
    {
      title: "Staff Salary",
      category: "HR",
      amount: 50000,
      date: "2025-09-20",
      branch: "Delhi",
    },
    {
      title: "Clinic Rent",
      category: "Infrastructure",
      amount: 40000,
      date: "2025-09-21",
      branch: "Mumbai",
    },
    {
      title: "Medical Supplies",
      category: "Inventory",
      amount: 12000,
      date: "2025-09-22",
      branch: "Hyderabad",
    },
    {
      title: "Marketing Campaign",
      category: "Advertising",
      amount: 25000,
      date: "2025-09-23",
      branch: "Delhi",
    },
    {
      title: "Electricity Bill",
      category: "Utilities",
      amount: 8000,
      date: "2025-09-24",
      branch: "Mumbai",
    },
  ];

  return NextResponse.json({ transactions, expenses });
}
