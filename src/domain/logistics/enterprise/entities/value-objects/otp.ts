import { ValueObject } from "@/core/entities/value-objects";

export type OtpProps = {
  value: string;
  expiration: Date;
}

export class Otp extends ValueObject<OtpProps> {
  get value(): string {
    return this.props.value;
  }

  get expiration(): Date {
    return this.props.expiration;
  }

  protected constructor(props: OtpProps) {
    super(props);
  }

  public static generate(length: number, expirationInMinutes: number): Otp {
    const otpValue = Otp.generateOtpValue(length);
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + expirationInMinutes);

    return new Otp({
      value: otpValue,
      expiration
    });
  }

  private static generateOtpValue(length: number): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }
}