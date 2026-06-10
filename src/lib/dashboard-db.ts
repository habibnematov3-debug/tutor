import {
  type Announcement,
  type DashboardData,
  demoDashboardData,
  type Exam,
  type Payment,
  type Student,
} from "@/lib/app-data";
import { DEMO_TEACHER_ID, getSupabaseAdmin } from "@/lib/supabase-admin";

type StudentRow = {
  id: number;
  student_code: string;
  full_name: string;
  phone: string;
  group_name: string;
  joined_at: string;
  balance: number;
  paid_until: string;
  status: Student["status"];
  average_score: number;
};

type PaymentRow = {
  id: number;
  student_id: number;
  amount: number;
  month: string;
  status: Payment["status"];
  channel: Payment["channel"];
  submitted_at: string;
};

type ExamRow = {
  id: number;
  title: string;
  date: string;
  max_score: number;
};

type ExamResultRow = {
  exam_id: number;
  student_id: number;
  score: number;
};

type AnnouncementRow = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

export type CreateStudentInput = {
  fullName: string;
  phone: string;
  groupName: string;
};

export type RecordScoreInput = {
  studentId: number;
  title: string;
  score: number;
};

export type PublishAnnouncementInput = {
  title: string;
  body: string;
};

function toDate(value: string) {
  return value.slice(0, 10);
}

function toSubmittedAt(value: string) {
  return value.replace("T", " ").slice(0, 16);
}

function currentMonthLabel() {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function currentMonthEnd() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);
}

function assertNoError(error: unknown) {
  if (error) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String(error.message)
        : "Supabase request failed.";
    throw new Error(message);
  }
}

async function loadDashboardDataFromSupabase(): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();

  const [studentsResult, paymentsResult, examsResult, announcementsResult] =
    await Promise.all([
      supabase
        .from("students")
        .select(
          "id, student_code, full_name, phone, group_name, joined_at, balance, paid_until, status, average_score",
        )
        .eq("teacher_id", DEMO_TEACHER_ID)
        .order("id", { ascending: true }),
      supabase
        .from("payments")
        .select("id, student_id, amount, month, status, channel, submitted_at")
        .eq("teacher_id", DEMO_TEACHER_ID)
        .order("submitted_at", { ascending: false }),
      supabase
        .from("exams")
        .select("id, title, date, max_score")
        .eq("teacher_id", DEMO_TEACHER_ID)
        .order("date", { ascending: false }),
      supabase
        .from("announcements")
        .select("id, title, body, created_at")
        .eq("teacher_id", DEMO_TEACHER_ID)
        .order("created_at", { ascending: false }),
    ]);

  assertNoError(studentsResult.error);
  assertNoError(paymentsResult.error);
  assertNoError(examsResult.error);
  assertNoError(announcementsResult.error);

  const examRows = (examsResult.data ?? []) as ExamRow[];
  const examIds = examRows.map((exam) => exam.id);

  let resultRows: ExamResultRow[] = [];
  if (examIds.length > 0) {
    const examResultsResult = await supabase
      .from("exam_results")
      .select("exam_id, student_id, score")
      .in("exam_id", examIds);

    assertNoError(examResultsResult.error);
    resultRows = (examResultsResult.data ?? []) as ExamResultRow[];
  }

  const students: Student[] = ((studentsResult.data ?? []) as StudentRow[]).map(
    (student) => ({
      id: student.id,
      code: student.student_code,
      name: student.full_name,
      phone: student.phone,
      group: student.group_name,
      joinedAt: toDate(student.joined_at),
      balance: Number(student.balance),
      paidUntil: toDate(student.paid_until),
      status: student.status,
      averageScore: Number(student.average_score),
    }),
  );

  const payments: Payment[] = ((paymentsResult.data ?? []) as PaymentRow[]).map(
    (payment) => ({
      id: payment.id,
      studentId: payment.student_id,
      amount: Number(payment.amount),
      month: payment.month,
      status: payment.status,
      channel: payment.channel,
      submittedAt: toSubmittedAt(payment.submitted_at),
    }),
  );

  const exams: Exam[] = examRows.map((exam) => ({
    id: exam.id,
    title: exam.title,
    date: toDate(exam.date),
    maxScore: Number(exam.max_score),
    results: resultRows
      .filter((result) => result.exam_id === exam.id)
      .reduce<Record<number, number>>((acc, result) => {
        acc[result.student_id] = Number(result.score);
        return acc;
      }, {}),
  }));

  const announcements: Announcement[] = (
    (announcementsResult.data ?? []) as AnnouncementRow[]
  ).map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    body: announcement.body,
    createdAt: toDate(announcement.created_at),
  }));

  return {
    students,
    payments,
    exams,
    announcements,
    isConnected: true,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    return await loadDashboardDataFromSupabase();
  } catch (error) {
    return {
      ...demoDashboardData,
      connectionError:
        error instanceof Error
          ? error.message
          : "Could not connect to Supabase.",
    };
  }
}

export async function createStudent(input: CreateStudentInput) {
  const supabase = getSupabaseAdmin();
  const { count, error: countError } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("teacher_id", DEMO_TEACHER_ID);

  assertNoError(countError);

  const nextNumber = (count ?? 0) + 1;
  const studentCode = `ENG-2026-${String(nextNumber).padStart(3, "0")}`;

  const { error } = await supabase.from("students").insert({
    teacher_id: DEMO_TEACHER_ID,
    student_code: studentCode,
    full_name: input.fullName,
    phone: input.phone,
    group_name: input.groupName,
    balance: 500000,
    paid_until: currentMonthEnd(),
    status: "trial",
    average_score: 0,
  });

  assertNoError(error);
}

export async function approvePayment(paymentId: number) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("payments")
    .update({ status: "approved" })
    .eq("id", paymentId)
    .eq("teacher_id", DEMO_TEACHER_ID)
    .select("student_id")
    .single();

  assertNoError(error);

  const studentId = Number(data?.student_id);
  if (!studentId) {
    throw new Error("Payment was not found.");
  }

  const { error: studentError } = await supabase
    .from("students")
    .update({
      balance: 0,
      status: "active",
      paid_until: currentMonthEnd(),
    })
    .eq("id", studentId)
    .eq("teacher_id", DEMO_TEACHER_ID);

  assertNoError(studentError);
}

export async function recordScore(input: RecordScoreInput) {
  const supabase = getSupabaseAdmin();
  const score = Math.max(0, Math.min(100, Math.round(input.score)));

  const { data: exam, error: examError } = await supabase
    .from("exams")
    .insert({
      teacher_id: DEMO_TEACHER_ID,
      title: input.title || "Weekly checkpoint",
      date: new Date().toISOString().slice(0, 10),
      max_score: 100,
    })
    .select("id")
    .single();

  assertNoError(examError);

  const examId = Number(exam?.id);
  if (!examId) {
    throw new Error("Exam was not created.");
  }

  const { error: resultError } = await supabase.from("exam_results").insert({
    exam_id: examId,
    student_id: input.studentId,
    score,
  });

  assertNoError(resultError);

  const { data: student, error: studentFetchError } = await supabase
    .from("students")
    .select("average_score")
    .eq("id", input.studentId)
    .eq("teacher_id", DEMO_TEACHER_ID)
    .single();

  assertNoError(studentFetchError);

  const previousAverage = Number(student?.average_score ?? 0);
  const nextAverage =
    previousAverage === 0 ? score : Math.round((previousAverage + score) / 2);

  const { error: updateError } = await supabase
    .from("students")
    .update({ average_score: nextAverage })
    .eq("id", input.studentId)
    .eq("teacher_id", DEMO_TEACHER_ID);

  assertNoError(updateError);
}

export async function publishAnnouncement(input: PublishAnnouncementInput) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("announcements").insert({
    teacher_id: DEMO_TEACHER_ID,
    title: input.title,
    body: input.body,
  });

  assertNoError(error);
}

export async function createPendingPaymentFromTelegram(input: {
  studentCode: string;
  amount?: number;
  receiptUrl?: string;
  telegramUserId?: number;
}) {
  const supabase = getSupabaseAdmin();
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("teacher_id", DEMO_TEACHER_ID)
    .eq("student_code", input.studentCode)
    .single();

  assertNoError(studentError);

  const studentId = Number(student?.id);
  if (!studentId) {
    throw new Error("Student code was not found.");
  }

  const { error } = await supabase.from("payments").insert({
    teacher_id: DEMO_TEACHER_ID,
    student_id: studentId,
    amount: input.amount ?? 500000,
    month: currentMonthLabel(),
    status: "pending",
    channel: "Telegram",
    receipt_url: input.receiptUrl ?? null,
    telegram_user_id: input.telegramUserId ?? null,
  });

  assertNoError(error);
}
