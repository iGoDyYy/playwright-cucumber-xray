import { faker } from '@faker-js/faker';

export class UserFactory {

  static gerarCPF(): string {

    const n = Array.from(
      { length: 9 },
      () => faker.number.int({
        min: 0,
        max: 9
      })
    );

    let d1 =
      n.reduce(
        (acc, num, index) =>
          acc + num * (10 - index),
        0
      ) * 10;

    d1 = d1 % 11;

    if (d1 === 10) {
      d1 = 0;
    }

    let d2 =
      [...n, d1].reduce(
        (acc, num, index) =>
          acc + num * (11 - index),
        0
      ) * 10;

    d2 = d2 % 11;

    if (d2 === 10) {
      d2 = 0;
    }

    return [...n, d1, d2].join('');
  }

  static gerarCNPJ(): string {

    const n = Array.from(
      { length: 12 },
      () => faker.number.int({
        min: 0,
        max: 9
      })
    );

    const calcularDigito = (
      numeros: number[],
      pesos: number[]
    ) => {

      const soma =
        numeros.reduce(
          (acc, num, index) =>
            acc + num * pesos[index],
          0
        );

      const resto =
        soma % 11;

      return resto < 2
        ? 0
        : 11 - resto;
    };

    const d1 =
      calcularDigito(
        n,
        [5,4,3,2,9,8,7,6,5,4,3,2]
      );

    const d2 =
      calcularDigito(
        [...n, d1],
        [6,5,4,3,2,9,8,7,6,5,4,3,2]
      );

    return [...n, d1, d2].join('');
  }

  static gerarCelular(): string {

    const ddd = faker.helpers.arrayElement([
      '11',
      '21',
      '31',
      '41',
      '51'
    ]);

    const numero =
      faker.number.int({
        min: 900000000,
        max: 999999999
      });

    return `${ddd}${numero}`;
  }

  static gerarTelefoneFixo(): string {

    const ddd = faker.helpers.arrayElement([
      '11',
      '21',
      '31',
      '41',
      '51'
    ]);

    const numero =
      faker.number.int({
        min: 20000000,
        max: 59999999
      });

    return `${ddd}${numero}`;
  }

  static gerarSenha(): string {

    return 'Teste@1234';
  }

  static criarUsuario() {

    const senha =
      this.gerarSenha();

    return {

      nome:
        `${faker.person.firstName()} ${faker.person.lastName()}`
          .replace(/[^a-zA-ZÀ-ÿ\s]/g, ''),

      email:
        `teste${Date.now()}@mailinator.com`,

      cpf:
        this.gerarCPF(),

      cnpj:
        this.gerarCNPJ(),

      inscricaoEstadual:
        faker.number.int({
          min: 100000000,
          max: 999999999
        }).toString(),

      inscricaoMunicipal:
        faker.number.int({
          min: 100000,
          max: 999999
        }).toString(),

        razaoSocial:
        `${faker.person.lastName()} Comercio LTDA`
          .replace(/[^a-zA-ZÀ-ÿ\s]/g, ''),
      
      nomeFantasia:
        `${faker.person.lastName()} Comercio`
          .replace(/[^a-zA-ZÀ-ÿ\s]/g, ''),

      senha,

      confirmarSenha:
        senha,

      celular:
        this.gerarCelular(),

      telefone:
        this.gerarTelefoneFixo(),

        cep: '01310100',

        numero: faker.number.int({
          min: 10,
          max: 9999
        }).toString(),
        
        complemento: 'Escritorio'

    };
  }
}
