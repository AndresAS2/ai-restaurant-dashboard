export default function StatCard({title,value,icon}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {icon}
      </div>
    </div>
  );
}