"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { LeadStatusBadge } from "@/components/ui/LeadStatusBadge";
import { LeadSourceBadge } from "@/components/ui/LeadSourceBadge";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  createLeadNote,
  createTask,
  getLeadById,
  getLeadNotes,
  getTasks,
} from "@/lib/api";
import type { Lead, Note, Task, TaskPriority } from "@/types";

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("medium");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);
  const [isTaskSubmitting, setIsTaskSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [noteError, setNoteError] = useState("");
  const [taskError, setTaskError] = useState("");

  const leadTasks = useMemo(() => {
    return tasks.filter((task) => task.lead_id === leadId);
  }, [tasks, leadId]);

  async function loadLeadDetail() {
    try {
      setIsLoading(true);
      setError("");

      const [leadData, noteData, taskData] = await Promise.all([
        getLeadById(leadId),
        getLeadNotes(leadId),
        getTasks(),
      ]);

      setLead(leadData);
      setNotes(noteData);
      setTasks(taskData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load lead detail";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLeadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  async function handleCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!noteContent.trim()) {
      setNoteError("Note content is required");
      return;
    }

    try {
      setIsNoteSubmitting(true);
      setNoteError("");

      const newNote = await createLeadNote(leadId, noteContent.trim());

      setNotes((current) => [newNote, ...current]);
      setNoteContent("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create note";

      setNoteError(message);
    } finally {
      setIsNoteSubmitting(false);
    }
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lead) {
      return;
    }

    if (!taskTitle.trim()) {
      setTaskError("Task title is required");
      return;
    }

    if (!lead.assigned_to) {
      setTaskError("This lead has no assigned sales user.");
      return;
    }

    try {
      setIsTaskSubmitting(true);
      setTaskError("");

      const newTask = await createTask({
        lead_id: lead.id,
        title: taskTitle.trim(),
        description: taskDescription.trim() || null,
        assignee_id: lead.assigned_to,
        status: "todo",
        priority: taskPriority,
        deadline: taskDeadline || null,
      });

      setTasks((current) => [newTask, ...current]);
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("medium");
      setTaskDeadline("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create task";

      setTaskError(message);
    } finally {
      setIsTaskSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <Link
            href="/leads"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to leads
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Lead Detail
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View customer information, notes, and follow-up tasks.
          </p>
        </div>

        {isLoading ? (
          <LeadDetailLoadingState />
        ) : error ? (
          <LeadDetailErrorState message={error} />
        ) : lead ? (
          <>
            <LeadInfoCard lead={lead} />

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="space-y-4">
                <NoteForm
                  value={noteContent}
                  error={noteError}
                  isSubmitting={isNoteSubmitting}
                  onChange={setNoteContent}
                  onSubmit={handleCreateNote}
                />

                <NoteList notes={notes} />
              </section>

              <section className="space-y-4">
                <TaskForm
                  title={taskTitle}
                  description={taskDescription}
                  priority={taskPriority}
                  deadline={taskDeadline}
                  error={taskError}
                  isSubmitting={isTaskSubmitting}
                  onTitleChange={setTaskTitle}
                  onDescriptionChange={setTaskDescription}
                  onPriorityChange={setTaskPriority}
                  onDeadlineChange={setTaskDeadline}
                  onSubmit={handleCreateTask}
                />

                <TaskList tasks={leadTasks} />
              </section>
            </div>
          </>
        ) : null}
      </div>
    </AppLayout>
  );
}

function LeadInfoCard({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{lead.email || "No email"}</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{lead.phone}</p>
        </div>

        <div className="flex gap-2">
          <LeadSourceBadge source={lead.source} />
          <LeadStatusBadge status={lead.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <InfoItem label="Interest" value={lead.interest} />
        <InfoItem label="Budget" value={formatBudget(lead.budget)} />
        <InfoItem label="Assigned To" value={lead.assigned_to || "Unassigned"} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function NoteForm({
  value,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}: {
  value: string;
  error: string;
  isSubmitting: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Add Note</h2>
      <p className="mt-1 text-sm text-slate-500">
        Record customer conversation history.
      </p>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="Customer asked for payment policy..."
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Adding..." : "Add note"}
        </button>
      </form>
    </div>
  );
}

function NoteList({ notes }: { notes: Note[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Notes</h2>

      {notes.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No notes yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-800">{note.content}</p>
              <p className="mt-2 text-xs text-slate-500">
                {formatDateTime(note.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskForm({
  title,
  description,
  priority,
  deadline,
  error,
  isSubmitting,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDeadlineChange,
  onSubmit,
}: {
  title: string;
  description: string;
  priority: TaskPriority;
  deadline: string;
  error: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onDeadlineChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Create Follow-up Task
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Assign next action for this lead.
      </p>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="Send payment policy to customer"
        />

        <textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          placeholder="Explain timeline and bank loan support..."
        />

        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={priority}
            onChange={(event) =>
              onPriorityChange(event.target.value as TaskPriority)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <input
            type="date"
            value={deadline}
            onChange={(event) => onDeadlineChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Creating..." : "Create task"}
        </button>
      </form>
    </div>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Lead Tasks</h2>

      {tasks.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No follow-up tasks for this lead.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {task.title}
                  </p>
                  {task.description ? (
                    <p className="mt-1 text-sm text-slate-600">
                      {task.description}
                    </p>
                  ) : null}
                </div>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  {task.priority}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Status: {task.status}
                {task.deadline ? ` · Deadline: ${task.deadline}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadDetailLoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-700">
        Loading lead detail...
      </p>
    </div>
  );
}

function LeadDetailErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      {message}
    </div>
  );
}

function formatBudget(value: number | null) {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}