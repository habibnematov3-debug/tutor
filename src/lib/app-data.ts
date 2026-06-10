export type Student = {
  id: number;
  code: string;
  name: string;
  phone: string;
  group: string;
  joinedAt: string;
  balance: number;
  paidUntil: string;
  status: "active" | "due" | "trial";
  averageScore: number;
};

export type Payment = {
  id: number;
  studentId: number;
  amount: number;
  month: string;
  status: "pending" | "approved";
  channel: "Telegram" | "Manual";
  submittedAt: string;
};

export type Exam = {
  id: number;
  title: string;
  date: string;
  maxScore: number;
  results: Record<number, number>;
};

export type Announcement = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
};

export type DashboardData = {
  students: Student[];
  payments: Payment[];
  exams: Exam[];
  announcements: Announcement[];
  isConnected: boolean;
  connectionError?: string;
};

export const demoDashboardData: DashboardData = {
  isConnected: false,
  students: [
    {
      id: 1,
      code: "ENG-2026-001",
      name: "Aziza Karimova",
      phone: "+998 90 211 45 87",
      group: "IELTS Morning",
      joinedAt: "2026-05-10",
      balance: 0,
      paidUntil: "2026-06-30",
      status: "active",
      averageScore: 87,
    },
    {
      id: 2,
      code: "ENG-2026-002",
      name: "Jasur Rahmonov",
      phone: "+998 93 771 18 03",
      group: "CEFR B2",
      joinedAt: "2026-05-17",
      balance: 500000,
      paidUntil: "2026-05-31",
      status: "due",
      averageScore: 74,
    },
    {
      id: 3,
      code: "ENG-2026-003",
      name: "Madina Tursunova",
      phone: "+998 94 512 29 66",
      group: "IELTS Evening",
      joinedAt: "2026-06-01",
      balance: 0,
      paidUntil: "2026-06-15",
      status: "trial",
      averageScore: 91,
    },
    {
      id: 4,
      code: "ENG-2026-004",
      name: "Sardor Aliyev",
      phone: "+998 97 840 02 44",
      group: "CEFR B1",
      joinedAt: "2026-04-22",
      balance: 0,
      paidUntil: "2026-06-30",
      status: "active",
      averageScore: 68,
    },
  ],
  payments: [
    {
      id: 1,
      studentId: 2,
      amount: 500000,
      month: "June 2026",
      status: "pending",
      channel: "Telegram",
      submittedAt: "2026-06-08 18:42",
    },
    {
      id: 2,
      studentId: 1,
      amount: 500000,
      month: "June 2026",
      status: "approved",
      channel: "Manual",
      submittedAt: "2026-06-01 09:20",
    },
    {
      id: 3,
      studentId: 4,
      amount: 450000,
      month: "June 2026",
      status: "approved",
      channel: "Telegram",
      submittedAt: "2026-06-03 14:05",
    },
  ],
  exams: [
    {
      id: 1,
      title: "IELTS Mock 06",
      date: "2026-06-07",
      maxScore: 100,
      results: { 1: 91, 2: 72, 3: 94, 4: 65 },
    },
    {
      id: 2,
      title: "Vocabulary Sprint",
      date: "2026-06-02",
      maxScore: 50,
      results: { 1: 42, 2: 38, 3: 47, 4: 34 },
    },
  ],
  announcements: [
    {
      id: 1,
      title: "Mock exam",
      body: "Saturday at 10:00. Bring notebook, pen, and student ID.",
      createdAt: "2026-06-08",
    },
    {
      id: 2,
      title: "Homework",
      body: "Unit 12 vocabulary and writing task 2 outline before Friday.",
      createdAt: "2026-06-06",
    },
  ],
};
