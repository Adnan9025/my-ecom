import { forwardRef } from "react";
import clsx from "clsx";

const Textarea = forwardRef(
  (
    {
      label,
      name,
      placeholder = "",
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      rows = 5,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            {label}

            {required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          rows={rows}
          className={clsx(
            "w-full resize-y rounded-xl border bg-white px-4 py-3",
            "text-slate-900 outline-none transition",
            "placeholder:text-slate-400",
            "focus:ring-2",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100",
            disabled &&
              "cursor-not-allowed bg-slate-100 opacity-60",
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;