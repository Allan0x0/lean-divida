import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function CenteredView(props: ComponentProps<'div'>) {
  const { children, className, ...rest } = props;
  return (
    <div className={twMerge("flex flex-col justify-center items-stretch w-full md:w-4/5 lg:w-3/5", className)} {...rest}>
      {children}
    </div>
  )
}