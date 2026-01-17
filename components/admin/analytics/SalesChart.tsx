export function SalesChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm font-display">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-xl font-bold text-slate-900">Sales Trends (Last 7 Days)</h4>
          <p className="text-sm text-slate-500">Daily revenue performance</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">Active View</span>
        </div>
      </div>
      <div className="h-64 relative">
        {/* Simplified SVG Chart mirroring the mockup */}
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 478 150">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.3"></stop>
              <stop offset="100%" stopColor="#4ADE80" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <path d="M0 109C18.1 109 18.1 21 36.3 21C54.4 21 54.4 41 72.6 41C90.7 41 90.7 93 108.9 93C127.0 93 127.0 33 145.2 33C163.3 33 163.3 101 181.5 101C199.6 101 199.6 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363.0 1C381.2 1 381.2 81 399.3 81C417.5 81 417.5 129 435.6 129C453.8 129 453.8 25 472 25" fill="none" stroke="#4ADE80" strokeLinecap="round" strokeWidth="3"></path>
          <path d="M0 109C18.1 109 18.1 21 36.3 21C54.4 21 54.4 41 72.6 41C90.7 41 90.7 93 108.9 93C127.0 93 127.0 33 145.2 33C163.3 33 163.3 101 181.5 101C199.6 101 199.6 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363.0 1C381.2 1 381.2 81 399.3 81C417.5 81 417.5 129 435.6 129C453.8 129 453.8 25 472 25V150H0Z" fill="url(#chartGradient)"></path>
        </svg>
        <div className="flex justify-between mt-6 px-2">
          <span className="text-xs font-bold text-slate-400">Mon</span>
          <span className="text-xs font-bold text-slate-400">Tue</span>
          <span className="text-xs font-bold text-slate-400">Wed</span>
          <span className="text-xs font-bold text-slate-400">Thu</span>
          <span className="text-xs font-bold text-slate-400">Fri</span>
          <span className="text-xs font-bold text-slate-400">Sat</span>
          <span className="text-xs font-bold text-slate-400">Sun</span>
        </div>
      </div>
    </div>
  );
}
