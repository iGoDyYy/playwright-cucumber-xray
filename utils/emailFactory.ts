import { environment } from './environment';

export const emailFactory = {

  ultimoEmailGerado: '',

  gerarEmailResponsavelFiscal() {

    const timestamp =
      Date.now();

    const email = environment.isStaging
      ? `responsavel.fiscal.${timestamp}@teste.com`
      : `responsavel.fiscal.${timestamp}@mailinator.com`;

    this.ultimoEmailGerado =
      email;

    return email;
  },

  obterUltimoEmailGerado() {

    if (!this.ultimoEmailGerado) {
      throw new Error(
        'Nenhum e-mail foi gerado ainda.'
      );
    }

    return this.ultimoEmailGerado;
  }
};