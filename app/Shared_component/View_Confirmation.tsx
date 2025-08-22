'use client'

import React from "react";
import { Check } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { format } from "date-fns";



type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};
function Button({ className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white hover:from-gray-800 hover:via-gray-700 hover:to-gray-900 hover:shadow-xl hover:shadow-black/20 active:scale-95 h-11 px-6 py-2 font-semibold";
  return <button className={`${base} ${className}`} {...props} />;
}


type DialogContextType = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};
const DialogContext = React.createContext<DialogContextType | null>(null);

type DialogRootProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
};
function Dialog({ open, onOpenChange, children }: DialogRootProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};
function DialogContent({ className = "", children, ...rest }: DialogContentProps) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) return null;

  const { open, onOpenChange } = ctx;

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const overlay =
    "fixed inset-0 z-50 bg-gradient-to-br from-black/30 to-gray-900/20 backdrop-blur-md";
  const content =
    "fixed left-1/2 top-1/2 z-50 grid w-[calc(100vw-2rem)] max-w-[540px] -translate-x-1/2 -translate-y-1/2 gap-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-4 sm:p-6 shadow-2xl shadow-black/15 duration-300 focus:outline-none rounded-3xl border border-gray-200/60 backdrop-blur-sm";

  return (
    <>
      <div className={overlay} onClick={() => onOpenChange(false)} />
      <div
        role="dialog"
        aria-modal="true"
        className={`${content} ${className}`}
        tabIndex={-1}
        {...rest}
      >
        {children}
      </div>
    </>
  );
}

function DialogHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-3 text-center ${className}`} {...props} />
  );
}

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
function DialogTitle({ className = "", ...props }: DialogTitleProps) {
  return (
    <h2 className={`text-2xl font-bold leading-tight tracking-tight text-slate-800 ${className}`} {...props} />
  );
}

function DialogFooter({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex justify-center pt-4 ${className}`}
      {...props}
    />
  );
}


type AvatarContextType = {
  hasImage: boolean;
  setHasImage: React.Dispatch<React.SetStateAction<boolean>>;
};
const AvatarContext = React.createContext<AvatarContextType | null>(null);

type AvatarProps = React.HTMLAttributes<HTMLDivElement>;
function Avatar({ className = "", children, ...props }: AvatarProps) {
  const [hasImage, setHasImage] = React.useState(false);
  const base = "relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gray-300/60 shadow-lg shadow-gray-200/50";
  return (
    <AvatarContext.Provider value={{ hasImage, setHasImage }}>
      <div className={`${base} ${className}`} {...props}>
        {children}
      </div>
    </AvatarContext.Provider>
  );
}

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
function AvatarImage({ className = "", onLoad, onError, ...props }: AvatarImageProps) {
  const ctx = React.useContext(AvatarContext);
  if (!ctx) return null;
  const { setHasImage } = ctx;

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setHasImage(true);
    onLoad?.(e);
  };
  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setHasImage(false);
    onError?.(e);
  };

  return (
    <img
      className={`aspect-square h-full w-full object-cover ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}

type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;
function AvatarFallback({ className = "", ...props }: AvatarFallbackProps) {
  const ctx = React.useContext(AvatarContext);
  if (!ctx) return null;
  const { hasImage } = ctx;
  const base = "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-black text-white text-lg font-bold";
  return (
    <span
      className={`${base} ${hasImage ? "hidden" : ""} ${className}`}
      {...props}
    />
  );
}


interface TemplateDemoProps {
  setstateView: (v: boolean) => void;
  stateView: boolean;
  user?: any;
  sampleUser?:any;
}

export default function TemplateDemo({ setstateView, stateView, user,sampleUser }: TemplateDemoProps) {
  const person = user || sampleUser ||{};

  function capitalize(s: string) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  const fullName = `${capitalize(person.first_name)}`;
  const groupCreated = person.group?.createdAt
    ? format(new Date(person.group.createdAt), "dd MMM yyyy")
    : "—";

  return (
    <Dialog open={stateView} onOpenChange={setstateView}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Header with User Info */}
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-gray-700 to-black text-white shadow-lg shadow-gray-200/50 ring-2 ring-gray-300/60">
                <CgProfile className="w-10 h-10" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold leading-tight text-slate-800 mb-1">
                  {fullName || "—"}
                </h3>
                <p className="text-sm text-gray-600 font-medium bg-gradient-to-r from-gray-100 to-white px-3 py-1 rounded-full border border-gray-200">
                  {person.role || "—"}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Information Grid */}
        <section aria-label="user details" className="space-y-3">
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            {/* Role */}
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                {person.role || "—"}
              </p>
            </article>

            {/* Email */}
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
              <p className="font-semibold text-gray-800 text-sm break-words group-hover:text-black transition-colors text-center">
                {person.email || "—"}
              </p>
            </article>

            {/* Status */}
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                {person.status || "—"}
              </p>
            </article>

            {/* Created in */}
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Created in</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                {groupCreated}
              </p>
            </article>

            {/* Students in group */}
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Students</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                <span className="text-gray-900 font-bold">
                  {person.group?.students?.length ?? 0}
                </span>{" "}
                / {person.group?.max_students ?? "—"}
              </p>
            </article>

            {/* Group Status */}
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Group Status</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                {person.group?.status || "—"}
              </p>
            </article>
          </div>
        </section>

        {/* Footer */}
       
      </DialogContent>
    </Dialog>
  );
}
