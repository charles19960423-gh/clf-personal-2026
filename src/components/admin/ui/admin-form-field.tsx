type AdminFormFieldProps = {
  className?: string;
  defaultValue?: string;
  fieldType?: "input" | "select" | "textarea";
  inputType?: string;
  label: string;
  name: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
  required?: boolean;
};

export function AdminFormField({
  className = "",
  defaultValue,
  fieldType = "input",
  inputType = "text",
  label,
  name,
  options = [],
  placeholder,
  required = false,
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
          defaultValue={defaultValue}
          name={name}
          placeholder={placeholder}
          required={required}
        />
      ) : fieldType === "select" ? (
        <select
          className={`${fieldClassName} appearance-none`}
          defaultValue={defaultValue}
          name={name}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={fieldClassName}
          defaultValue={defaultValue}
          name={name}
          placeholder={placeholder}
          required={required}
          type={inputType}
        />
      )}
    </label>
  );
}
