import {
  Text as ChakraText,
  TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import React from "react";

interface TextProps extends ChakraTextProps {
  bold?: boolean;
  mono?: boolean;
  underline?: boolean;
  ellipsify?: boolean;
  children?: React.ReactNode;
}

const Text = ({
  bold,
  mono,
  underline,
  ellipsify,
  className,
  ...props
}: TextProps) => (
  <ChakraText
    {...(bold && { fontWeight: "bold" })}
    {...(ellipsify && {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      width: "100%",
    })}
    {...(props.variant === "interactive" && { whiteSpace: "nowrap" })}
    fontFamily={mono ? "CentraMono" : "CentraNo2"}
    textDecoration={underline ? "underline" : "none"}
    {...props}
  >
    {props.children}
  </ChakraText>
);

export default Text;
