import { Input } from "../ui/input";

function formatTimeInput(value: string) {
  let digits = value.replace(/\D/g, "");
  digits = digits.slice(0, 4);
  if (digits.length > 2) {
    return digits.slice(0, 2) + ":" + digits.slice(2);
  }
  return digits;
}

export function HoraInput({ value, onChange, ...props }: {
  value: string;
  onChange: (val: string) => void;
  [key: string]: any;
}) {
  return (
    <Input
      {...props}
      maxLength={5}
      value={value}
      onChange={e => {
        const formatted = formatTimeInput(e.target.value);
        onChange(formatted);
      }}
      placeholder="00:00"
      inputMode="numeric"
      pattern="[0-9:]*"
      className={"mt-2 text-sm " + (props.className || "")}
    />
  );
} 