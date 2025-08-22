'use client';
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, memo } from "react";
import { CalendarDays, Users, ChevronRight, Clock, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast as toastLib, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { differenceInDays, differenceInHours, differenceInMinutes, isAfter, isBefore } from "date-fns";
import { useForm } from "react-hook-form";
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

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, style, ...props }, ref) => (
  <input
    ref={ref}
    className={cn("flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
    style={{ border: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.cardBg, color: COLORS.foreground, ...style }}
    {...props}
  />
));
Input.displayName = "Input";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, style, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    style={{ color: COLORS.foreground, ...style }}
    {...props}
  />
));
Label.displayName = "Label"
// Simple useToast hook that maps the object style to react-toastify
const useToast = () => {
  const toast = (opts: { title?: string; description?: string; variant?: string }) => {
    const titlePart = opts.title ? String(opts.title) : '';
    const descPart = opts.description ? String(opts.description) : '';
    const content = titlePart && descPart ? (
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{titlePart}</div>
        <div style={{ fontSize: 13 }}>{descPart}</div>
      </div>
    ) : (titlePart || descPart || '');

    // Map variant to react-toastify types (destructive -> error)
    const type: 'info' | 'success' | 'warning' | 'error' | 'default' = opts.variant === 'destructive' ? 'error' : 'default';

    // show toast via react-toastify
    toastLib(content as any, { type });
  };

  return { toast };
};
// Join Quiz Confirmation Modal
interface JoinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { code: string }) => void;
}
const JoinQuizModal: React.FC<JoinQuizModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{ code: string }>();
  const handleModalSubmit = (data: { code: string }) => {
    onSubmit(data);
    reset();
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 400, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.foreground, marginBottom: 16 }}>Join Quiz</h2>
        <form onSubmit={handleSubmit(handleModalSubmit)}>
          <div style={{ marginBottom: 16 }}>
            <Label htmlFor="code" style={{ marginBottom: 8, display: 'block' }}>Quiz Code</Label>
            <Input
              id="code"
              {...register('code', { required: 'Quiz code is required' })}
              placeholder="Enter quiz code"
            />
            {errors.code && (
              <p style={{ color: COLORS.destructive, fontSize: 12, marginTop: 4 }}>{errors.code.message}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button style={{background:'#000',color:'#fff'}} type="submit">
              Join Quiz
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Dropdown Component
interface DropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  trigger: React.ReactNode;
}
const Dropdown: React.FC<DropdownProps> = ({ isOpen, onToggle, children, trigger }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }} data-dropdown>
      <div onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{ cursor: 'pointer' }} data-dropdown-trigger>
        {trigger}
      </div>
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: '#FFFFFF',
            color: '#000000',
            border: '1px solid #E6E9EF',
            borderRadius: 8,
            padding: 12,
            minWidth: 200,
            zIndex: 1000,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontSize: 14
          }}>
          {children}
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [tokenn, setTokenn] = useState<string | null>(null);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<any[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<any[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  // Toggle dropdown
  const toggleDropdown = (quizId: string) => {
    setOpenDropdowns(prev => ({"": false, ...prev, [quizId]: !prev[quizId]})); // keep it simple: toggle only clicked quiz
  };

  // Close dropdown when clicking outside (but ignore clicks inside dropdown)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) {
        setOpenDropdowns({});
        return;
      }
      if (target.closest('[data-dropdown]')) {
        // clicked inside some dropdown -> do not close
        return;
      }
      setOpenDropdowns({});
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get quiz timing status and display text
  const getQuizTimingInfo = (quizSchedule: string) => {
    const now = new Date();
    const quizDate = new Date(quizSchedule);

    if (isAfter(now, quizDate)) {
      // Quiz time has passed
      return {
        status: 'Warning',
        text: 'Warning',
        timeInfo: 'Quiz time has passed'
      };
    } else if (differenceInMinutes(quizDate, now) <= 5) {
      // Quiz is starting soon (within 5 minutes) - Join
      return {
        status: 'Join',
        text: 'Join',
        timeInfo: `Starting in ${differenceInMinutes(quizDate, now)} minute${differenceInMinutes(quizDate, now) !== 1 ? 's' : ''}`
      };
    } else {
      // Show time remaining (but label it as "Wait" until it's joinable)
      const daysLeft = differenceInDays(quizDate, now);
      const hoursLeft = differenceInHours(quizDate, now);
      const minutesLeft = differenceInMinutes(quizDate, now);

      if (daysLeft > 0) {
        return {
          status: 'Wait',
          text: 'Wait',
          timeInfo: `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`
        };
      } else if (hoursLeft > 0) {
        const remainingMinutes = minutesLeft - (hoursLeft * 60);
        return {
          status: 'Wait',
          text: 'Wait',
          timeInfo: `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} remaining`
        };
      } else {
        return {
          status: 'Wait',
          text: 'Wait',
          timeInfo: `${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} remaining`
        };
      }
    }
  };

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
      case "Wait":
        return { backgroundColor: COLORS.quizSuccessLight, color: COLORS.quizSuccess, borderColor: `${COLORS.quizSuccess}33` };
      case "Join":
        return { backgroundColor: COLORS.quizPrimaryLight, color: COLORS.quizPrimary, borderColor: `${COLORS.quizPrimary}33` };
      case "Warning":
        return { backgroundColor: COLORS.quizWarningLight, color: COLORS.quizWarning, borderColor: `${COLORS.quizWarning}33` };
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
        toast({
          title: "Authentication Error",
          description: "No token found. Please log in again.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Fetch upcoming quizzes
  const fetchUpcomingQuizzes = useCallback(async () => {
    if (!tokenn) return;
    try {
      const response = await axios.get('https://upskilling-egypt.com:3005/api/quiz/incomming',
         {
        headers: { Authorization: `Bearer ${tokenn}` },
      }
    );
      setUpcomingQuizzes(response.data || []);
    } catch (error) {
      console.log('Failed to fetch upcoming quizzes');
    }
  }, [tokenn]);

  // Fetch completed quizzes
  const fetchCompletedQuizzes = useCallback(async () => {
    if (!tokenn) return;
    try {
      const response = await axios.get('https://upskilling-egypt.com:3005/api/quiz/completed', {
        headers: { Authorization: `Bearer ${tokenn}` },
      });
      setCompletedQuizzes(response?.data || []);
    } catch (error) {
      console.log("Failed to fetch completed quizzes");
    }
  }, [tokenn]);

  const router=useRouter()
  // Join quiz function
  const joinQuiz = useCallback(async (data: { code: string }) => {
    if (!tokenn) {
      toast({
        title: "Authentication Error",
        description: "Not authenticated",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await axios.post('https://upskilling-egypt.com:3005/api/quiz/join', data, {
        headers: { Authorization: `Bearer ${tokenn}` },
      });
      toast({
        title: "Success",
        description: response?.data?.message || 'Successfully joined quiz',
      });
      
      setIsJoinModalOpen(false);
      router.push('/QuestionsPage')
 localStorage.setItem('DataQuiz',response.data.data.quiz)



      // Refresh data after joining
      await Promise.allSettled([fetchUpcomingQuizzes(), fetchCompletedQuizzes()]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Failed to join quiz',
        variant: "destructive",
      });
    }
  }, [tokenn, toast, fetchUpcomingQuizzes, fetchCompletedQuizzes]);

  // Initial data fetch
  useEffect(() => {
    if (tokenn) {
      Promise.allSettled([fetchUpcomingQuizzes(), fetchCompletedQuizzes()]);
    }
  }, [tokenn, fetchUpcomingQuizzes, fetchCompletedQuizzes]);

  // Periodic polling for data updates
  useEffect(() => {
    if (tokenn) {
      const interval = setInterval(() => {
        Promise.allSettled([fetchUpcomingQuizzes(), fetchCompletedQuizzes()]);
      }, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [tokenn, fetchUpcomingQuizzes, fetchCompletedQuizzes]);

  const renderQuizCard = useCallback((quiz: any, isPlaceholder: boolean = false) => {
    const timingInfo = quiz?.schadule ? getQuizTimingInfo(quiz.schadule) : { status: 'Wait', text: 'Wait', timeInfo: 'No schedule' };
    const quizId = isPlaceholder ? `placeholder-${Math.random().toString(36).slice(2, 9)}` : quiz._id;

    const handleBadgeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (timingInfo.status === 'Join' || timingInfo.status === 'Warning') {
        setIsJoinModalOpen(true);
      }
    };

    const handleDropdownToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (timingInfo.status === 'Wait') {
        toggleDropdown(quizId);
      }
    };

    return (
      <Card key={quizId} className="p-4" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 90, height: 90, borderRadius: 8, overflow: 'hidden', flexShrink: 0, backgroundColor: COLORS.quizSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/img_Computer.svg"
            alt={isPlaceholder ? "Introduction to computer programming" : quiz.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            width={90}
            height={90}
            decoding="async"
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontWeight: 600, color: COLORS.foreground, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isPlaceholder ? "Introduction to computer programming" : quiz.title || 'Untitled Quiz'}
                {isPlaceholder && <span style={{ fontWeight: 700 }}> Sample Data</span>}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {timingInfo.status === 'Wait' ? (
                <Dropdown
                  isOpen={openDropdowns[quizId] || false}
                  onToggle={() => toggleDropdown(quizId)}
                  trigger={
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                      onClick={handleDropdownToggle}
                    >
                      <Badge
                        styleBadge={{
                          ...getStatusStyle(timingInfo.status),
                          border: `1px solid ${getStatusStyle(timingInfo.status).borderColor || COLORS.cardBorder}`
                        }}
                      >
                        {timingInfo.text}
                      </Badge>
                      <ChevronDown size={16} style={{ color: COLORS.muted }} />
                    </div>
                  }
                >
                  <div style={{ padding: 8 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#000000' }}>Time Remaining:</p>
                    <p style={{ margin: '4px 0 0 0', color: '#000000' }}>{timingInfo.timeInfo}</p>
                  </div>
                </Dropdown>
              ) : (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  onClick={handleBadgeClick}
                >
                  <Badge
                    styleBadge={{
                      ...getStatusStyle(timingInfo.status),
                      border: `1px solid ${getStatusStyle(timingInfo.status).borderColor || COLORS.cardBorder}`
                    }}
                  >
                    {timingInfo.text}
                  </Badge>
                  <ChevronDown size={16} style={{ color: COLORS.muted }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }, [formatDate, formatTime, getStatusStyle, openDropdowns, toggleDropdown, getQuizTimingInfo]);

  return (
    <>
      {/* Ensure toast container present so react-toastify toasts show up */}
      <ToastContainer />
      <JoinQuizModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmit={joinQuiz}
      />

      <div style={{ minHeight: '100vh', backgroundColor: COLORS.background, padding: 5 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Mobile/Tablet Layout - Join Quiz Section at top */}
          <div className="block lg:hidden" style={{ marginBottom: 32 }}>
            <Card className="p-6 cursor-pointer" onClick={() => setIsJoinModalOpen(true)} style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                <div style={{ padding: 16, borderRadius: 9999, backgroundColor: COLORS.iconBg }}>
                  <Clock size={28} style={{ color: COLORS.iconColor }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.foreground }}>Join Quiz</h3>
              </div>
            </Card>
          </div>

          {/* Desktop Layout - Two sections side by side */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8">
            {/* Left Column: Join Quiz + Upcoming Quizzes */}
            <div>
              {/* Join Quiz Section - Desktop only */}
              <div style={{ marginBottom: 32 }}>
                <Card className="p-6 cursor-pointer" onClick={() => setIsJoinModalOpen(true)} style={{ borderRadius: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                    <div style={{ padding: 16, borderRadius: 9999, backgroundColor: COLORS.iconBg }}>
                      <Clock size={28} style={{ color: COLORS.iconColor }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.foreground }}>Join Quiz</h3>
                  </div>
                </Card>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.foreground, marginBottom: 16 }}>
                Upcoming Quizzes
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {upcomingQuizzes.length > 0 ? (
                  upcomingQuizzes.map((quiz) => renderQuizCard(quiz))
                ) : (
                  renderQuizCard({}, true)
                )}
              </div>
            </div>

            {/* Right Column: Completed Quizzes */}
            <div>
              {/* Add top margin to align with Upcoming Quizzes content */}
              <div style={{ marginTop: 88 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.foreground, marginBottom: 16 }}>
                  Completed Quizzes
                </h2>
                <Card className="">
                  <div style={{ borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, overflow: 'hidden' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ backgroundColor: COLORS.tableHeaderBg }}>
                          <TableHead style={{ textAlign: 'center' }}>Title</TableHead>
                          <TableHead style={{ textAlign: 'center' }}>Status</TableHead>
                          <TableHead style={{ textAlign: 'center' }}>Group Capacity</TableHead>
                          <TableHead style={{ textAlign: 'center' }}>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedQuizzes.map((quiz, idx) => (
                          <TableRow key={idx}>
                            <TableCell style={{ textAlign: 'center', color: COLORS.foreground, fontWeight: 500 }}>
                              {quiz?.title || 'N/A'}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {quiz?.status || 'N/A'}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              {quiz?.participants ? `${quiz.participants} persons` : 'N/A'}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
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
                </Card>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Stacked sections */}
          <div className="block lg:hidden">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Upcoming Quizzes */}
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.foreground, marginBottom: 16, textAlign: 'center' }}>
                  Upcoming Quizzes
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {upcomingQuizzes.length > 0 ? (
                    upcomingQuizzes.map((quiz) => renderQuizCard(quiz))
                  ) : (
                    renderQuizCard({}, true)
                  )}
                </div>
              </div>

              {/* Completed Quizzes */}
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.foreground, marginBottom: 16, textAlign: 'center' }}>
                  Completed Quizzes
                </h2>
                <Card className="">
                  <div style={{ }}>
                    {completedQuizzes.map((quiz, i) => (
                      <Card key={i} className="p-4" style={{ marginBottom: 5 }}>
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
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Group Capacity:</span>
                            <span style={{ fontWeight: 600, color: COLORS.foreground }}>{quiz.participants || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: COLORS.muted }}>Date:</span>
                            <span style={{ fontWeight: 600, color: COLORS.foreground }}>
                              {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short", 
                                year: "numeric",
                              }) : 'N/A'}
                            </span>
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
      </div>
    </>
  );
};

export default Page;
