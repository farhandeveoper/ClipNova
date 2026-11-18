export default function Processing({ job, onReset }) {
  if (job.status === "error")
    return (
      <section className="max-w-[1120px] mx-auto px-6 mt-20 mb-10 bg-card border border-line rounded-[28px] py-16 text-center">
        <h2 className="font-display font-bold text-3xl mb-4">Something went wrong</h2>
        <p className="text-danger mb-6">{job.error}</p>
        <button className="bg-accent text-black font-bold rounded-full px-7 py-3 hover:-translate-y-0.5 transition-transform" onClick={onReset}>Try again</button>
      </section>
    );
  return (
    <section className="max-w-[1120px] mx-auto px-6 mt-20 mb-10 bg-card border border-line rounded-[28px] py-16 text-center">
      <div className="spinner mx-auto mb-6" />
      <h2 className="font-display font-bold text-3xl mb-4">{job.stage}</h2>
      <div className="h-[10px] rounded-full bg-[#222] max-w-[520px] mx-auto overflow-hidden">
        <div className="bar-fill" style={{ width: `${job.progress}%` }} />
      </div>
      <p className="text-muted mt-5">{job.progress}% done. Long videos can take a while, you can keep this tab open.</p>
    </section>
  );
}
