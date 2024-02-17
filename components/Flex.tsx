import React from "react";

import {
  Flex as ChakraFlex,
  FlexProps as ChakraFlexProps,
} from "@chakra-ui/react";

export interface FlexProps extends ChakraFlexProps {
  children?: React.ReactNode;
  clickable?: boolean;
  column?: boolean;
}

const Flex = React.forwardRef(
  (
    { clickable, column, children, ...restProps }: FlexProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <ChakraFlex
      ref={ref}
      {...(clickable && { cursor: "pointer" })}
      {...(column && { flexDir: "column" })}
      {...restProps}
    >
      {children}
    </ChakraFlex>
  )
);

Flex.displayName = "Flex";

export { Flex };
