import { invoke } from "@tauri-apps/api/core";
import { homeDir } from "@tauri-apps/api/path";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PlusSignIcon,
  Delete02Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Note = {
  name: string; // filename without extension
  path: string; // full path
};

type Props = {
  tabId: number;
};

async function getNotesDir(): Promise<string> {
  const home = await homeDir();
  return `${home.replace(/\\/g, "/")}/.torch/notes`;
}

async function ensureNotesDir(dir: string): Promise<void> {
  await invoke("fs_create_dir", { path: dir, workspace: { kind: "local" } }).catch(() => {});
}

async function listNotes(dir: string): Promise<Note[]> {
  try {
    const entries = await invoke<{ name: string; kind: string }[]>(
      "fs_read_dir",
      { path: dir, showHidden: false, workspace: null }
    );
    return entries
      .filter((e) => e.kind === "file" && e.name.endsWith(".md"))
      .map((e) => ({
        name: e.name.replace(/\.md$/, ""),
        path: `${dir}/${e.name}`,  // ← construct path manually
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    console.error("listNotes error:", e);
    return [];
  }
}

async function readNote(path: string): Promise<string> {
  try {
    const res = await invoke<{ kind: string; content?: string }>("fs_read_file", {
      path,
      workspace: null,
    });
    return res.kind === "text" ? (res.content ?? "") : "";
  } catch {
    return "";
  }
}

async function writeNote(path: string, content: string): Promise<void> {
  await invoke("fs_write_file", { path, content, workspace: null });
}

async function deleteNote(path: string): Promise<void> {
  await invoke("fs_delete", { path, workspace: null });
}

export function NotesStack() {
  const [notesDir, setNotesDir] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Init notes dir
  useEffect(() => {
    getNotesDir().then(async (dir) => {
      await ensureNotesDir(dir);
      setNotesDir(dir);
      const found = await listNotes(dir);
      setNotes(found);
      if (found.length > 0) {
        setActiveNote(found[0]);
      }
    });
  }, []);

  // Load content when active note changes
  useEffect(() => {
    if (!activeNote) { setContent(""); return; }
    readNote(activeNote.path).then(setContent);
  }, [activeNote?.path]);

  // Auto-save on content change
  useEffect(() => {
    if (!activeNote) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      writeNote(activeNote.path, content).catch(console.error);
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [content, activeNote?.path]);

  const createNote = useCallback(async () => {
    if (!notesDir) return;
    const name = `Note ${Date.now()}`;
    const path = `${notesDir}/${name}.md`;
    await writeNote(path, "");
    const newNote = { name, path };
    setNotes((prev) => [...prev, newNote].sort((a, b) => a.name.localeCompare(b.name)));
    setActiveNote(newNote);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [notesDir]);

  const handleDeleteNote = useCallback(async (note: Note) => {
  console.log("deleting note path:", note.path);
  try {
    await deleteNote(note.path);
    setNotes((prev) => {
      const next = prev.filter((n) => n.path !== note.path);
      if (activeNote?.path === note.path) {
        setActiveNote(next[0] ?? null);
      }
      return next;
    });
  } catch (e) {
    console.error("delete failed:", e);
  }
}, [activeNote]);

  const handleRenameNote = useCallback(async (note: Note, newName: string) => {
    if (!notesDir || !newName.trim() || newName === note.name) return;
    const newPath = `${notesDir}/${newName.trim()}.md`;
    const currentContent = await readNote(note.path);
    await writeNote(newPath, currentContent);
    await deleteNote(note.path);
    const updated = { name: newName.trim(), path: newPath };
    setNotes((prev) =>
      prev.map((n) => (n.path === note.path ? updated : n))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    if (activeNote?.path === note.path) setActiveNote(updated);
  }, [notesDir, activeNote]);

  // Simple markdown to HTML for preview
  const renderMarkdown = (text: string): string => {
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[hpli])/gm, "")
      .replace(/^(.+)$/gm, (line) =>
        line.startsWith("<") ? line : `<p>${line}</p>`
      );
  };

  return (
    <div className="flex h-full w-full overflow-hidden rounded-lg">
      {/* Sidebar */}
      <div className="flex w-52 shrink-0 flex-col border-r border-border/60 bg-card">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
            onClick={createNote}
            title="New note"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={13} strokeWidth={2} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {notes.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              No notes yet.<br />Click + to create one.
            </div>
          )}
          {notes.map((note) => (
            <NoteItem
              key={note.path}
              note={note}
              isActive={activeNote?.path === note.path}
              onSelect={() => setActiveNote(note)}
              onDelete={() => handleDeleteNote(note)}
              onRename={(name) => handleRenameNote(note, name)}
            />
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        {activeNote ? (
          <>
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
              <span className="text-xs text-muted-foreground">{activeNote.name}.md</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowPreview((v) => !v)}
              >
                {showPreview ? "Edit" : "Preview"}
              </Button>
            </div>
            {showPreview ? (
              <div
                className="flex-1 overflow-y-auto px-6 py-4 prose prose-sm dark:prose-invert max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={cn(
                  "flex-1 resize-none bg-transparent px-6 py-4 text-sm text-foreground",
                  "outline-none placeholder:text-muted-foreground font-mono leading-relaxed",
                  "select-text"
                )}
                placeholder="Start writing..."
                spellCheck
              />
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center text-muted-foreground">
              <HugeiconsIcon icon={File01Icon} size={32} strokeWidth={1} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No note selected</p>
              <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={createNote}>
                Create your first note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteItem({
  note,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(note.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setEditValue(note.name);
      setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 0);
    }
  }, [editing, note.name]);

  const commit = () => {
    setEditing(false);
    onRename(editValue);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer",
        isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
      onClick={onSelect}
      onDoubleClick={() => setEditing(true)}
    >
      <HugeiconsIcon icon={File01Icon} size={13} strokeWidth={1.75} className="shrink-0" />
      {editing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 bg-background rounded px-1 text-xs text-foreground outline-none ring-1 ring-ring select-text"
        />
      ) : (
        <span className="flex-1 truncate text-xs">{note.name}</span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-destructive"
        title="Delete note"
      >
        <HugeiconsIcon icon={Delete02Icon} size={12} strokeWidth={1.75} />
      </button>
    </div>
  );
}