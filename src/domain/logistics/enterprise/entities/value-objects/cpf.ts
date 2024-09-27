export class Cpf {
  public value: string

  private constructor(value?: string) {
    const cpfToValidate = value || Cpf.generateRandomCpf() // Gera CPF aleatório se nenhum valor for passado
    const formattedValue = Cpf.format(cpfToValidate) // Formata o CPF

    if (!Cpf.isValid(formattedValue)) {
      throw new Error('Invalid CPF')
    }

    this.value = formattedValue
  }

  static create(value?: string): Cpf { // Parâmetro opcional aqui também
    return new Cpf(value)
  }

  static isValid(cpf: string): boolean {
    const cleanedCpf = cpf.replace(/[^\d]/g, '') // Remove caracteres não numéricos

    if (cleanedCpf.length !== 11) {
      return false
    }

    if (/^(\d)\1{10}$/.test(cleanedCpf)) {
      return false
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cleanedCpf[i]) * (10 - i)
    }

    let firstVerifier = (sum * 10) % 11
    if (firstVerifier === 10 || firstVerifier === 11) firstVerifier = 0

    if (firstVerifier !== Number.parseInt(cleanedCpf[9])) {
      return false
    }

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cleanedCpf[i]) * (11 - i)
    }

    let secondVerifier = (sum * 10) % 11
    if (secondVerifier === 10 || secondVerifier === 11) secondVerifier = 0


    if (secondVerifier !== Number.parseInt(cleanedCpf[10])) {
      return false
    }

    return true
  }

  private static format(cpf: string): string {
    const cleanedCpf = cpf.replace(/[^\d]/g, '')
    return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  private static generateRandomCpf(): string {
    let cpf = ''
    for (let i = 0; i < 9; i++) {
      cpf += Math.floor(Math.random() * 9).toString()
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf[i]) * (10 - i)
    }
    let firstVerifier = (sum * 10) % 11
    if (firstVerifier === 10 || firstVerifier === 11) firstVerifier = 0

    cpf += firstVerifier

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf[i]) * (11 - i)
    }
    let secondVerifier = (sum * 10) % 11
    if (secondVerifier === 10 || secondVerifier === 11) secondVerifier = 0

    cpf += secondVerifier

    return cpf
  }
}
