import React, { useState } from 'react';
import { Note, Project } from '../../types';

interface NotesViewProps {
  notes: Note[];
  projects: Project[];
  onCreateNote: (note: Partial<Note>) => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  projects,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  const handleOpenCreate = () => {
    setTitle('');
    setContent('');
    setIsPinned(false);
    setProjectId('');
    setTagsInput('');
    setEditingNote(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsPinned(note.isPinned);
    setProjectId(note.projectId || '');
    setTagsInput(note.tags.join(', '));
    setIsNewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingNote) {
      onUpdateNote(editingNote.id, {
        title: title.trim(),
        content: content.trim(),
        isPinned,
        projectId: projectId || undefined,
        tags: parsedTags,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onCreateNote({
        title: title.trim(),
        content: content.trim(),
        isPinned,
        projectId: projectId || undefined,
        tags: parsedTags,
      });
    }

    setIsNewModalOpen(false);
  };

  const getProject = (pId?: string) => projects.find((p) => p.id === pId);

  const renderNoteCard = (note: Note) => {
    const proj = getProject(note.projectId);
    return (
      <div
        key={note.id}
        onClick={() => handleOpenEdit(note)}
        className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC] hover:border-[#65513B]/40 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-[#292820] group-hover:text-[#65513B] leading-tight">
              {note.title}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateNote(note.id, { isPinned: !note.isPinned });
              }}
              title={note.isPinned ? 'Unpin note' : 'Pin note'}
              className={`p-1 rounded hover:bg-[#F0EBE2] transition-colors cursor-pointer ${
                note.isPinned ? 'text-[#B98236]' : 'text-[#77766F] opacity-0 group-hover:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">push_pin</span>
            </button>
          </div>

          <p className="text-xs text-[#77766F] line-clamp-4 mt-2 leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
        </div>

        <div className="pt-2 border-t border-[#E8E4DC]/60 flex items-center justify-between text-[11px] text-[#77766F]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {proj && (
              <span className="flex items-center gap-1 bg-[#F0EBE2] px-1.5 py-0.5 rounded text-[#292820] font-medium">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: proj.color }}
                />
                {proj.name}
              </span>
            )}
            {note.tags.map((tag) => (
              <span key={tag} className="bg-[#F7F5F0] px-1 rounded text-[#77766F]">
                #{tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this note?')) onDeleteNote(note.id);
            }}
            className="text-[#77766F] hover:text-[#B45345] opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#292820] tracking-tight">
            Notes &amp; Ideas
          </h2>
          <p className="text-sm text-[#77766F] mt-0.5">
            Capture thoughts, architectural cheatsheets, and quick snippets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Note</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <span className="material-symbols-outlined text-[18px] text-[#77766F] absolute left-3 top-2.5">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by keyword or tag..."
          className="w-full h-9 pl-9 pr-4 rounded-xl bg-white border border-[#E8E4DC] text-xs text-[#292820] placeholder-[#77766F] outline-none focus:border-[#65513B]"
        />
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#77766F] flex items-center gap-1 px-1">
            <span className="material-symbols-outlined text-[16px] text-[#B98236]">push_pin</span>
            <span>Pinned Notes ({pinnedNotes.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map(renderNoteCard)}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      <div className="space-y-3">
        {pinnedNotes.length > 0 && (
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#77766F] px-1">
            Other Notes ({otherNotes.length})
          </h3>
        )}

        {otherNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherNotes.map(renderNoteCard)}
          </div>
        ) : pinnedNotes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-soft border border-[#E8E4DC] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F0EBE2] text-[#65513B] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292820]">No notes found</h3>
              <p className="text-xs text-[#77766F] mt-1 max-w-sm mx-auto">
                Save an idea, snippet, or meeting summary to keep it handy.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-[#65513B] text-white text-xs font-semibold hover:bg-[#493A2B] transition-colors cursor-pointer"
            >
              Create first note
            </button>
          </div>
        ) : null}
      </div>

      {/* Note Create / Edit Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsNewModalOpen(false)}
            className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal border border-[#E8E4DC] p-6 space-y-4 z-50 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="text-base font-bold text-[#292820]">
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="text-[#77766F] hover:text-[#292820] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">
                  Note Title <span className="text-[#B45345]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Docker Buildx Caching Cheatsheet"
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none focus:bg-white focus:border-[#65513B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">Content</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note, checklist, or instructions..."
                  className="w-full p-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none resize-none focus:bg-white focus:border-[#65513B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#292820] block mb-1">
                    Link to Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none cursor-pointer"
                  >
                    <option value="">No Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#292820] block mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Docker, Tips"
                    className="w-full h-9 px-3 rounded-lg bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNote"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-[#65513B] cursor-pointer"
                />
                <label htmlFor="pinNote" className="text-xs text-[#292820] cursor-pointer">
                  Pin this note to top
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E4DC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#77766F] hover:bg-[#F0EBE2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#65513B] text-white text-xs font-semibold hover:bg-[#493A2B] cursor-pointer"
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
