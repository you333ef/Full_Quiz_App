'use client';

import React, { useEffect, useState } from 'react';
import { Database, CalendarDays, Users, ChevronRight } from 'lucide-react';
import { BsFillAlarmFill } from 'react-icons/bs';
import Quiz_ConFirm from '@/app/Shared_component/Quiz_ConFirm';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ViewConfirm_Quiz from '@/app/Shared_component/View_Quiz';
import HeadlessDemo from '@/app/Shared_component/Confirmation';
// Variable  Colors
const COLORS = {
  background: '#F8F9FA',
  foreground: '#0F172A',
  muted: '#6B7280',
  cardBg: '#FFFFFF',
  cardBorder: '#E6E9EF',
  quizPrimary: '#4F46E5',
  quizPrimaryLight: '#EEF2FF',
  quizSecondary: '#E8F0FF',
  quizSuccess: '#16A34A',
  quizSuccessLight: '#DCFCE7',
  destructive: '#EF4444',
  destructiveLight: '#FEE2E2',
  quizWarning: '#F59E0B',
  quizWarningLight: '#FFFBEB',
  tableHeaderBg: '#F1F5F9',
  iconColor: 'rgba(13, 19, 33, 1)',
  iconBg: 'rgba(13, 19, 33, 0.1)',
};

//  Helpers (pure functions outside component to avoid re-creation) 
function formatDate(isoString?: string | null) {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'N/A';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatTime(isoString?: string | null) {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getStatusStyle(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'open':
      return { backgroundColor: COLORS.quizSuccessLight, color: COLORS.quizSuccess, borderColor: `${COLORS.quizSuccess}33` } as React.CSSProperties;
    case 'closed':
      return { backgroundColor: COLORS.destructiveLight, color: COLORS.destructive, borderColor: `${COLORS.destructive}33` } as React.CSSProperties;
    case 'pending':
      return { backgroundColor: COLORS.quizWarningLight, color: COLORS.quizWarning, borderColor: `${COLORS.quizWarning}33` } as React.CSSProperties;
    default:
      return { backgroundColor: COLORS.quizSecondary, color: COLORS.foreground, borderColor: COLORS.cardBorder } as React.CSSProperties;
  }
}

//  Simple presentational components (explicit props, no spread, no forwardRef/memo) 
const Card: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void; children?: React.ReactNode }> = ({ className = '', style, onClick, children }) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: COLORS.cardBg,
    color: COLORS.foreground,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  };
  return (
    <div className={`${className}`} style={{ ...baseStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
};

const Badge: React.FC<{ styleBadge?: React.CSSProperties; onClick?: () => void; children?: React.ReactNode }> = ({ styleBadge, onClick, children }) => (
  <div
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 9999,
      padding: '4px 8px',
      fontSize: 12,
      fontWeight: 600,
      border: `1px solid ${COLORS.cardBorder}`,
      ...styleBadge,
    }}
  >
    {children}
  </div>
);

const IconButton: React.FC<{ onClick?: () => void; title?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ onClick, title, className = '', style, children }) => (
  <button onClick={onClick} title={title} className={className} style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0, ...style }}>
    {children}
  </button>
);

// Table wrapper - use native table elements directly in markup to keep structure obvious for a junior reader
const TableWrapper: React.FC<{ children?: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div className={`relative w-full overflow-auto ${className}`} style={style}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
  </div>
);

// ===== Simple API hook localized in this file to separate API logic from UI =====
const useQuizApi = (token: string | null) => {
  const base = 'https://upskilling-egypt.com:3005/api/quiz';

  const getIncoming = async () => {
    if (!token) return [];
    const res = await axios.get(`${base}/incomming`, { headers: { Authorization: `Bearer ${token}` } });
    return res.data || [];
  };

  const getCompleted = async () => {
    if (!token) return [];
    const res = await axios.get(`${base}/completed`, { headers: { Authorization: `Bearer ${token}` } });
    return res.data || [];
  };

  const getById = async (id: string) => {
    if (!token) return null;
    const res = await axios.get(`${base}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  };

  const createQuiz = async (payload: any) => {
    if (!token) throw new Error('Not authenticated');
    const res = await axios.post(base, payload, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  };

  const deleteQuiz = async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await axios.delete(`${base}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  };

  return { getIncoming, getCompleted, getById, createQuiz, deleteQuiz };
};

//  Main page (single RAFCE component) 
const Page: React.FC = () => {
  // clearer state names
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState<any>(null);
  const [createdQuiz, setCreatedQuiz] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewQuiz, setViewQuiz] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [quizList, setQuizList] = useState<any[]>([]);
  const [completedList, setCompletedList] = useState<any[]>([]);
  const [quizToDeleteId, setQuizToDeleteId] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const api = useQuizApi(token);

  // load token once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = localStorage.getItem('token');
    if (t) setToken(t);
    else
      toast.error('No token found. Please log in again.', {
        style: { background: '#000', color: '#fff' },
      });
  }, []);

  // fetch lists when token available
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    (async () => {
      try {
        const [incoming, completed] = await Promise.all([api.getIncoming(), api.getCompleted()]);
        if (!mounted) return;
        setQuizList(incoming || []);
        setCompletedList(completed || []);
      } catch (e) {
        console.error('Error fetching quizzes', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  // polling for completed quizzes every 10s (kept simple)
  useEffect(() => {
    if (!token) return;
    const id = setInterval(async () => {
      try {
        const completed = await api.getCompleted();
        setCompletedList(completed || []);
      } catch (e) {
        console.error('Polling failed', e);
      }
    }, 10000);
    return () => clearInterval(id);
  }, [token]);

  // Create quiz handler
  async function handleCreate(data: any) {
    if (!token) {
      toast.error('Not authenticated', { style: { background: '#000', color: '#fff' } });
      return;
    }

    try {
      const res = await api.createQuiz(data);
      setCreatedQuiz(res);
      toast.success(res?.message ?? 'Quiz created', { style: { background: '#000', color: '#fff' } });

      const quizSchedule = new Date(data.schadule);
      const now = new Date();
      if (isNaN(quizSchedule.getTime())) {
        toast.error('Invalid quiz schedule date', { style: { background: '#000', color: '#fff' } });
        return;
      }

      if (quizSchedule < now) {
        // closed immediately
        setCompletedList((prev) => [...prev, { ...res, status: 'Closed', date: formatDate(data.schadule) }]);
      } else {
        setQuizList((prev) => [...prev, { ...res, schadule: data.schadule }]);
      }

      // refresh lists (best-effort)
      try {
        const [incoming, completed] = await Promise.all([api.getIncoming(), api.getCompleted()]);
        setQuizList(incoming || []);
        setCompletedList(completed || []);
      } catch (e) {
        // ignore
      }

      setIsCreateOpen(false);
    } catch (error: any) {
      console.error('Create Quiz Error:', error?.response?.data || error?.message);
      toast.error(error?.response?.data?.message ?? 'Failed To Create Quiz', { style: { background: '#000', color: '#fff' } });
    }
  }

  // View quiz
  async function handleView(id?: string) {
    if (!id) return;
    if (!token) {
      toast.error('Not authenticated. Please log in again.', { style: { background: '#000', color: '#fff' } });
      return;
    }
    try {
      const res = await api.getById(id);
      setViewQuiz(res);
      setQuizToDeleteId(id);
      setIsViewOpen(true);
    } catch (error) {
      console.error('Error fetching quiz by id', error);
      toast.error('Failed to fetch quiz details', { style: { background: '#000', color: '#fff' } });
    }
  }

  function closeView() {
    setIsViewOpen(false);
    setViewQuiz(null);
  }

  // Delete flow (trigger UI flow, actual delete in DELETE handler)
  function confirmDeleteFlow() {
    if (!quizToDeleteId) return;
    setShowDeleteConfirm(false);
    // small hack kept from original logic to trigger confirmation modal
    setTimeout(() => {
      setShowDeleteConfirm(true);
      setIsViewOpen(false);
    }, 0);
  }

  async function deleteQuiz() {
    if (!token) {
      toast.error('Not authenticated', { style: { background: '#000', color: '#fff' } });
      return;
    }
    try {
      const res = await api.deleteQuiz(quizToDeleteId);
      toast.success(res?.message ?? 'Deleted', { style: { background: '#000', color: '#fff' } });
      // refresh lists
      try {
        const [incoming, completed] = await Promise.all([api.getIncoming(), api.getCompleted()]);
        setQuizList(incoming || []);
        setCompletedList(completed || []);
      } catch (e) {}
      setShowDeleteConfirm(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error In Deleting Quiz', { style: { background: '#000', color: '#fff' } });
    }
  }

  // render card (kept as plain function to keep file simple)
  function renderQuizCard(quiz: any, isPlaceholder: boolean = false) {
    const title = isPlaceholder ? 'Introduction to computer programming' : quiz?.title || 'Untitled Quiz';
    const participants = isPlaceholder ? 32 : quiz?.participants || 0;
    const status = isPlaceholder ? 'Open' : (quiz?.status ? String(quiz.status).charAt(0).toUpperCase() + String(quiz.status).slice(1) : 'N/A');

    return (
      <Card key={isPlaceholder ? 'placeholder' : quiz?._id} className="p-4" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 90, height: 90, borderRadius: 8, overflow: 'hidden', flexShrink: 0, backgroundColor: COLORS.quizSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/img_Computer.svg" alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" width={90} height={90} decoding="async" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontWeight: 600, color: COLORS.foreground, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}{isPlaceholder && <span style={{ fontWeight: 700 }}> Fake Data</span>}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 13, color: COLORS.muted }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarDays size={18} />
                  <span>{isPlaceholder ? '12/03/2023 | 09:00 AM' : quiz?.schadule ? `${formatDate(quiz.schadule)} | ${formatTime(quiz.schadule)}` : 'N/A'}</span>
                </div>
              </div>
              <div style={{ display: 'none' /* keep hidden for lg in original; simplified for junior code */ }}>
                <Users size={18} />
                <span>{`Group capacity: ${participants}`}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Badge
                onClick={isPlaceholder ? undefined : () => handleView(quiz?._id)}
                styleBadge={{ ...getStatusStyle(status), border: `1px solid ${getStatusStyle(status).borderColor || COLORS.cardBorder}` }}
              >
                {status}
              </Badge>
              <ChevronRight size={16} style={{ color: COLORS.muted }} />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <ToastContainer />

      <ViewConfirm_Quiz isOpen={isViewOpen} onClose={closeView} quiz={viewQuiz} onConfirm={confirmDeleteFlow} />
      {showDeleteConfirm && <HeadlessDemo DeleteTrue={deleteQuiz} Name={'This item'} />}

      <div style={{ minHeight: '100vh', backgroundColor: COLORS.background, padding: 12 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Desktop / main layout - kept simple and obvious for a junior dev */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Card className="p-6 cursor-pointer" onClick={() => setIsCreateOpen(true)} style={{ padding: 24, borderRadius: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                    <div style={{ padding: 16, borderRadius: 9999, backgroundColor: COLORS.iconBg }}>
                      <BsFillAlarmFill size={28} style={{ color: COLORS.iconColor }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.foreground }}>Set up a new quiz</h3>
                  </div>
                </Card>

                <Card className="p-6 cursor-pointer" onClick={() => console.log('Open question bank')} style={{ padding: 24, borderRadius: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                    <div style={{ padding: 16, borderRadius: 9999, backgroundColor: COLORS.iconBg }}>
                      <Database size={28} style={{ color: COLORS.iconColor }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.foreground }}>Question Bank</h3>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.foreground }}>Upcoming quizzes</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {quizList.length > 0 ? quizList.map((q) => renderQuizCard(q)) : renderQuizCard({}, true)}
                  </div>
                </div>

                <Card style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.foreground }}>Completed Quizzes</h2>
                  </div>

                  <div style={{ borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, overflow: 'hidden' }}>
                    <TableWrapper>
                      <thead style={{ backgroundColor: COLORS.tableHeaderBg }}>
                        <tr>
                          <th style={{ padding: 12, textAlign: 'center', color: COLORS.foreground }}>Title</th>
                          <th style={{ padding: 12, textAlign: 'center', color: COLORS.foreground }}>Status</th>
                          <th style={{ padding: 12, textAlign: 'center', color: COLORS.foreground }}>Group capacity</th>
                          <th style={{ padding: 12, textAlign: 'center', color: COLORS.foreground }}>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedList.map((cq, idx) => (
                          <tr key={idx} style={{ cursor: 'pointer' }}>
                            <td style={{ padding: 12, textAlign: 'center', color: COLORS.foreground, fontWeight: 500 }}>{cq?.title || 'N/A'}</td>
                            <td style={{ padding: 12, textAlign: 'center', color: COLORS.muted }}>{cq?.status || 'N/A'}</td>
                            <td style={{ padding: 12, textAlign: 'center', color: COLORS.muted }}>{cq?.participants ? `${cq.participants} persons` : 'N/A'}</td>
                            <td style={{ padding: 12, textAlign: 'center', color: COLORS.muted }}>{cq?.createdAt ? new Date(cq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </TableWrapper>
                  </div>

                </Card>

                <Quiz_ConFirm isOpen={isCreateOpen} onCancel={() => setIsCreateOpen(false)} onConfirm={handleCreate} initialData={null} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Page;
