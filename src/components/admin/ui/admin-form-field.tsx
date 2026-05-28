type AdminFormFieldProps = {
  className?: string;
  fieldType?: "input" | "textarea";
  inputType?: string;
  label: string;
  name: string;
  placeholder?: string;
};

export function AdminFormField({
  className = "",
  fieldType = "input",
  inputType = "text",
  label,
  name,
  placeholder,
}: AdminFormFieldProps) {
  const fieldClassName =
    "mt-3 w-full border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-950";

  return (
    <label className={className}>
      <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
      {fieldType === "textarea" ? (
        <textarea
          className={`${fieldClassName} min-h-32 resize-y`}
          name={name}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={fieldClassName}
          name={name}
          placeholder={placeholder}
          type={inputType}
        />
      )}
    </label>
  );
}
