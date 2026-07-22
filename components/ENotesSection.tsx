'use client';

import { useState } from 'react';
import { RhemaStaffNote } from '@/types/supabase';

const categoryColors: Record<string, string> = {
  general: 'bg-blue-100 text-blue-700',
  student: 'bg-green-100 text-green-700',
  admin: 'bg-gray-100 text-gray-700',
  urgent: 'bg-red-100 text-red-700',
  announcement: 'bg-purple-100 text-purple-700',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  normal: 'bg-blue-50 text-blue-600',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

interface FileObj {
  name: string;
  url: string;
}

function parseFiles(file_urls: (string | FileObj)[] | undefined): FileObj[] {
  return (file_urls || []).map((f) => {
    if (typeof f === 'string') return { name: f.split('/').pop() || 'Download', url: f };
    return f;
  });
}

export default function ENotesSection({ notes }: { notes: RhemaStaffNote[] }) {
  const [selectedNote, setSelectedNote] = useState<RhemaStaffNote | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (notes.length === 0) return null;

  return (
    <>
      <section id="updates" className="py-16 bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Latest Updates
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Staff E-Notes & Announcements</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Stay informed with the latest announcements, updates, and important notices from our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {notes.map((note) => {
              const files = parseFiles(note.file_urls);

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer ${
                    note.is_pinned
                      ? 'border-amber-300 ring-2 ring-amber-100'
                      : 'border-gray-100'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {note.is_pinned && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                          </svg>
                          Pinned
                        </span>
                      )}
                      {note.category && (
                        <span className={`${categoryColors[note.category] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-semibold capitalize`}>
                          {note.category}
                        </span>
                      )}
                      {note.priority && note.priority !== 'normal' && (
                        <span className={`${priorityColors[note.priority] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-semibold capitalize`}>
                          {note.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-blue-900 mb-2 leading-snug">{note.title}</h3>

                  {/* Content preview */}
                  {note.content && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                      {note.content}
                    </p>
                  )}

                  {!note.content && <div className="flex-grow" />}

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag, i) => (
                        <span key={i} className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* File Downloads */}
                  {files.length > 0 && (
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Attachments</p>
                      <div className="space-y-1.5">
                        {files.map((file, i) => (
                          <a
                            key={i}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm group"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="truncate flex-grow">{file.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer: Author & Date */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    <span className="font-medium text-gray-500">{note.author}</span>
                    <span>{new Date(note.created_at).toISOString().split('T')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* E-Note Detail Modal */}
      {selectedNote && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => { setSelectedNote(null); setCopied(false); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
              <div className="flex flex-wrap gap-1.5 mr-4">
                {selectedNote.is_pinned && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                    </svg>
                    Pinned
                  </span>
                )}
                {selectedNote.category && (
                  <span className={`${categoryColors[selectedNote.category] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-semibold capitalize`}>
                    {selectedNote.category}
                  </span>
                )}
                {selectedNote.priority && selectedNote.priority !== 'normal' && (
                  <span className={`${priorityColors[selectedNote.priority] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-semibold capitalize`}>
                    {selectedNote.priority}
                  </span>
                )}
              </div>
              <button
                onClick={() => { setSelectedNote(null); setCopied(false); }}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5">
              <h2 className="text-2xl font-bold text-blue-900 mb-3">{selectedNote.title}</h2>

              <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
                <span className="font-medium text-gray-600">{selectedNote.author}</span>
                <span>&bull;</span>
                <span>{new Date(selectedNote.created_at).toISOString().split('T')[0]}</span>
              </div>

              {/* Tags */}
              {selectedNote.tags && selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {selectedNote.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content with Copy Button */}
              {selectedNote.content && (
                <div className="relative group">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-sm">
                    {selectedNote.content}
                  </div>
                  <button
                    onClick={() => handleCopy(selectedNote.content || '')}
                    className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm border border-gray-200'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* File Downloads */}
              {parseFiles(selectedNote.file_urls).length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-sm text-gray-500 font-semibold mb-3 uppercase tracking-wide">Attachments</p>
                  <div className="space-y-2">
                    {parseFiles(selectedNote.file_urls).map((file, i) => (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl transition-colors group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="flex-grow font-medium text-sm">{file.name}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => { setSelectedNote(null); setCopied(false); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
