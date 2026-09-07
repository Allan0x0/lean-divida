import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ComponentProps<'button'> { }
export function Button(props: ButtonProps) {
  const { children, className, disabled, ...rest } = props;
  return (
    <button className={twMerge(getClassName(), className)} {...rest}>{children}</button>
  )
}

interface LinkProps extends ComponentProps<'a'> { }
export function Link(props: LinkProps) {
  const { children, href, className, ...rest } = props;
  return (
    <a href={href} className={twMerge(getClassName(), className)} {...rest}>{children}</a>
  )
}

interface ClassNameProps {
  disabled?: boolean;
}
function getClassName (props?: ClassNameProps) {
  return twMerge("px-4 py-3 text-white font-semibold bg-teal-600 rounded-lg", props?.disabled && "bg-teal-400");
}