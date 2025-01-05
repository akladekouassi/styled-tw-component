/* eslint-disable @typescript-eslint/no-explicit-any */
// @tailwind base, components, utilities
import React from "react";
import clsx from "clsx";

type CType = React.ElementType | React.ComponentType;

/**
 * Props for the `Styled` component.
 *
 * @template T The element type (e.g., `div`, `button`, etc.).
 * @template P Additional props for dynamic styling.
 */
type StyledProps<T extends CType, P = unknown> = {
  /**
   * The HTML or custom component to render.
   * @default "div"
   */
  as?: T;

  /**
   * Additional class names to apply.
   */
  className?: string;

  /**
   * Content to render inside the component.
   */
  children?: React.ReactNode;

  /**
   * Name of the variant to apply.
   */
  variant?: `${string}`;
} & React.ComponentPropsWithoutRef<T> &
  P;

/**
 * Configuration options for the `Styled` component.
 *
 * @template P Props for dynamic styling.
 * @template T The element type (e.g., `div`, `button`, etc.).
 */
type StyledComponentConfig<P, T extends CType> = {
  /**
   * The base Tailwind CSS class or a function that returns classes dynamically.
   */
  baseClass?: string | ((props: P) => string);

  /**
   * The HTML or custom component to render.
   * @default "div"
   */
  as?: T;

  /**
   * Available variants and their corresponding Tailwind classes.
   */
  variants?: Record<string, string>;

  /**
   * A function to generate additional dynamic classes.
   */
  styleFn?: (props: P) => string;
};

/**
 * A generic utility to create styled components with Tailwind CSS and dynamic props.
 *
 * @template P Props for dynamic styling.
 * @template T The element type (e.g., `div`, `button`, etc.).
 * @param config The configuration for the styled component.
 * @returns A React component with dynamic Tailwind CSS styling.
 *
 * @example
 * ```tsx
 * const Wrapper = Styled.base.div(`flex
 * items-center
 * justify-center`)
 *
 * ```
 *
 * ```tsx
 *  With props: First Example
 * const const Button = Styled.base.button(({ $primary }: { $primary?: boolean }) =>
 * clsx('px-4 py-2 font-bold border-2', {
 * 'bg-blue-500 text-white': $primary,
 * 'bg-gray-200 text-black': !$primary,
 * })
 * ```
 *
 * ```tsx
 * With Props: Second Example,
 * const Button = Styled<{ $primary?: boolean; $rounded?: boolean }, 'button'>({
 * baseClass: `px-4 py-2 rounded-md text-white hover:bg-blue-600`,
 * as: 'button',
 * variants: {
 *   primary: `bg-black`,
 *   secondary: `bg-blue-600`,
 * },
 * styleFn: ({ $primary, $rounded }) =>
 * clsx({
 * 'rounded-full': $rounded,
 * 'rounded-md': !$rounded,
 * 'bg-blue-500': $primary,
 *  bg-red-200': !$primary,
 *   }),
 * });```
 *
 *
 *
 *
 * @example
 * ```tsx
 * Example 4:
 *
 * const MyButton = ({ className, children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
 *  <button className={className} {...{ ...props }}>
 *    {children}
 *  </button>
 *  );
 *
 * const StyledMyButton1 = Styled({
 *  baseClass: 'px-4 font-bold',
 *  as: MyButton,
 *  variants: {
 *    primary: 'bg-blue-500 text-white',
 *    secondary: 'bg-gray-200 text-black',
 *  },
 *});
 *
 *const StyledMyButton2 = Styled.component(MyButton, {
 *  baseClass: 'px-4 font-bold',
 *  variants: {
 *    primary: `bg-blue-500 text-white`,
 *    secondary: `bg-red-600 text-black`,
 *  },
 *});
 *
 * <StyledMyButton2 variant="secondary">Premier button</StyledMyButton2>
 * <StyledMyButton1 variant="secondary">Second button</StyledMyButton1>
 */
function createStyled<
  P extends Record<string, any> = object,
  T extends CType = "div"
>(config: StyledComponentConfig<P, T>) {
  return React.forwardRef<HTMLElement, StyledProps<T, P>>(
    ({ className, children, variant, as, ...props }, ref) => {
      const baseClass =
        typeof config.baseClass === "function"
          ? config.baseClass(props as unknown as P)
          : config.baseClass;

      const dynamicClass = config.styleFn
        ? config.styleFn(props as unknown as P)
        : "";
      const variantClass = config.variants?.[variant!] || "";
      const combinedClassName = clsx(
        typeof baseClass === "string" ? baseClass : "",
        dynamicClass,
        variantClass,
        className
      );

      const Component =
        typeof baseClass === "function" || typeof baseClass === "object"
          ? baseClass
          : as || config.as || "div";

      return React.createElement(
        Component,
        {
          ref,
          className: combinedClassName,
          ...props,
        },
        children
      );
    }
  );
}

/**
 * A utility object for creating styled components for common HTML elements.
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

const Styled = {
  create: createStyled,
  base: Object.assign(
    <T extends CType = "div">(baseClass: string | ((props: any) => string)) => {
      return <P extends Record<string, any> = object>({
        as,
        variants,
        styleFn,
      }: Partial<StyledComponentConfig<P, T>> = {}) =>
        createStyled<P, T>({
          baseClass,
          as,
          variants,
          styleFn,
        });
    },
    Object.fromEntries(
      htmlTags.map((tag) => [
        tag,
        <P extends Record<string, any> = object>(
          baseClass: string | ((props: P) => string)
        ) => {
          return createStyled<P, typeof tag>({ baseClass, as: tag });
        },
      ])
    )
  ),
};

export default Styled;
