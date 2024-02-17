import { Flex } from "@/components/Flex";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { DateTime } from "luxon";
import CurrencyInput, { CurrencyInputValues } from "@/components/CurrencyInput";
import Input from "@/components/Input";
import { User } from "@/pages/create-expense";

import axios from "axios";
import { useRouter } from "next/router";
import { routes } from "@/routes";
import { Currency, toRoundCurrencyString } from "@/platform/utils";
import { useEffect, useMemo } from "react";
import { faker } from "@faker-js/faker";
import { Button, Checkbox } from "@chakra-ui/react";
import Text from "@/components/Text";
import { Stubs } from "@/stubs";

export type Split = {
  userId: string;
  amount: number;
  isSelected: boolean;
};

export type SplitMethod = "equal" | "uneven";

export type CreateExpenseFormData = {
  description: string;
  currency: Currency;
  totalAmount: number | undefined;
  date: string;
  paidByUserId: string;
  method: SplitMethod;
  splits: Split[];
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
      paidByUserId: users[0].id,
      date: DateTime.now().toISODate(),
      splits:
        users?.map((user) => ({
          userId: user.id,
          amount: 0,
          isSelected: true,
        })) || [],
    },
  });

  const { watch, setValue, register, handleSubmit, control } = formMethods;
  const splits = watch("splits");
  const paidByUserId = watch("paidByUserId");

  const currency = watch("currency");
  const method = watch("method");

  const values = watch();

  const totalAmount = watch("totalAmount");

  const handleTotalAmountChange = ({ cents }: CurrencyInputValues) => {
    setValue("totalAmount", cents);
  };

  const onSubmit = async (data: CreateExpenseFormData) => {
    const response = await axios({
      method: "post",
      url: "/api/create-expense",
      data,
    });
    if (response.status === 200) {
      alert("Expense created successfully");
      console.log(JSON.stringify(response.data));
      return router.push(routes.overview);
    }
  };

  const isTallied =
    splits.reduce((acc, split) => acc + (split.amount ?? 0), 0) ===
    (totalAmount ?? 0);

  const fakeIt = () => {
    setValue("description", faker.helpers.arrayElement(Stubs.fakeDescriptions));
    setValue("totalAmount", parseInt(faker.random.numeric(4)));
  };

  const recalculateSplits = () => {
    if (!totalAmount) return;
    switch (method) {
      case "equal": {
        const selectedSplits = splits.filter((split) => split.isSelected);
        const splitCount = selectedSplits.length;

        if (splitCount === 0) return; // Ensure there's at least one selected split

        const amountPerPerson = Math.floor(totalAmount / splitCount);
        let remainder = totalAmount - amountPerPerson * splitCount;

        const newSplits = splits.map((split, index) => {
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

        setValue("splits", newSplits);
        break;
      }
      case "uneven":
        break;
    }
  };

  const handleSplitSelectionChange = (index: number, isSelected: boolean) => {
    const newSplits = [...splits];
    newSplits[index].isSelected = isSelected;
    setValue("splits", newSplits, { shouldValidate: true });

    // Manually trigger recalculation or other side effects as needed
    recalculateSplits();
  };

  useEffect(() => {
    recalculateSplits();
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
            <Flex>
              <Text>Paid by: {usersToIdMap[paidByUserId].name}</Text>
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
                    "splits",
                    splits.map((s) => ({ ...s, amount: 0 }))
                  );
                }}
              >
                Uneven
              </Button>
            </Flex>

            {method === "equal" && (
              <Flex column>
                {splits.map((split, index) => (
                  <Controller
                    key={split.userId}
                    name={`splits.${index}.isSelected`}
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
                            handleSplitSelectionChange(index, e.target.checked)
                          }
                        />
                        <Text style={{ width: 400 }} bold>
                          {usersToIdMap[split.userId].name}
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
                {splits.map((split, index) => (
                  <Flex
                    key={split.userId}
                    align={"center"}
                    style={{ marginTop: 8 }}
                  >
                    <Text style={{ width: 400 }} bold>
                      {usersToIdMap[split.userId].name}
                    </Text>
                    <CurrencyInput
                      style={{ maxWidth: "100px" }}
                      value={split.amount}
                      onValueChange={({ cents }) => {
                        if (!cents || !totalAmount) return;
                        setValue(`splits.${index}.amount`, cents);
                      }}
                    />
                  </Flex>
                ))}
                <Flex column align={"center"} justify={"center"} mt={"32px"}>
                  <Text fontSize={"md"} bold>
                    {toRoundCurrencyString(
                      splits.reduce((acc, s) => acc + s.amount, 0),
                      currency
                    )}{" "}
                    of {toRoundCurrencyString(totalAmount, currency)}
                  </Text>
                  <Text fontSize={"sm"}>
                    {toRoundCurrencyString(
                      (totalAmount ?? 0) -
                        splits.reduce((acc, s) => acc + s.amount, 0),
                      currency
                    )}{" "}
                    remaining
                  </Text>
                </Flex>
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
