import { forwardRef, type ComponentProps, type ComponentRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ComponentProps<'input'> {
  label?: string;
}
export const TextField = forwardRef<ComponentRef<'input'>, Props>(function TextField(props: Props, ref) {
  const { className, id, name, label, required, ...rest } = props;
  return (
    <div className={twMerge("flex flex-col items-stretch", label && "py-1")}>
      {label && <label htmlFor={id || name} className="text-stone-200 text-sm">{label} {required && <span className="text-red-600">*</span>}</label>}
      <input
        id={id || name}
        ref={ref}
        className={twMerge("px-4 py-3 border-stone-200 border rounded-md bg-white text-black", className)}
        {...rest}
      />
    </div>
  )
})