type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-black/10 pb-10">
      <p className="text-xs uppercase tracking-[0.45em] text-zinc-500">
        {eyebrow}
      </p>
      <h1 className="mt-5 text-4xl font-semibold leading-tight text-zinc-950 sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
