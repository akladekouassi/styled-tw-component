declare module "styled-tw-component" {
  import React from "react";

  type CType = keyof JSX.IntrinsicElements | React.ElementType;

  export type StyledProps<T extends CType, P = unknown> = {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    variant?: `${string}`;
  } & React.ComponentPropsWithoutRef<T> &
    P;

  const Styled: {
    [K in keyof JSX.IntrinsicElements]: (
      baseClass: string
    ) => React.ComponentType<StyledProps<K>>;
  } & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends CType>(baseClass: string | ((props: any) => string)): {
      <P extends object = object>(
        config?: Partial<{
          as?: T;
          variants?: Record<string, string>;
          styleFn?: (props: P) => string;
        }>
      ): React.ComponentType<StyledProps<T, P>>;
    };
    create: typeof createStyled;
  };

  export interface Styled {
    create: <P extends object, T extends CType = "div">(
      baseClass: string | ((props: P) => string),
      config?: Partial<{
        as?: T;
        variants?: Record<string, string>;
        styleFn?: (props: P) => string;
      }>
    ) => React.ComponentType<StyledProps<T, P>>;
  }

  const Styled: Styled;

  export default Styled;
}
