/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import clsx from "clsx";

type CType = keyof JSX.IntrinsicElements | React.ElementType | React.FC<any>;

type StyledProps<T extends CType, P = object> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  variant?: `${string}`;
} & React.ComponentPropsWithoutRef<T> &
  P;

type StyledComponentConfig<P, T extends CType> = {
  baseClass?: string | ((props: P) => string);
  as?: T;
  variants?: Record<string, string>;
  styleWithProps?: (props: P) => string;
};

/**
 * Creates a styled component with a given tag.
 */
function createStyled<P extends object = object, T extends CType = "div">(
  baseClass: string | ((props: P) => string),
  config: Partial<StyledComponentConfig<P, T>> = {}
) {
  return React.forwardRef<HTMLElement, StyledProps<T, P>>(
    ({ className, children, variant, as, ...props }, ref) => {
      const baseClassValue =
        typeof baseClass === "function" ? baseClass(props as P) : baseClass;

      const dynamicClass = config.styleWithProps
        ? config.styleWithProps(props as P)
        : "";
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
 * Generates a component for a specific HTML tag.
 */
function createHtmlTag<P extends object = object, T extends CType = "div">(
  tag: T
) {
  return (
    baseClass: string | ((props: P) => string),
    config?: Partial<StyledComponentConfig<P, T>>
  ) => createStyled<P, T>(baseClass, { ...config, as: tag });
}

/**
 * The generic method for creating custom components or tags.
 */
function create<P extends object = object, T extends CType = "div">(
  baseClass: string | ((props: P) => string),
  config?: Partial<StyledComponentConfig<P, T>>
) {
  return createStyled<P, T>(baseClass, config);
}

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

/**
 * The Styled object with the methods for each HTML tag and the method ‘create’.
 */
const Styled = Object.assign(
  // Adds a method for each HTML tag
  Object.fromEntries(
    htmlTags.map((tag) => [tag, createHtmlTag<any, typeof tag>(tag)])
  ),
  {
    create, // Generic method to create a component
  }
);

export default Styled;
