"use client";

import { FormEvent, useMemo, useState } from "react";

type Student = {
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

type Payment = {
  id: number;
  studentId: number;
  amount: number;
  month: string;
  status: "pending" | "approved";
  channel: "Telegram" | "Manual";
  submittedAt: string;
};

type Exam = {
  id: number;
  title: string;
  date: string;
  maxScore: number;
  results: Record<number, number>;
};

type Announcement = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
};

type View = "teacher" | "student";
type TeacherTab = "students" | "payments" | "exams" | "news";

const initialStudents: Student[] = [
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
];

const initialPayments: Payment[] = [
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
];

const initialExams: Exam[] = [
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
];

const initialAnnouncements: Announcement[] = [
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
];

const money = new Intl.NumberFormat("ru-RU");

function Icon({
  name,
  className = "",
}: {
  name:
    | "users"
    | "wallet"
    | "chart"
    | "bell"
    | "plus"
    | "check"
    | "bot"
    | "id"
    | "arrow"
    | "search"
    | "medal"
    | "book";
  className?: string;
}) {
  const common = {
    className: `h-4 w-4 ${className}`,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths = {
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    wallet: (
      <>
        <path d="M19 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6" />
        <path d="M16 14h.01" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-6" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    check: (
      <>
        <path d="m20 6-11 11-5-5" />
      </>
    ),
    bot: (
      <>
        <rect width="16" height="12" x="4" y="8" rx="3" />
        <path d="M12 4v4" />
        <path d="M8 14h.01" />
        <path d="M16 14h.01" />
        <path d="M9 18h6" />
      </>
    ),
    id: (
      <>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="M7 9h4" />
        <path d="M7 13h2" />
        <path d="M15 12h2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    medal: (
      <>
        <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
        <circle cx="12" cy="17" r="5" />
        <path d="M12 14v3l2 1" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4v15.5A2.5 2.5 0 0 1 6.5 22H20V6a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 6.5" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function StatusBadge({ status }: { status: Student["status"] | Payment["status"] }) {
  const styles = {
    active: "border-emerald-200 bg-emerald-50 text-emerald-700",
    due: "border-rose-200 bg-rose-50 text-rose-700",
    trial: "border-amber-200 bg-amber-50 text-amber-700",
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  const labels = {
    active: "active",
    due: "due",
    trial: "trial",
    pending: "pending",
    approved: "approved",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-md border px-2 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="grid min-h-[180px] place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
      {text}
    </div>
  );
}

export function EduTrackApp() {
  const [view, setView] = useState<View>("teacher");
  const [teacherTab, setTeacherTab] = useState<TeacherTab>("students");
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    initialAnnouncements,
  );
  const [selectedStudentId, setSelectedStudentId] = useState(1);
  const [query, setQuery] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentGroup, setStudentGroup] = useState("IELTS Morning");
  const [scoreStudentId, setScoreStudentId] = useState(1);
  const [scoreValue, setScoreValue] = useState("88");
  const [examTitle, setExamTitle] = useState("Weekly checkpoint");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return students;
    return students.filter((student) =>
      `${student.name} ${student.code} ${student.phone} ${student.group}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, students]);

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ?? students[0];

  const leaderboard = useMemo(
    () => [...students].sort((a, b) => b.averageScore - a.averageScore),
    [students],
  );

  const revenue = payments
    .filter((payment) => payment.status === "approved")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending",
  ).length;
  const dueStudents = students.filter((student) => student.status === "due").length;

  function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) return;

    const nextId = Math.max(...students.map((student) => student.id)) + 1;
    const nextCode = `ENG-2026-${String(nextId).padStart(3, "0")}`;

    const student: Student = {
      id: nextId,
      code: nextCode,
      name: studentName.trim(),
      phone: studentPhone.trim(),
      group: studentGroup,
      joinedAt: "2026-06-09",
      balance: 500000,
      paidUntil: "2026-06-30",
      status: "trial",
      averageScore: 0,
    };

    setStudents((current) => [student, ...current]);
    setSelectedStudentId(nextId);
    setStudentName("");
    setStudentPhone("");
  }

  function approvePayment(paymentId: number) {
    const payment = payments.find((item) => item.id === paymentId);
    if (!payment) return;

    setPayments((current) =>
      current.map((item) =>
        item.id === paymentId ? { ...item, status: "approved" } : item,
      ),
    );
    setStudents((current) =>
      current.map((student) =>
        student.id === payment.studentId
          ? { ...student, balance: 0, status: "active", paidUntil: "2026-06-30" }
          : student,
      ),
    );
  }

  function recordScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedScore = Number(scoreValue);
    if (!Number.isFinite(parsedScore)) return;

    const nextExam: Exam = {
      id: Math.max(...exams.map((exam) => exam.id)) + 1,
      title: examTitle.trim() || "Weekly checkpoint",
      date: "2026-06-09",
      maxScore: 100,
      results: { [scoreStudentId]: parsedScore },
    };

    setExams((current) => [nextExam, ...current]);
    setStudents((current) =>
      current.map((student) =>
        student.id === scoreStudentId
          ? {
              ...student,
              averageScore:
                student.averageScore === 0
                  ? parsedScore
                  : Math.round((student.averageScore + parsedScore) / 2),
            }
          : student,
      ),
    );
    setScoreValue("");
  }

  function publishAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newsTitle.trim() || !newsBody.trim()) return;

    setAnnouncements((current) => [
      {
        id: Math.max(...announcements.map((announcement) => announcement.id)) + 1,
        title: newsTitle.trim(),
        body: newsBody.trim(),
        createdAt: "2026-06-09",
      },
      ...current,
    ]);
    setNewsTitle("");
    setNewsBody("");
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-[#fbfaf7] px-4 py-5 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-950 text-sm font-semibold text-white">
              ET
            </div>
            <div>
              <div className="text-sm font-semibold">EduTrack</div>
              <div className="text-xs text-zinc-500">Tutor OS</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                Mode
              </div>
              <div className="grid gap-1">
                <button
                  className={`flex h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium ${
                    view === "teacher"
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                  type="button"
                  onClick={() => setView("teacher")}
                >
                  <Icon name="users" />
                  Teacher
                </button>
                <button
                  className={`flex h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium ${
                    view === "student"
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                  type="button"
                  onClick={() => setView("student")}
                >
                  <Icon name="book" />
                  Student
                </button>
              </div>
            </div>

            {view === "teacher" && (
              <div>
                <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Workspace
                </div>
                <div className="grid gap-1">
                  {[
                    ["students", "Students", "users"],
                    ["payments", "Payments", "wallet"],
                    ["exams", "Exams", "chart"],
                    ["news", "News", "bell"],
                  ].map(([id, label, icon]) => (
                    <button
                      key={id}
                      className={`flex h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium ${
                        teacherTab === id
                          ? "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200"
                          : "text-zinc-600 hover:bg-zinc-100"
                      }`}
                      type="button"
                      onClick={() => setTeacherTab(id as TeacherTab)}
                    >
                      <Icon name={icon as Parameters<typeof Icon>[0]["name"]} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-zinc-200 bg-[#fbfaf7]/90 px-4 py-4 backdrop-blur md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  June 9, 2026
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
                  {view === "teacher" ? "Teacher dashboard" : "Student cabinet"}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-10 rounded-lg border border-zinc-200 bg-white p-1 lg:hidden">
                  <button
                    className={`rounded-md px-3 text-sm font-medium ${
                      view === "teacher"
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600"
                    }`}
                    type="button"
                    onClick={() => setView("teacher")}
                  >
                    Teacher
                  </button>
                  <button
                    className={`rounded-md px-3 text-sm font-medium ${
                      view === "student"
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600"
                    }`}
                    type="button"
                    onClick={() => setView("student")}
                  >
                    Student
                  </button>
                </div>

                <button
                  className="flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white"
                  type="button"
                  onClick={() => {
                    setView("teacher");
                    setTeacherTab("students");
                  }}
                >
                  <Icon name="plus" />
                  Add student
                </button>
              </div>
            </div>
          </header>

          <div className="grid flex-1 gap-4 p-4 md:p-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="min-w-0">
              {view === "teacher" ? (
                <TeacherDashboard
                  approvePayment={approvePayment}
                  dueStudents={dueStudents}
                  exams={exams}
                  filteredStudents={filteredStudents}
                  newsBody={newsBody}
                  newsTitle={newsTitle}
                  payments={payments}
                  pendingPayments={pendingPayments}
                  publishAnnouncement={publishAnnouncement}
                  query={query}
                  recordScore={recordScore}
                  revenue={revenue}
                  scoreStudentId={scoreStudentId}
                  scoreValue={scoreValue}
                  selectedStudentId={selectedStudentId}
                  setNewsBody={setNewsBody}
                  setNewsTitle={setNewsTitle}
                  setQuery={setQuery}
                  setScoreStudentId={setScoreStudentId}
                  setScoreValue={setScoreValue}
                  setSelectedStudentId={setSelectedStudentId}
                  setExamTitle={setExamTitle}
                  examTitle={examTitle}
                  setStudentGroup={setStudentGroup}
                  setStudentName={setStudentName}
                  setStudentPhone={setStudentPhone}
                  studentGroup={studentGroup}
                  studentName={studentName}
                  studentPhone={studentPhone}
                  students={students}
                  teacherTab={teacherTab}
                  setTeacherTab={setTeacherTab}
                  addStudent={addStudent}
                  announcements={announcements}
                />
              ) : (
                <StudentCabinet
                  announcements={announcements}
                  exams={exams}
                  leaderboard={leaderboard}
                  selectedStudent={selectedStudent}
                  selectedStudentId={selectedStudentId}
                  setSelectedStudentId={setSelectedStudentId}
                  students={students}
                />
              )}
            </section>

            <aside className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-zinc-950">Live flow</h2>
                  <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                    demo
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    ["Student added", "ID is generated automatically"],
                    ["Telegram receipt", "Payment waits for approval"],
                    ["Exam result", "Score updates ranking"],
                    ["News posted", "Students see it instantly"],
                  ].map(([title, body], index) => (
                    <div key={title} className="flex gap-3">
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-700">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-900">
                          {title}
                        </div>
                        <div className="text-xs leading-5 text-zinc-500">{body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <h2 className="mb-4 text-sm font-semibold text-zinc-950">
                  Student preview
                </h2>
                <div className="rounded-lg border border-zinc-200 bg-[#fbfaf7] p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">
                        {selectedStudent.name}
                      </div>
                      <div className="mt-1 font-mono text-xs text-zinc-500">
                        {selectedStudent.code}
                      </div>
                    </div>
                    <StatusBadge status={selectedStudent.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md bg-white p-3">
                      <div className="text-xs text-zinc-500">Average</div>
                      <div className="mt-1 font-semibold">
                        {selectedStudent.averageScore || "-"}%
                      </div>
                    </div>
                    <div className="rounded-md bg-white p-3">
                      <div className="text-xs text-zinc-500">Balance</div>
                      <div className="mt-1 font-semibold">
                        {selectedStudent.balance
                          ? `${money.format(selectedStudent.balance)} сум`
                          : "0 сум"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function TeacherDashboard(props: {
  addStudent: (event: FormEvent<HTMLFormElement>) => void;
  announcements: Announcement[];
  approvePayment: (paymentId: number) => void;
  dueStudents: number;
  examTitle: string;
  exams: Exam[];
  filteredStudents: Student[];
  newsBody: string;
  newsTitle: string;
  payments: Payment[];
  pendingPayments: number;
  publishAnnouncement: (event: FormEvent<HTMLFormElement>) => void;
  query: string;
  recordScore: (event: FormEvent<HTMLFormElement>) => void;
  revenue: number;
  scoreStudentId: number;
  scoreValue: string;
  selectedStudentId: number;
  setExamTitle: (value: string) => void;
  setNewsBody: (value: string) => void;
  setNewsTitle: (value: string) => void;
  setQuery: (value: string) => void;
  setScoreStudentId: (value: number) => void;
  setScoreValue: (value: string) => void;
  setSelectedStudentId: (value: number) => void;
  setStudentGroup: (value: string) => void;
  setStudentName: (value: string) => void;
  setStudentPhone: (value: string) => void;
  setTeacherTab: (value: TeacherTab) => void;
  studentGroup: string;
  studentName: string;
  studentPhone: string;
  students: Student[];
  teacherTab: TeacherTab;
}) {
  const tabs: Array<[TeacherTab, string, "users" | "wallet" | "chart" | "bell"]> =
    [
      ["students", "Students", "users"],
      ["payments", "Payments", "wallet"],
      ["exams", "Exams", "chart"],
      ["news", "News", "bell"],
    ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon="users" label="Students" value={String(props.students.length)} />
        <Metric
          icon="wallet"
          label="Revenue"
          value={`${money.format(props.revenue)} сум`}
        />
        <Metric
          icon="bell"
          label="Pending"
          value={String(props.pendingPayments)}
        />
        <Metric icon="id" label="Due" value={String(props.dueStudents)} />
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-200 bg-white p-2">
        {tabs.map(([id, label, icon]) => (
          <button
            key={id}
            className={`flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium ${
              props.teacherTab === id
                ? "bg-zinc-950 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
            type="button"
            onClick={() => props.setTeacherTab(id)}
          >
            <Icon name={icon} />
            {label}
          </button>
        ))}
      </div>

      {props.teacherTab === "students" && <StudentsPanel {...props} />}
      {props.teacherTab === "payments" && <PaymentsPanel {...props} />}
      {props.teacherTab === "exams" && <ExamsPanel {...props} />}
      {props.teacherTab === "news" && <NewsPanel {...props} />}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
        <Icon name={icon} />
      </div>
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
        {value}
      </div>
    </div>
  );
}

function StudentsPanel(
  props: Parameters<typeof TeacherDashboard>[0] & {
    filteredStudents: Student[];
  },
) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-lg border border-zinc-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-base font-semibold">Students</h2>
          <label className="relative block md:w-72">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-teal-500"
              placeholder="Search"
              value={props.query}
              onChange={(event) => props.setQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Group</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {props.filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className={`cursor-pointer hover:bg-zinc-50 ${
                    props.selectedStudentId === student.id ? "bg-teal-50/60" : ""
                  }`}
                  onClick={() => props.setSelectedStudentId(student.id)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-950">{student.name}</div>
                    <div className="font-mono text-xs text-zinc-500">
                      {student.code}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{student.group}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {student.balance
                      ? `${money.format(student.balance)} сум`
                      : "paid"}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-950">
                    {student.averageScore || "-"}%
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={student.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form
        className="rounded-lg border border-zinc-200 bg-white p-4"
        onSubmit={props.addStudent}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-950 text-white">
            <Icon name="plus" />
          </div>
          <h2 className="text-base font-semibold">New student</h2>
        </div>
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-medium text-zinc-700">
            Full name
            <input
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-teal-500"
              value={props.studentName}
              onChange={(event) => props.setStudentName(event.target.value)}
              placeholder="Name surname"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700">
            Phone
            <input
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-teal-500"
              value={props.studentPhone}
              onChange={(event) => props.setStudentPhone(event.target.value)}
              placeholder="+998"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700">
            Group
            <select
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-teal-500"
              value={props.studentGroup}
              onChange={(event) => props.setStudentGroup(event.target.value)}
            >
              <option>IELTS Morning</option>
              <option>IELTS Evening</option>
              <option>CEFR B1</option>
              <option>CEFR B2</option>
            </select>
          </label>
          <button
            className="mt-2 flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white"
            type="submit"
          >
            <Icon name="id" />
            Generate ID
          </button>
        </div>
      </form>
    </div>
  );
}

function PaymentsPanel(props: Parameters<typeof TeacherDashboard>[0]) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 p-4">
        <h2 className="text-base font-semibold">Payments</h2>
        <div className="flex items-center gap-2 rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
          <Icon name="bot" />
          Telegram
        </div>
      </div>
      <div className="divide-y divide-zinc-100">
        {props.payments.map((payment) => {
          const student = props.students.find((item) => item.id === payment.studentId);
          return (
            <div
              key={payment.id}
              className="grid gap-3 p-4 md:grid-cols-[1fr_140px_120px_120px] md:items-center"
            >
              <div>
                <div className="font-medium text-zinc-950">
                  {student?.name ?? "Unknown student"}
                </div>
                <div className="text-sm text-zinc-500">
                  {payment.month} · {payment.submittedAt}
                </div>
              </div>
              <div className="text-sm font-semibold text-zinc-950">
                {money.format(payment.amount)} сум
              </div>
              <StatusBadge status={payment.status} />
              {payment.status === "pending" ? (
                <button
                  className="flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white"
                  type="button"
                  onClick={() => props.approvePayment(payment.id)}
                >
                  <Icon name="check" />
                  Approve
                </button>
              ) : (
                <div className="flex h-9 items-center gap-2 text-sm font-medium text-emerald-700">
                  <Icon name="check" />
                  Confirmed
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExamsPanel(props: Parameters<typeof TeacherDashboard>[0]) {
  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <form
        className="rounded-lg border border-zinc-200 bg-white p-4"
        onSubmit={props.recordScore}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-50 text-teal-700">
            <Icon name="chart" />
          </div>
          <h2 className="text-base font-semibold">Record score</h2>
        </div>
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-medium text-zinc-700">
            Exam
            <input
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-teal-500"
              value={props.examTitle}
              onChange={(event) => props.setExamTitle(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700">
            Student
            <select
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-teal-500"
              value={props.scoreStudentId}
              onChange={(event) =>
                props.setScoreStudentId(Number(event.target.value))
              }
            >
              {props.students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700">
            Score
            <input
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-teal-500"
              type="number"
              min="0"
              max="100"
              value={props.scoreValue}
              onChange={(event) => props.setScoreValue(event.target.value)}
            />
          </label>
          <button
            className="mt-2 flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white"
            type="submit"
          >
            <Icon name="check" />
            Save score
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 p-4">
          <h2 className="text-base font-semibold">Exam history</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {props.exams.map((exam) => {
            const entries = Object.entries(exam.results);
            return (
              <div key={exam.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-zinc-950">{exam.title}</div>
                    <div className="text-sm text-zinc-500">{exam.date}</div>
                  </div>
                  <div className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                    max {exam.maxScore}
                  </div>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {entries.map(([studentId, score]) => {
                    const student = props.students.find(
                      (item) => item.id === Number(studentId),
                    );
                    return (
                      <div
                        key={studentId}
                        className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2 text-sm"
                      >
                        <span className="text-zinc-600">
                          {student?.name ?? "Unknown student"}
                        </span>
                        <span className="font-semibold text-zinc-950">
                          {score}/{exam.maxScore}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NewsPanel(props: Parameters<typeof TeacherDashboard>[0]) {
  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <form
        className="rounded-lg border border-zinc-200 bg-white p-4"
        onSubmit={props.publishAnnouncement}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-700">
            <Icon name="bell" />
          </div>
          <h2 className="text-base font-semibold">Publish news</h2>
        </div>
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-medium text-zinc-700">
            Title
            <input
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-teal-500"
              value={props.newsTitle}
              onChange={(event) => props.setNewsTitle(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-700">
            Message
            <textarea
              className="min-h-28 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-normal outline-none focus:border-teal-500"
              value={props.newsBody}
              onChange={(event) => props.setNewsBody(event.target.value)}
            />
          </label>
          <button
            className="mt-2 flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white"
            type="submit"
          >
            <Icon name="arrow" />
            Publish
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {props.announcements.length ? (
          props.announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="font-semibold text-zinc-950">
                  {announcement.title}
                </h2>
                <span className="text-xs text-zinc-500">
                  {announcement.createdAt}
                </span>
              </div>
              <p className="text-sm leading-6 text-zinc-600">{announcement.body}</p>
            </article>
          ))
        ) : (
          <EmptyState text="No announcements" />
        )}
      </div>
    </div>
  );
}

function StudentCabinet({
  announcements,
  exams,
  leaderboard,
  selectedStudent,
  selectedStudentId,
  setSelectedStudentId,
  students,
}: {
  announcements: Announcement[];
  exams: Exam[];
  leaderboard: Student[];
  selectedStudent: Student;
  selectedStudentId: number;
  setSelectedStudentId: (value: number) => void;
  students: Student[];
}) {
  const studentResults = exams
    .map((exam) => ({
      exam,
      score: exam.results[selectedStudent.id],
    }))
    .filter((item) => item.score !== undefined);
  const rank =
    leaderboard.findIndex((student) => student.id === selectedStudent.id) + 1;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-500">Viewing as</div>
            <h2 className="mt-1 text-xl font-semibold text-zinc-950">
              {selectedStudent.name}
            </h2>
          </div>
          <select
            className="h-10 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-teal-500"
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(Number(event.target.value))}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Metric icon="id" label="Student ID" value={selectedStudent.code} />
        <Metric icon="medal" label="Rank" value={`#${rank}`} />
        <Metric
          icon="chart"
          label="Average"
          value={`${selectedStudent.averageScore || 0}%`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 p-4">
            <h2 className="text-base font-semibold">Results</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {studentResults.length ? (
              studentResults.map(({ exam, score }) => (
                <div
                  key={exam.id}
                  className="grid gap-2 p-4 md:grid-cols-[1fr_120px_1fr] md:items-center"
                >
                  <div>
                    <div className="font-medium text-zinc-950">{exam.title}</div>
                    <div className="text-sm text-zinc-500">{exam.date}</div>
                  </div>
                  <div className="font-semibold text-zinc-950">
                    {score}/{exam.maxScore}
                  </div>
                  <div className="h-2 overflow-hidden rounded-md bg-zinc-100">
                    <div
                      className="h-full rounded-md bg-teal-600"
                      style={{ width: `${(score / exam.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4">
                <EmptyState text="No results yet" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <h2 className="mb-4 text-base font-semibold">Leaderboard</h2>
            <div className="space-y-2">
              {leaderboard.map((student, index) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                    student.id === selectedStudent.id
                      ? "bg-teal-50 text-teal-900"
                      : "bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <span className="font-semibold">{student.averageScore}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <h2 className="mb-4 text-base font-semibold">News</h2>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <article key={announcement.id} className="border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                  <div className="text-sm font-semibold text-zinc-950">
                    {announcement.title}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {announcement.createdAt}
                  </div>
                  <p className="mt-2 text-sm leading-5 text-zinc-600">
                    {announcement.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
