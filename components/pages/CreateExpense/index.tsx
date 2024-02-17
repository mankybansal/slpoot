import { Flex } from "@/components/Flex";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { DateTime } from "luxon";
import CurrencyInput, { CurrencyInputValues } from "@/components/CurrencyInput";
import Input from "@/components/Input";

import axios from "axios";
import { useRouter } from "next/router";
import { routes } from "@/routes";
import { Currency, toRoundCurrencyString } from "@/platform/utils";
import { useEffect, useMemo } from "react";
import { faker } from "@faker-js/faker";
import { Button, Checkbox } from "@chakra-ui/react";
import Text from "@/components/Text";
import { Stubs } from "@/stubs";
import { User } from "@prisma/client";

export type Split = {
  userId: number;
  amount: number;
  isSelected: boolean;
};

export type SplitMethod = "equal" | "uneven";

export type CreateExpenseFormData = {
  description: string;
  currency: Currency;
  totalAmount: number | undefined;
  date: string;
  paidBySplits: Split[];
  owedBySplits: Split[];
  method: SplitMethod;
};

interface Props {
  users: User[];
}

export const CreateExpenseContent = ({ users }: Props) => {
  const router = useRouter();

  const usersToIdMap = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users]
  );

  const formMethods = useForm<CreateExpenseFormData>({
    defaultValues: {
      description: "",
      currency: "USD",
      totalAmount: 0,
      method: "equal",
      date: DateTime.now().toISODate(),
      paidBySplits: users.map((user, i) => ({
        userId: user.id,
        amount: 0,
        isSelected: i === 0,
      })),
      owedBySplits: users.map((user) => ({
        userId: user.id,
        amount: 0,
        isSelected: true,
      })),
    },
  });

  const { watch, setValue, register, handleSubmit, control } = formMethods;
  const owedBySplits = watch("owedBySplits");
  const paidBySplits = watch("paidBySplits");

  const currency = watch("currency");
  const method = watch("method");

  const values = watch();

  const totalAmount = watch("totalAmount");

  const handleTotalAmountChange = ({ cents }: CurrencyInputValues) => {
    setValue("totalAmount", cents);
    const selectedPaidBySplits = paidBySplits.filter(
      (split) => split.isSelected
    );
    if (selectedPaidBySplits.length === 1) {
      setValue(
        "paidBySplits",
        paidBySplits.map((split) => ({
          ...split,
          amount: split.isSelected ? cents ?? 0 : 0,
        }))
      );
    }
  };

  const onSubmit = async (data: CreateExpenseFormData) => {
    try {
      const response = await axios.post("/api/create-expense", data, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        alert("Expense created successfully.");
        await router.push(routes.overview);
      } else {
        alert("Failed to create expense. Please try again.");
      }
    } catch (error) {
      console.error("There was an error creating the expense:", error);
      alert("An error occurred while creating the expense.");
    }
  };

  const isTallied =
    owedBySplits.reduce((acc, split) => acc + (split.amount ?? 0), 0) ===
      (totalAmount ?? 0) &&
    paidBySplits.reduce((acc, split) => acc + (split.amount ?? 0), 0) ===
      (totalAmount ?? 0);

  const fakeIt = () => {
    setValue("description", faker.helpers.arrayElement(Stubs.fakeDescriptions));
    setValue("totalAmount", parseInt(faker.random.numeric(4)));
  };

  const recalculateSplits = () => {
    if (!totalAmount) return;
    switch (method) {
      case "equal": {
        const selectedSplits = owedBySplits.filter((split) => split.isSelected);
        const splitCount = selectedSplits.length;

        if (splitCount === 0) return; // Ensure there's at least one selected split

        const amountPerPerson = Math.floor(totalAmount / splitCount);
        let remainder = totalAmount - amountPerPerson * splitCount;

        const newSplits = owedBySplits.map((split, index) => {
          const extra = remainder > 0 ? 1 : 0;

          if (split.isSelected) {
            if (remainder > 0) remainder -= 1;
            return {
              ...split,
              amount: amountPerPerson + extra,
            };
          } else {
            return {
              ...split,
              amount: 0,
            };
          }
        });

        setValue("owedBySplits", newSplits);

        break;
      }
      case "uneven":
        break;
    }
  };

  const recalculatePaidBySplits = () => {
    if (!totalAmount) return;
    const selectedPaidBySplits = paidBySplits.filter(
      (split) => split.isSelected
    );
    if (selectedPaidBySplits.length === 1) {
      setValue(
        "paidBySplits",
        paidBySplits.map((split) => ({
          ...split,
          amount: split.isSelected ? totalAmount ?? 0 : 0,
        }))
      );
    }
  };

  const handleChangeOwedBySplitSelection = (
    index: number,
    isSelected: boolean
  ) => {
    const newSplits = [...owedBySplits];
    newSplits[index].isSelected = isSelected;
    setValue("owedBySplits", newSplits, { shouldValidate: true });

    // Manually trigger recalculation or other side effects as needed
    recalculateSplits();
  };

  const handleChangePaidBySplitSelection = (
    index: number,
    isSelected: boolean
  ) => {
    const newSplits = [...paidBySplits];
    newSplits[index].isSelected = isSelected;
    setValue("paidBySplits", newSplits, { shouldValidate: true });

    // Manually trigger recalculation or other side effects as needed
    recalculatePaidBySplits();
  };

  useEffect(() => {
    recalculateSplits();
    recalculatePaidBySplits();
  }, [totalAmount, method]);

  return (
    <FormProvider {...formMethods}>
      <Flex width={"100%"}>
        <Flex justify={"space-between"} width={"100%"}>
          <Flex column style={{ flex: 1, maxWidth: "500px" }}>
            <Text fontSize={"x-large"} bold>
              Create Expense
            </Text>
            <Button onClick={fakeIt} size={"sm"} my={"16px"}>
              Fake it
            </Button>
            <Input placeholder={"Description"} {...register("description")} />
            <CurrencyInput
              value={totalAmount}
              style={{ marginTop: 8 }}
              onValueChange={handleTotalAmountChange}
            />
            <Flex column>
              {paidBySplits.map((split, index) => (
                <Controller
                  key={split.userId}
                  name={`paidBySplits.${index}.isSelected`}
                  control={control}
                  render={({ field }) => (
                    <Flex
                      key={split.userId}
                      align={"center"}
                      justify={"space-between"}
                      style={{ marginTop: 8 }}
                    >
                      <Checkbox
                        isChecked={split.isSelected}
                        checked={split.isSelected}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          if (!isChecked)
                            setValue(`paidBySplits.${index}.amount`, 0);
                          handleChangePaidBySplitSelection(index, isChecked);
                        }}
                      />
                      <Text style={{ width: 400 }} bold>
                        {usersToIdMap[split.userId].firstName}
                      </Text>
                      <CurrencyInput
                        disabled={!split.isSelected}
                        style={{ maxWidth: "100px" }}
                        value={split.amount}
                        onValueChange={({ cents }) => {
                          if (!cents || !totalAmount) return;
                          setValue(`paidBySplits.${index}.amount`, cents);
                        }}
                      />
                    </Flex>
                  )}
                />
              ))}

              {paidBySplits.filter((split) => split.isSelected).length > 1 && (
                <RemainingBreakdown
                  currency={currency}
                  totalAmount={totalAmount ?? 0}
                  amount={paidBySplits.reduce((acc, s) => acc + s.amount, 0)}
                />
              )}
            </Flex>
            <Flex style={{ marginTop: 16 }}>
              <Button
                onClick={() => {
                  setValue("method", "equal");
                }}
              >
                Equal
              </Button>
              <Button
                onClick={() => {
                  setValue("method", "uneven");
                  setValue(
                    "owedBySplits",
                    owedBySplits.map((s) => ({ ...s, amount: 0 }))
                  );
                }}
              >
                Uneven
              </Button>
            </Flex>

            {method === "equal" && (
              <Flex column>
                {owedBySplits.map((split, index) => (
                  <Controller
                    key={split.userId}
                    name={`owedBySplits.${index}.isSelected`}
                    control={control}
                    render={({ field }) => (
                      <Flex
                        key={split.userId}
                        align={"center"}
                        justify={"space-between"}
                        style={{ marginTop: 8 }}
                      >
                        <Checkbox
                          isChecked={split.isSelected}
                          checked={split.isSelected}
                          onChange={(e) =>
                            handleChangeOwedBySplitSelection(
                              index,
                              e.target.checked
                            )
                          }
                        />
                        <Text style={{ width: 400 }} bold>
                          {usersToIdMap[split.userId].firstName}
                        </Text>
                        <Text mono>
                          {toRoundCurrencyString(split.amount, currency)}
                        </Text>
                      </Flex>
                    )}
                  />
                ))}
              </Flex>
            )}

            {method === "uneven" && (
              <Flex column>
                {owedBySplits.map((split, index) => (
                  <Flex
                    key={split.userId}
                    align={"center"}
                    style={{ marginTop: 8 }}
                  >
                    <Text style={{ width: 400 }} bold>
                      {usersToIdMap[split.userId].firstName}
                    </Text>
                    <CurrencyInput
                      style={{ maxWidth: "100px" }}
                      value={split.amount}
                      onValueChange={({ cents }) => {
                        if (!cents || !totalAmount) return;
                        setValue(`owedBySplits.${index}.amount`, cents);
                      }}
                    />
                  </Flex>
                ))}
                <RemainingBreakdown
                  currency={currency}
                  totalAmount={totalAmount ?? 0}
                  amount={owedBySplits.reduce((acc, s) => acc + s.amount, 0)}
                />
              </Flex>
            )}

            <Button
              colorScheme={"blue"}
              style={{ marginTop: 32 }}
              onClick={handleSubmit(onSubmit)}
              isDisabled={!isTallied || totalAmount === 0}
            >
              Add
            </Button>
          </Flex>
          <Text fontSize={"sm"} w={"400px"}>
            <pre>
              {JSON.stringify(
                { ...values, valid: isTallied && !!totalAmount },
                null,
                2
              )}
            </pre>
          </Text>
        </Flex>
      </Flex>
    </FormProvider>
  );
};

interface RemainingBreakdownProps {
  amount: number;
  totalAmount: number;
  currency: Currency;
}

const RemainingBreakdown = ({
  amount,
  totalAmount,
  currency,
}: RemainingBreakdownProps) => (
  <Flex column align={"center"} justify={"center"} mt={"32px"}>
    <Text fontSize={"md"} bold>
      {toRoundCurrencyString(amount, currency)} of{" "}
      {toRoundCurrencyString(totalAmount, currency)}
    </Text>
    <Text fontSize={"sm"}>
      {toRoundCurrencyString(totalAmount - amount, currency)} remaining
    </Text>
  </Flex>
);
