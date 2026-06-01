import axios from 'axios';

const API_BASE =
  'https://api.mailinator.com/api/v2/domains/public';

type MailinatorMessage = {
  id: string;
  subject?: string;
  from?: string;
};

function extrairLinkConfirmacao(conteudo: string): string | null {

  const links = conteudo.match(
    /https?:\/\/[^\s"'<>]+/g
  );

  if (!links?.length) {
    return null;
  }

  const linkConfirmacao = links.find(
    (url) =>
      /confirm|ativ|verif|token|cadastro|apponte/i.test(url)
  );

  return linkConfirmacao ?? links[0];
}

export class MailinatorClient {

  static extrairInbox(email: string): string {

    return email.split('@')[0];
  }

  static async aguardarLinkConfirmacao(
    inbox: string,
    opcoes: {
      timeoutMs?: number;
      intervaloMs?: number;
      assuntoOuRemetente?: RegExp;
    } = {}
  ): Promise<string> {

    const {
      timeoutMs = 120000,
      intervaloMs = 5000,
      assuntoOuRemetente = /apponte/i
    } = opcoes;

    const prazo = Date.now() + timeoutMs;

    while (Date.now() < prazo) {

      const { data } = await axios.get<{
        msgs?: MailinatorMessage[];
      }>(
        `${API_BASE}/inboxes/${inbox}`
      );

      const mensagens = data.msgs ?? [];

      const mensagem =
        mensagens.find(
          (msg) =>
            assuntoOuRemetente.test(msg.subject ?? '')
            || assuntoOuRemetente.test(msg.from ?? '')
        ) ?? mensagens[0];

      if (mensagem?.id) {

        const { data: detalhe } = await axios.get<{
          parts?: { body?: string }[];
          body?: string;
        }>(
          `${API_BASE}/messages/${mensagem.id}`
        );

        const corpo =
          detalhe.parts
            ?.map((parte) => parte.body ?? '')
            .join(' ')
          ?? detalhe.body
          ?? '';

        const link =
          extrairLinkConfirmacao(corpo);

        if (link) {
          return link;
        }
      }

      await new Promise(
        (resolve) => setTimeout(resolve, intervaloMs)
      );
    }

    throw new Error(
      `Nenhum e-mail de confirmação encontrado em ${inbox}@mailinator.com dentro do prazo.`
    );
  }
}
