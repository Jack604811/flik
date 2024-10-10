import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface Props {
  control: Control<any>;
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  description?: string|React.ReactNode;
}

export function BaseInputField({
  control,
  name,
  type,
  label,
  placeholder,
  description,
}: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{label ?? name}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} type={type ?? "text"} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
