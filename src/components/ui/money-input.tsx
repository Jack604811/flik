"use client";
import { useReducer } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type MoneyInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
};

// Colombian currency config without symbol
const moneyFormatter = Intl.NumberFormat("es-CO", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function MoneyInput(props: MoneyInputProps) {
  const initialValue = props.defaultValue || "";

  const [formattedValue, setFormattedValue] = useReducer((_: string, next: string) => {
    // Extract only digits
    const digits = next.replace(/\D/g, "");
    // Format with dots
    return moneyFormatter.format(Number(digits));
  }, moneyFormatter.format(Number(initialValue.replace(/\D/g, ""))));

  function handleChange(realChangeFn: Function, newFormattedValue: string) {
    // Extract only digits for the actual value sent to `onChange`
    const digits = newFormattedValue.replace(/\D/g, "");
    realChangeFn(digits); // Send unformatted value to form
  }

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        const _change = field.onChange;

        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={props.placeholder}
                type="text"
                {...field}
                onChange={(ev) => {
                  const newValue = ev.target.value;
                  setFormattedValue(newValue); // Update formatted value
                  handleChange(_change, newValue); // Update raw value
                }}
                value={formattedValue}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
