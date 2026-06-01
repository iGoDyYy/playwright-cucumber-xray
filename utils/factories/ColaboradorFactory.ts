import { faker } from '@faker-js/faker';

import { UserFactory } from './UserFactory';

export type Colaborador = {
  nome: string;
  cpf: string;
  matricula: string;
  pin: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  dataAdmissao: string;
  celular: string;
  rg: string;
  pis: string;
  cargo: string;
};

export class ColaboradorFactory {

  static gerarMatricula(): string {

    const sufixo =
      String(Date.now()).slice(-4);

    const aleatorio =
      faker.number.int({
        min: 0,
        max: 9
      });

    return `${sufixo.slice(0, 3)}${aleatorio}`;
  }

  static gerarPin(): string {

    return faker.number.int({
      min: 1000,
      max: 9999
    }).toString();
  }

  static gerarDataAdmissaoHoje(): string {

    const hoje = new Date();

    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    return `${ano}-${mes}-${dia}`;
  }

  static criarColaborador(): Colaborador {

    const senha = UserFactory.gerarSenha();

    return {
      nome:
        `${faker.person.firstName()} ${faker.person.lastName()}`
          .replace(/[^a-zA-ZÀ-ÿ\s]/g, ''),

      cpf: UserFactory.gerarCPF(),

      matricula: this.gerarMatricula(),

      pin: this.gerarPin(),

      email:
        `colab${Date.now()}@mailinator.com`,

      senha,

      confirmarSenha: senha,

      dataAdmissao:
        this.gerarDataAdmissaoHoje(),

      celular:
        UserFactory.gerarCelular(),

      rg:
        faker.number.int({
          min: 1000000,
          max: 999999999
        }).toString(),

      pis:
        faker.number.int({
          min: 10000000000,
          max: 99999999999
        }).toString(),

      cargo: 'Analista de Testes'
    };
  }
}
