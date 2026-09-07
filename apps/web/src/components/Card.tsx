import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function Card(props: ComponentProps<'div'>) {
  const { children, className, ...rest } = props;
 return (
  <div className={twMerge("bg-white rounded-xl p-6 border-stone-200 border flex flex-col items-stretch shadow-xl", className)} {...rest}>
    {children}
  </div>
 )
}