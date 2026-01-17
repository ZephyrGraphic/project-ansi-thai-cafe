"use client";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: string;
}

export function PlaceholderPage({ title, description, icon = "construction" }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50 font-display">
      <header className="bg-white px-8 py-6 border-b border-slate-200">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h2>
        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="size-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mb-6">
          <span className="material-symbols-outlined text-5xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Under Construction</h3>
        <p className="text-slate-500 max-w-sm mb-8">
          This feature ({title}) is part of the roadmap but currently pending full implementation.
        </p>
      </div>
    </div>
  );
}
