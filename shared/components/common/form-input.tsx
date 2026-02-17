import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { Field, FieldDescription, FieldLabel, Input } from '../ui';

type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
  placeholder?: string;
  error?: string;
  loading?: boolean;
  label: string;
  type?: string;
};

export function FormInput<T extends FieldValues>({
  name,
  register,
  placeholder,
  error,
  loading,
  label,
  type = 'text',
}: FormFieldProps<T>) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <Input
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={loading}
      />

      {error && <FieldDescription className='text-destructive'>{error}</FieldDescription>}
    </Field>
  );
}
