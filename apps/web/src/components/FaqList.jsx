export function FaqList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details key={item.question} className="glass-panel rounded-[1.5rem] p-5">
          <summary className="cursor-pointer list-none font-semibold">{item.question}</summary>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

