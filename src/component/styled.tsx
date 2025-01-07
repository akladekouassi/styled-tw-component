/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import clsx from "clsx";

type CType = keyof JSX.IntrinsicElements | React.ElementType;

/**
 * Props for the `Styled` component.
 */
type StyledProps<T extends CType, P = unknown> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  variant?: `${string}`;
} & React.ComponentPropsWithoutRef<T> &
  P;

/**
 * Configuration options for the `Styled` component.
 */
type StyledComponentConfig<P, T extends CType> = {
  baseClass?: string | ((props: P) => string);
  as?: T;
  variants?: Record<string, string>;
  styleFn?: (props: P) => string;
};

/**
 * A generic utility to create styled components with Tailwind CSS and dynamic props.
 */
function createStyled<P extends object = object, T extends CType = "div">(
  baseClass: string | ((props: P) => string),
  config: Partial<StyledComponentConfig<P, T>> = {}
) {
  return React.forwardRef<HTMLElement, StyledProps<T, P>>(
    ({ className, children, variant, as, ...props }, ref) => {
      const baseClassValue =
        typeof baseClass === "function" ? baseClass(props as P) : baseClass;

      const dynamicClass = config.styleFn ? config.styleFn(props as P) : "";
      const variantClass =
        variant && config.variants ? config.variants[variant] : "";

      const combinedClassName = clsx(
        baseClassValue,
        dynamicClass,
        variantClass,
        className
      );

      const Component = as || config.as || "div";

      return React.createElement(
        Component,
        { ref, className: combinedClassName, ...props },
        children
      );
    }
  );
}

/**
 * Generates a styled utility for each HTML tag.
 */
const htmlTags = [
  "div",
  "span",
  "button",
  "a",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "input",
  "textarea",
  "select",
  "label",
  "form",
  "header",
  "footer",
  "nav",
  "section",
  "article",
  "aside",
  "main",
  "figure",
  "figcaption",
] as const;

const Styled = Object.assign(
  <T extends CType = "div">(baseClass: string | ((props: any) => string)) => {
    return <P extends object = object>({
      as,
      variants,
      styleFn,
    }: Partial<StyledComponentConfig<P, T>> = {}) =>
      createStyled<P, T>(baseClass, { as, variants, styleFn });
  },
  Object.fromEntries(
    htmlTags.map((tag) => [
      tag,
      <P extends object = object>(baseClass: string | ((props: P) => string)) =>
        createStyled<P, typeof tag>(baseClass, { as: tag }),
    ])
  ),
  {
    create: <P extends object, T extends CType = "div">(
      baseClass: string | ((props: P) => string),
      config: Partial<StyledComponentConfig<P, T>> = {}
    ) => createStyled<P, T>(baseClass, config),
  }
);

export default Styled;
