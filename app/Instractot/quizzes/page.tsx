'use client';

import React, { useEffect, useState, useCallback, memo } from "react";
import { Database, CalendarDays, Users, ChevronRight } from "lucide-react";
import { BsFillAlarmFill } from 'react-icons/bs';
import Quiz_ConFirm from "@/app/Shared_component/Quiz_ConFirm";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ViewConfirm_Quiz from "@/app/Shared_component/View_Quiz";
import HeadlessDemo from "@/app/Shared_component/Confirmation";

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
  iconBg: 'rgba(13, 19, 33, 0.1)'
};

function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ').trim();
}

const Card = memo(React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg shadow-sm", className)}
    style={{ backgroundColor: COLORS.cardBg, color: COLORS.foreground, border: `1px solid ${COLORS.cardBorder}`, ...style }}
    {...props}
  />
)));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-4", className)} style={style} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, style, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-xl font-semibold", className)} style={{ color: COLORS.foreground, ...style }} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} style={style} {...props} />
));
CardContent.displayName = "CardContent";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  styleBadge?: React.CSSProperties;
}
const Badge = ({ children, className, styleBadge, ...props }: BadgeProps) => (
  <div
    className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}
    style={{ border: `1px solid ${COLORS.cardBorder}`, ...styleBadge }}
    {...props}
  >
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, variant = 'default', size = 'md', style, className, ...props }, ref) => {
const sizeStyle: React.CSSProperties = size === 'sm' ? { padding: '6px 10px', fontSize: 13 } : size === 'lg' ? { padding: '10px 20px', fontSize: 16 } : { padding: '8px 14px', fontSize: 14 };
const variantStyle: React.CSSProperties =
variant === 'ghost'
? { backgroundColor: 'transparent', color: COLORS.quizPrimary, border: 'none' }
: variant === 'outline'
? { backgroundColor: 'transparent', color: COLORS.foreground, border: `1px solid ${COLORS.cardBorder}` }
: { backgroundColor: COLORS.quizPrimary, color: '#fff', border: `1px solid ${COLORS.quizPrimary}` };

  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center gap-2 rounded-md", className)}
      style={{ cursor: 'pointer', ...sizeStyle, ...variantStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, style, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} style={style} {...props} />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("transition-colors", className)} {...props} />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, style, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium", className)} style={{ color: COLORS.foreground, ...style }} {...props} />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, style, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle", className)} style={{ color: COLORS.muted, ...style }} {...props} />
));
TableCell.displayName = "TableCell";
const Page = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [Edit, setEdit] = useState<any>(null);
  const [Create, setCreate] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dataView, setDataView] = useState<any>(null);
  const [tokenn, setTokenn] = useState<string | null>(null);
  const [SAVE_ALL, setSave_All] = useState<any[]>([]);
  const [completedQuizzes, setcompletedQuizzes] = useState<any[]>([]);
  const [id_TO_Delete, setId_To_Delete] = useState<string>('');
  const [status_Confirm, SetStauts_Confirm] = useState(false);
  const handleCancel = () => setIsConfirmationOpen(false)
  // Format helpers
  const formatDate = useCallback((isoString: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const formatTime = useCallback((isoString: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }, []);

  const getStatusStyle = useCallback((s: string): React.CSSProperties => {
    switch (s) {
      case "Open":
        return { backgroundColor: COLORS.quizSuccessLight, color: COLORS.quizSuccess, borderColor: `${COLORS.quizSuccess}33` };
      case "Closed":
        return { backgroundColor: COLORS.destructiveLight, color: COLORS.destructive, borderColor: `${COLORS.destructive}33` };
      case "Pending":
        return { backgroundColor: COLORS.quizWarningLight, color: COLORS.quizWarning, borderColor: `${COLORS.quizWarning}33` };
      default:
        return { backgroundColor: COLORS.quizSecondary, color: COLORS.foreground, borderColor: COLORS.cardBorder };
    }
  }, []);

  // Token retrieval
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('token');
      if (t) {
        setTokenn(t);
      } else {
        toast.error('No token found. Please log in again.', {
          style: { background: '#000', color: '#fff' },
        });
      }
    }
  }, []);

  // Combined data fetching
  const Fun_Get_All = useCallback(async () => {
    if (!tokenn) return;
    try {
      const response = await axios.get('https://upskilling-egypt.com:3005/api/quiz/incomming', {
        headers: { Authorization: `Bearer ${tokenn}` },
      });
      setSave_All(response.data || []);
    } catch (error) {
      console.log('Get All Quizes Failed');
    }
  }, [tokenn]);

  const Get_Completed = useCallback(async () => {
    if (!tokenn) return;
    try {
      const response = await axios.get('https://upskilling-egypt.com:3005/api/quiz/completed', {
        headers: { Authorization: `Bearer ${tokenn}` },
      });
      setcompletedQuizzes(response?.data || []);
    } catch (error) {
      console.log("Error In Getting Complete");
    }
  }, [tokenn]);

  useEffect(() => {
    if (tokenn) {
      Promise.allSettled([Fun_Get_All(), Get_Completed()]);
    }
  }, [tokenn, Fun_Get_All, Get_Completed]);

  // Periodic polling for completed quizzes
  useEffect(() => {
    if (tokenn) {
      const interval = setInterval(() => {
        Get_Completed();
      }, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [tokenn, Get_Completed]);

  // Add quiz
const handleConfirm = useCallback(async (data: any) => {
  if (!tokenn) {
    toast.error('Not authenticated', { style: { background: '#000', color: '#fff' } });
    return;
  }
  try {
    const response = await axios.post('https://upskilling-egypt.com:3005/api/quiz', data, {
      headers: { Authorization: `Bearer ${tokenn}` },
    });
    console.log('API Response for Create Quiz:', response.data); // Log the response
    setCreate(response.data);
    toast.success(response?.data?.message ?? 'Success Creating Quiz', {
      style: { background: '#000', color: '#fff' },
    });

    // Validate schedule and update state
    const quizSchedule = new Date(data.schadule);
    const now = new Date();
    if (isNaN(quizSchedule.getTime())) {
      console.error('Invalid schedule date:', data.schadule);
      toast.error('Invalid quiz schedule date', { style: { background: '#000', color: '#fff' } });
      return;
    }

    if (quizSchedule < now) {
      setcompletedQuizzes((prev) => [...prev, { ...response.data, status: 'Closed', date: formatDate(data.schadule) }]);
    } else {
      setSave_All((prev) => [...prev, { ...response.data, schadule: data.schadule }]); // Ensure schedule is included
    }

    // Force refresh data from API
    await Promise.allSettled([Fun_Get_All(), Get_Completed()]);
    setIsConfirmationOpen(false);
  } catch (error: any) {
    console.error('Create Quiz Error:', error.response?.data || error.message);
    toast.error(error?.response?.data?.message ?? 'Failed To Create Quiz', {
      style: { background: '#000', color: '#fff' },
    });
  }
}, [tokenn, Fun_Get_All, Get_Completed, formatDate]);
  // View quiz
  const Get_id_To_View = useCallback(async (id: any) => {
    if (!tokenn || tokenn === 'null' || tokenn === 'undefined') {
      toast.error('Not authenticated. Please log in again.', { style: { background: '#000', color: '#fff' } });
      return;
    }
    try {
      const response = await axios.get(`https://upskilling-egypt.com:3005/api/quiz/${id}`, {
        headers: { Authorization: `Bearer ${tokenn}` },
      });
      setDataView(response.data);
      setId_To_Delete(id);
      setIsOpen(true);
    } catch (error: any) {
      console.log('Error in Fetching To View:', error);
      toast.error(error?.response?.data?.message ?? 'Failed to fetch quiz details', {
        style: { background: '#000', color: '#fff' },
      });
    }
  }, [tokenn]);

  const HandleView = useCallback((id: any) => {
    if (id) {
      Get_id_To_View(id);
    }
  }, [Get_id_To_View]);

  const handleCloseView = useCallback(() => {
    setIsOpen(false);
    setDataView(null);
  }, []);
  // Delete quiz
  const handleConfirmDelete = useCallback(() => {
    if (id_TO_Delete) {
      console.log(`DELETE QUIZ ${id_TO_Delete}`);
      SetStauts_Confirm(false);
      setTimeout(() => {
        SetStauts_Confirm(true);
        setIsOpen(false);
      }, 0);
    }
  }, [id_TO_Delete]);
  const DELETE_QUIZ = useCallback(async () => {
    if (!tokenn) {
      toast.error('Not authenticated', { style: { background: '#000', color: '#fff' } });
      return;
    }
    try {
      const response = await axios.delete(
        `https://upskilling-egypt.com:3005/api/quiz/${id_TO_Delete}`,
        { headers: { Authorization: `Bearer ${tokenn}` } }
      );
      toast.success(response?.data?.message, {
        style: { background: "#000", color: "#fff" },
      });
      await Promise.allSettled([Fun_Get_All(), Get_Completed()]);
      SetStauts_Confirm(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error In Deleting Quiz", {
        style: { background: "#000", color: "#fff" },
      });
    }
  }, [id_TO_Delete, tokenn, Fun_Get_All, Get_Completed]);
  const renderQuizCard = useCallback((quiz: any, isPlaceholder: boolean = false) => (
    <Card key={isPlaceholder ? 'placeholder' : quiz._id} className="p-4" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ width: 90, height: 90, borderRadius: 8, overflow: 'hidden', flexShrink: 0, backgroundColor: COLORS.quizSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {true ? (
          <img
            src="/img_Computer.svg"
            alt={isPlaceholder ? "Introduction to computer programming" : quiz.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            width={90}
            height={90}
            decoding="async"
          />
        ) : (
          <div style={{ fontWeight: 700, color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isPlaceholder ? 'I' : quiz.title?.charAt(0) || 'N/A'}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontWeight: 600, color: COLORS.foreground, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isPlaceholder ? "Introduction to computer programming" : quiz.title || 'Untitled Quiz'}
              {isPlaceholder && <span style={{ fontWeight: 700 }}> Fake Data</span>}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 13, color: COLORS.muted }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarDays size={18} />
                <span>{isPlaceholder ? "12/03/2023 | 09:00 AM" : quiz.schadule ? `${formatDate(quiz.schadule)} | ${formatTime(quiz.schadule)}` : 'N/A'}</span>
              </div>
            </div>
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 6, marginTop: 6, fontSize: 13, color: COLORS.muted }}>
              <Users size={18} />
              <span>{isPlaceholder ? "No. of student's enrolled: 32" : `Group capacity: ${quiz.participants || 0}`}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Badge
              onClick={isPlaceholder ? undefined : () => HandleView(quiz._id)}
              styleBadge={{
                ...getStatusStyle(isPlaceholder ? "Open" : quiz.status?.charAt(0).toUpperCase() + (quiz.status?.slice(1) || '')),
                border: `1px solid ${getStatusStyle(isPlaceholder ? "Open" : quiz.status?.charAt(0).toUpperCase() + (quiz.status?.slice(1) || '')).borderColor || COLORS.cardBorder}`
              }}
            >
              {isPlaceholder ? "Open" : quiz.status ? quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1) : 'N/A'}
            </Badge>
            <ChevronRight size={16} style={{ color: COLORS.muted }} />
          </div>
        </div>
      </div>
    </Card>
  ), [formatDate, formatTime, getStatusStyle, HandleView]);
  return (
    <>
    <ToastContainer/>
      <ViewConfirm_Quiz
        isOpen={isOpen}
        onClose={handleCloseView}
        quiz={dataView}
        onConfirm={handleConfirmDelete}
      />
      {status_Confirm && <HeadlessDemo DeleteTrue={DELETE_QUIZ} Name={'This item'} />}

      <div style={{ minHeight: '100vh', backgroundColor: COLORS.background, padding: 5 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8">
            <div className="col-span-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Card className="p-6 cursor-pointer" onClick={() => setIsConfirmationOpen(true)} style={{ borderRadius: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                    <div style={{ padding: 16, borderRadius: 9999, backgroundColor: COLORS.iconBg }}>
                      <BsFillAlarmFill size={28} style={{ color: COLORS.iconColor }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.foreground }}>Set up a new quiz</h3>
                  </div>
                </Card>
                <Card className="p-6 cursor-pointer" onClick={() => console.log("Open question bank")} style={{ borderRadius: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                    <div style={{ padding: 16, borderRadius: 9999, backgroundColor: COLORS.iconBg }}>
                      <Database size={28} style={{ color: COLORS.iconColor }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.foreground }}>Question Bank</h3>
                  </div>
                </Card>
              </div>
            </div>
            <div className="col-span-8">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.foreground }}>
                    Upcoming quizzes
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {SAVE_ALL.length > 0 ? (
                      SAVE_ALL.map((quiz) => renderQuizCard(quiz))
                    ) : (
                      renderQuizCard({}, true)
                    )}
                  </div>
                </div>
                <Card className="p-6" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2 className="text-center lg:text-left" style={{ fontSize: 18, fontWeight: 600, color: COLORS.foreground, width: '100%' }}>Completed Quizzes</h2>
                  </div>
                  <div className="hidden lg:block" style={{ borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, overflow: 'hidden' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ backgroundColor: COLORS.tableHeaderBg }}>
                          <TableHead style={{ color: COLORS.foreground, textAlign: 'center', justifyContent: 'center' }}>Title</TableHead>
                          <TableHead style={{ color: COLORS.foreground, textAlign: 'center', justifyContent: 'center' }}>Status</TableHead>
                          <TableHead style={{ color: COLORS.foreground, textAlign: 'center', justifyContent: 'center' }}>Group capacity</TableHead>
                          <TableHead style={{ color: COLORS.foreground, textAlign: 'center', justifyContent: 'center' }}>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedQuizzes.map((quiz, idx) => (
                          <TableRow key={idx} style={{ cursor: 'pointer' }}>
                            <TableCell style={{ color: COLORS.foreground, fontWeight: 500, textAlign: 'center', justifyContent: 'center' }}>
                              {quiz?.title || 'N/A'}
                            </TableCell>
                            <TableCell style={{ color: COLORS.muted, textAlign: 'center', justifyContent: 'center' }}>
                              {quiz?.status || 'N/A'}
                            </TableCell>
                            <TableCell style={{ color: COLORS.muted, textAlign: 'center', justifyContent: 'center' }}>
                              {quiz?.participants ? `${quiz.participants} persons` : 'N/A'}
                            </TableCell>
                            <TableCell style={{ color: COLORS.muted, textAlign: 'center', justifyContent: 'center' }}>
                              {quiz?.createdAt ? new Date(quiz.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }) : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="block lg:hidden" style={{ marginTop: 16 }}>
                    {completedQuizzes.map((quiz, i) => (
                      <Card key={i} className="p-4" style={{ marginBottom: 12 }}>
                        <div style={{ display: 'grid', gap: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Name:</span>
                            <span style={{ fontWeight: 600, color: COLORS.foreground }}>{quiz.title || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Status:</span>
                            <span style={{ color: COLORS.quizSuccess, fontWeight: 600 }}>{quiz.status || 'active'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Team Size:</span>
                            <span style={{ fontWeight: 600, color: COLORS.foreground }}>{quiz.participants || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Team:</span>
                            <span style={{ fontWeight: 600, color: COLORS.quizPrimary }}>{quiz.groupName || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Date:</span>
                            <span style={{ fontWeight: 600, color: COLORS.foreground }}>{quiz.date || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Type:</span>
                            <span style={{ fontWeight: 600, color: COLORS.quizPrimary }}>{quiz?.type || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Difficulty:</span>
                            <span style={{ fontWeight: 600, color: COLORS.foreground }}>{quiz?.difficulty || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Code:</span>
                            <span style={{ fontWeight: 600, color: COLORS.foreground, fontSize: 13 }}>{quiz?.code || 'N/A'}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
                <Quiz_ConFirm
                  isOpen={isConfirmationOpen}
                  onCancel={handleCancel}
                  onConfirm={handleConfirm}
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Card className="p-6 cursor-pointer" onClick={() => setIsConfirmationOpen(true)} style={{ borderRadius: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                  <div style={{ padding: 16, borderRadius: 9999, backgroundColor: COLORS.iconBg }}>
                    <BsFillAlarmFill size={28} style={{ color: COLORS.iconColor }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.foreground }}>Set up a new quiz</h3>
                </div>
              </Card>
              <Card className="p-6 cursor-pointer" onClick={() => console.log("Open question bank")} style={{ borderRadius: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                  <div style={{ padding: 16, borderRadius: 9999, backgroundColor: COLORS.iconBg }}>
                    <Database size={28} style={{ color: COLORS.iconColor }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.foreground }}>Question Bank</h3>
                </div>
              </Card>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <h2 className="text-center" style={{ fontSize: 20, fontWeight: 700, color: COLORS.foreground, marginBottom: 12 }}>Upcoming quizzes</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {SAVE_ALL.length > 0 ? (
                    SAVE_ALL.map((quiz) => renderQuizCard(quiz))
                  ) : (
                    renderQuizCard({}, true)
                  )}
                </div>
              </div>
              <Card className="p-6" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 className="text-center lg:text-left" style={{ fontSize: 18, fontWeight: 600, color: COLORS.foreground, width: '100%' }}>Completed Quizzes</h2>
                </div>
                <div className="hidden lg:block" style={{ borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, overflow: 'hidden' }}>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: COLORS.tableHeaderBg }}>
                        <TableHead style={{ color: COLORS.foreground, textAlign: 'center', justifyContent: 'center' }}>Title</TableHead>
                        <TableHead style={{ color: COLORS.foreground, textAlign: 'center', justifyContent: 'center' }}>Group name</TableHead>
                        <TableHead style={{ color: COLORS.foreground, textAlign: 'center', justifyContent: 'center' }}>No. of persons in group</TableHead>
                        <TableHead style={{ color: COLORS.foreground, textAlign: 'center', justifyContent: 'center' }}>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedQuizzes.map((quiz, idx) => (
                        <TableRow key={idx} style={{ cursor: 'pointer' }}>
                          <TableCell style={{ color: COLORS.foreground, fontWeight: 500, textAlign: 'center', justifyContent: 'center' }}>
                            {quiz.title || 'N/A'}
                          </TableCell>
                          <TableCell style={{ color: COLORS.muted, textAlign: 'center', justifyContent: 'center' }}>
                            {quiz.groupName || 'N/A'}
                          </TableCell>
                          <TableCell style={{ color: COLORS.muted, textAlign: 'center', justifyContent: 'center' }}>
                            {quiz.participants ? `${quiz.participants} persons` : 'N/A'}
                          </TableCell>
                          <TableCell style={{ color: COLORS.muted, textAlign: 'center', justifyContent: 'center' }}>
                            {quiz.date || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="block lg:hidden" style={{ marginTop: 16 }}>
                  {completedQuizzes.map((quiz, i) => (
                    <Card key={i} className="p-4" style={{ marginBottom: 12 }}>
                      <div style={{ display: 'grid', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: COLORS.muted }}>Name:</span>
                          <span style={{ fontWeight: 600, color: COLORS.foreground }}>{quiz.title || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: COLORS.muted }}>Status:</span>
                          <span style={{ color: COLORS.quizSuccess, fontWeight: 600 }}>{quiz.status || 'active'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: COLORS.muted }}>Team Size:</span>
                          <span style={{ fontWeight: 600, color: COLORS.foreground }}>{quiz.participants || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: COLORS.muted }}>Team:</span>
                          <span style={{ fontWeight: 600, color: COLORS.quizPrimary }}>{quiz.groupName || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: COLORS.muted }}>Type:</span>
                          <span style={{ fontWeight: 600, color: COLORS.quizPrimary }}>{quiz?.type || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: COLORS.muted }}>Difficulty:</span>
                          <span style={{ fontWeight: 600, color: COLORS.foreground }}>{quiz?.difficulty || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: COLORS.muted }}>Code:</span>
                          <span style={{ fontWeight: 600, color: COLORS.foreground, fontSize: 13 }}>{quiz?.code || 'N/A'}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Quiz_ConFirm
        isOpen={isConfirmationOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
           initialData={null}   
      />
    </>
  );
};

export default Page;