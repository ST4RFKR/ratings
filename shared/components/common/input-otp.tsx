import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp';

type CompanyCodeOtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function CompanyCodeOtpInput({ value, onChange, disabled = false }: CompanyCodeOtpInputProps) {
  return (
    <InputOTP
      value={value}
      onChange={onChange}
      maxLength={6}
      disabled={disabled}
    >
      <InputOTPGroup className='space-x-1'>
        <InputOTPSlot
          className='rounded-md border-l'
          index={0}
        />
        <InputOTPSlot
          className='rounded-md border-l'
          index={1}
        />
        <InputOTPSlot
          className='rounded-md border-l'
          index={2}
        />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup className='space-x-1'>
        <InputOTPSlot
          className='rounded-md border-l'
          index={3}
        />
        <InputOTPSlot
          className='rounded-md border-l'
          index={4}
        />
        <InputOTPSlot
          className='rounded-md border-l'
          index={5}
        />
      </InputOTPGroup>
    </InputOTP>
  );
}
