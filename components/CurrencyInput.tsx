import React from "react";

import styled from "@emotion/styled";
import { NumericFormat, NumberFormatValues } from "react-number-format";
import { Flex } from "@/components/Flex";

const StyledCurrencyInput = styled(NumericFormat)`
  padding: 20px 16px 20px 32px;
  border: 1px solid #ccc;
  border-radius: 10px;
  min-width: 300px;
  width: 100%;
  display: flex;
  font-size: 18px;
  line-height: 24px;
  font-family: "CentraMono", serif;
`;

const RootContainer = styled(Flex)`
  position: relative;
  align-items: center;
  width: 100%;
`;

const Prefix = styled.p`
  position: absolute;
  left: 16px;
`;

export type CurrencyInputValues = NumberFormatValues & { cents?: number };

interface Props
  extends Omit<
    React.ComponentProps<typeof NumericFormat>,
    "value" | "onValueChange"
  > {
  value?: number;
  onValueChange: (value: CurrencyInputValues) => void;
}

const defaultValues = {
  allowNegative: false,
  decimalScale: 2,
  placeholder: "0.00",
  fixedDecimalScale: true,
  thousandSeparator: true,
};

const CurrencyInputBase = ({ onValueChange, value, ...restProps }: Props) => (
  <RootContainer>
    <StyledCurrencyInput
      {...defaultValues}
      value={typeof value === "number" ? value / 100 : value}
      onValueChange={(values) =>
        onValueChange({
          ...values,
          cents:
            typeof values.floatValue === "number"
              ? Math.round(values?.floatValue * 100)
              : undefined,
        })
      }
      {...restProps}
    />
    <Prefix>$</Prefix>
  </RootContainer>
);

const CurrencyInput = Object.assign(CurrencyInputBase, {
  Styled: {
    StyledCurrencyInput,
    RootContainer,
    Prefix,
  },
  defaultValues,
});

export default CurrencyInput;
