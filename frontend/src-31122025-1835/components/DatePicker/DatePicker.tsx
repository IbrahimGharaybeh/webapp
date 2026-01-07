import './DatePicker.css';

interface DatePickerProps {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DatePicker({ name, value, onChange }: DatePickerProps) {
  return (
    <input type="date" name={name} value={value} onChange={onChange} />
  );
}

export default DatePicker;

