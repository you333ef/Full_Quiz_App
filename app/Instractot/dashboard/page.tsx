'use client'
import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";
import axios from "axios";

// Inline clsx function
type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
type ClassArray = ClassValue[];
type ClassDictionary = Record<string, any>;

function clsx(...inputs: ClassValue[]): string {
  let i = 0, tmp: ClassValue, x: string, str = '', len = inputs.length;
  for (; i < len; i++) {
    tmp = inputs[i];
    if (tmp) {
      if (typeof tmp === 'string' || typeof tmp === 'number') {
        str += ' ' + tmp;
      } else if (typeof tmp === 'object' && tmp !== null) {
        if (Array.isArray(tmp)) {
          x = clsx(...tmp);
          if (x) {
            str += ' ' + x;
          }
        } else {
          for (const key in tmp as ClassDictionary) {
            if (tmp[key]) {
              str += ' ' + key;
            }
          }
        }
      }
    }
  }
  return str.slice(1);
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Card Components
const CardInner = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-xl border border-[#f1f5f9] bg-[#ffffff] shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.02)]",
      className
    )}
    {...props}
  />
);
const Card = React.memo(CardInner) as typeof CardInner;

const CardHeaderInner = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-[20px_20px_16px_20px]", className)} {...props} />
);
const CardHeader = React.memo(CardHeaderInner) as typeof CardHeaderInner;

const CardTitleInner = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-lg font-medium leading-none tracking-tight",
      className
    )}
    {...props}
  />
);
const CardTitle = React.memo(CardTitleInner) as typeof CardTitleInner;

const CardContentInner = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-[0_20px_20px_20px]", className)} {...props} />
);
const CardContent = React.memo(CardContentInner) as typeof CardContentInner;

// Badge Component
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#1e293b] text-[#ffffff]",
        secondary: "border-[#e2e8f0] bg-[#f8fafc] text-[#475569]",
        destructive: "border-transparent bg-[#dc2626] text-[#ffffff]",
        outline: "border-[#e2e8f0] bg-transparent text-[#475569]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const BadgeInner = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);
const Badge = React.memo(BadgeInner) as typeof BadgeInner;

// Charts Component
const Charts = lazy(() =>
  import("recharts").then((mod) => {
    const PieChart = (props: any) => React.createElement(mod.PieChart, props);
    const Pie = (props: any) => React.createElement(mod.Pie, props);
    const Cell = (props: any) => React.createElement(mod.Cell, props);
    const TooltipComp = (props: any) => React.createElement(mod.Tooltip, props);
    const ResponsiveContainer = (props: any) => React.createElement(mod.ResponsiveContainer, props);
    const BarChart = (props: any) => React.createElement(mod.BarChart, props);
    const Bar = (props: any) => React.createElement(mod.Bar, props);
    const XAxis = (props: any) => React.createElement(mod.XAxis, props);
    const YAxis = (props: any) => React.createElement(mod.YAxis, props);
    const CartesianGrid = (props: any) => React.createElement(mod.CartesianGrid, props);

    return {
      default: function RechartsChunk({ difficultyData, Five }: any) {
        return (
     <>
  <Card className="bg-[#ffffff] border-[#f1f5f9] w-full min-w-0">
    <CardHeader className="m-auto">
      <CardTitle className="text-[18px] font-semibold flex items-center gap-3 text-[#1e293b]">
        <div className="w-1 h-5 bg-[#000] flex items-center justify-center rounded-sm" />
        Question Difficulty Stats
      </CardTitle>
    </CardHeader>
    <CardContent className="p-[0_20px_20px_20px]">
     
      <div
        className="flex flex-col items-center justify-center w-full min-w-0"
        style={{ height: "300px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={difficultyData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {difficultyData.map((entry: any, index: number) => {
                const raw = (entry?.color ?? "").toString().trim();
                const isColor =
                  typeof raw === "string" &&
                  (raw.startsWith("#") || raw.startsWith("rgb") || /^[a-zA-Z]+$/.test(raw));
                const fillColor = isColor
                  ? raw
                  : ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#64748b"][index % 5];
                return <Cell key={`cell-${index}`} fill={fillColor} />;
              })}
            </Pie>
            <TooltipComp content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        {difficultyData.map((item: any, index: number) => {
          const raw = (item?.color ?? "").toString().trim();
          const isColor =
            typeof raw === "string" &&
            (raw.startsWith("#") || raw.startsWith("rgb") || /^[a-zA-Z]+$/.test(raw));
          const legendColor = isColor
            ? raw
            : ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#64748b"][index % 5];
          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-[10px] h-[10px] rounded-full"
                style={{ backgroundColor: legendColor }}
              />
              <span className="text-[13px] text-[#64748b] font-medium">{item.name}</span>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>

  <Card className="bg-[#ffffff] border-[#f1f5f9] overflow-hidden min-w-0">
    <CardHeader className="m-auto">
      <CardTitle className="text-[18px] font-semibold flex items-center gap-3 text-[#1e293b]">
        <div className="w-1 h-5 bg-[#1e293b] rounded-sm" />
        Top five students
      </CardTitle>
    </CardHeader>
    <CardContent className="p-[0_20px_20px_20px]">
      <div className="w-full h-[300px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={Five.map((s: any) => ({
              name: `${s.first_name ?? ""}`.trim(),
              score: Number(s.avg_score ?? 0),
            }))}
            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.8} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tick={{ fill: "#64748b" }} />
            <YAxis stroke="#64748b" fontSize={12} tick={{ fill: "#64748b" }} />
            <TooltipComp content={<CustomTooltip />} />
            <Bar dataKey="score" fill="#1e293b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</>

        );
      },
    };
    
  })
  
);


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#ffffff] border border-[#e2e8f0] p-3 rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] text-[#1e293b]">
        <p className="font-semibold text-sm">{`${label}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#ffffff] border border-[#e2e8f0] p-3 rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] text-[#1e293b]">
        <p className="font-semibold text-sm">{`${payload[0].name}: ${payload[0].value} questions`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [data, setData] = useState({
    five: [],
    easy: [],
    medium: [],
    hard: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [fiveRes, easyRes, mediumRes, hardRes] = await Promise.all([
        axios.get("https://upskilling-egypt.com:3005/api/student/top-five", { headers }),
        axios.post("https://upskilling-egypt.com:3005/api/question/search?difficulty=easy", {}, { headers }),
        axios.post("https://upskilling-egypt.com:3005/api/question/search?difficulty=medium", {}, { headers }),
        axios.post("https://upskilling-egypt.com:3005/api/question/search?difficulty=hard", {}, { headers }),
      ]);
      setData({
        five: fiveRes.data,
        easy: easyRes.data,
        medium: mediumRes.data,
        hard: hardRes.data,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const difficultyData = useMemo(
    () => [
      { name: "Easy", value: data.easy.length, color: "#64748b" },
      { name: "Medium", value: data.medium.length, color: "#475569" },
      { name: "Hard", value: data.hard.length, color: "#334155" },
    ],
    [data.easy.length, data.medium.length, data.hard.length]
  );

  const chartsPlaceholder = useMemo(
    () => (
      <>
        <Card className="bg-[#ffffff] border-[#f1f5f9] overflow-hidden">
          <CardHeader className="p-[20px_20px_16px_20px]">
            <CardTitle className="text-[18px] font-semibold flex items-center gap-3 text-[#1e293b]">
              <div className="w-1 h-5 bg-[#64748b] rounded-sm" />
              Question Difficulty Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-[0_20px_20px_20px]">
            <div className="w-full h-[300px] bg-gray-100 animate-pulse" />
          </CardContent>
        </Card>
        <Card className="bg-[#ffffff] border-[#f1f5f9] overflow-hidden">
          <CardHeader className="p-[20px_20px_16px_20px]">
            <CardTitle className="text-[18px] font-semibold flex items-center gap-3 text-[#1e293b]">
              <div className="w-1 h-5 bg-[#1e293b] rounded-sm" />
              Top five students
            </CardTitle>
          </CardHeader>
          <CardContent className="p-[0_20px_20px_20px]">
            <div className="w-full h-[300px] bg-gray-100 animate-pulse" />
          </CardContent>
        </Card>
      </>
    ),
    []
  );

  return (
    <main className="min-h-screen bg-[#ffffff] p-0">
      <div className="  w-full" >
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-1 h-9 bg-[#1e293b] rounded-sm" />
            <h1 className="text-[2.25rem] font-bold text-[#1e293b] tracking-[-0.025em]">Dashboard</h1>
          </div>
          <p className="text-[#64748b] text-base font-normal ml-5">
            An overview of performance and metrics
          </p>
        </header>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-10">
          <Card className="bg-[#ffffff] border-[#f1f5f9] transition-all duration-200 relative">
            <CardHeader className="p-[20px_20px_16px_20px]">
              <CardTitle className="text-[#64748b] text-sm font-medium uppercase tracking-[0.05em]">
                Questions total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-[#1e293b]">{isLoading ? "..." : "45"}</div>
                <Badge variant="secondary" className="text-[12px] font-medium">
                  {isLoading ? "..." : "+12%"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ffffff] border-[#f1f5f9] transition-all duration-200">
            <CardHeader className="p-[20px_20px_16px_20px]">
              <CardTitle className="text-[#64748b] text-sm font-medium uppercase tracking-[0.05em]">
                Highest mark
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-[#1e293b]">{isLoading ? "..." : "95%"}</div>
                <Badge variant="default" className="text-[12px] font-medium">
                  {isLoading ? "..." : "Omar"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ffffff] border-[#f1f5f9] transition-all duration-200">
            <CardHeader className="p-[20px_20px_16px_20px]">
              <CardTitle className="text-[#64748b] text-sm font-medium uppercase tracking-[0.05em]">
                Average score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-[#1e293b]">{isLoading ? "..." : "83.8%"}</div>
                <Badge variant="secondary" className="text-[12px] font-medium">
                  {isLoading ? "..." : "+5.2%"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-8 w-full max-w-full overflow-hidden content-visibility-auto contain-intrinsic-size-[800px]">
          {isLoading ? chartsPlaceholder : (
            <Suspense fallback={chartsPlaceholder}>
              <Charts difficultyData={difficultyData} Five={data.five} />
            </Suspense>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;