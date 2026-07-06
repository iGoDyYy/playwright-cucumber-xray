import dotenv from 'dotenv';

import {
  buscarIssuePorSummary,
  criarIssue,
  criarIssueLink,
  issueTypes
} from './lib/jira';

import {
  adicionarPreconditionsAoTest,
  adicionarTestsAoTestExecution,
  adicionarTestsAoTestPlan,
  adicionarTestsAoTestSet,
  associarTestExecutionAoTestPlan,
  adicionarPassoManualAoTest,
  atualizarDefinicaoManualPrecondition
} from './lib/xray';

import {
  salvarExecutionData
} from './lib/execution';

dotenv.config();

const developmentIssueKey = process.argv[2];

if (!developmentIssueKey) {
  throw new Error(
    'Informe a AP vinculada. Exemplo: AP-123'
  );
}

type PreconditionData = {
  code: string;
  title: string;
  description: string;
};

type ManualStep = {
  action: string;
  data?: string;
  result?: string;
};

type ManualTestData = {
  tcid: number;
  summary: string;
  description: string;
  priority: string;
  preconditionCode: string;
  steps: ManualStep[];
};
const preconditions: PreconditionData[] = [
  {
    code: 'PC-01',
    title: 'Usuário autenticado no painel administrativo',
    description: `Eu como QA,

Gostaria de estar autenticado no painel administrativo Apponte.me utilizando um e-mail e senha válidos de um usuário com permissão de acesso, através de um navegador web compatível,

Porque assim consigo iniciar e validar os fluxos disponíveis dentro do painel administrativo.`
  },
  {
    code: 'PC-02',
    title: 'Usuário autenticado e posicionado na página Rotinas',
    description: `Eu como QA,

Gostaria de estar autenticado no painel administrativo Apponte.me com um usuário que possua permissão de acesso à página Rotinas, estando posicionado dentro desta funcionalidade,

Porque assim consigo validar os comportamentos e fluxos disponíveis na página de Rotinas.`
  },
  {
    code: 'PC-03',
    title: 'Usuário autenticado com colaborador cadastrado',
    description: `Eu como QA,

Gostaria de estar autenticado no painel administrativo Apponte.me com ao menos um colaborador previamente cadastrado no sistema,

Porque assim consigo validar corretamente os fluxos de seleção de colaborador em marcações manuais e ausências.`
  },
  {
    code: 'PC-07',
    title: 'Usuário autenticado com período válido disponível para consulta',
    description: `Eu como QA,

Gostaria de estar autenticado no painel administrativo Apponte.me e possuir datas válidas disponíveis para seleção no filtro de período,

Porque assim consigo validar corretamente os fluxos dependentes da seleção de período.`
  }
];

const manualTests: ManualTestData[] = [
  {
    tcid: 1,
    summary: 'Verificar a exibição da aba "Rotinas" no menu lateral',
    description:
      'Validar que a aba "Rotinas" seja exibida corretamente no menu lateral esquerdo do painel administrativo.',
    priority: 'Medium',
    preconditionCode: 'PC-01',
    steps: [
      {
        action: 'Acesse a página inicial do painel administrativo.'
      },
      {
        action: 'Localize a aba "Rotinas" no menu lateral esquerdo.',
        result:
          'A aba "Rotinas" é exibida corretamente no menu lateral esquerdo do painel administrativo.'
      }
    ]
  },
  {
    tcid: 2,
    summary: 'Verificar o redirecionamento ao acessar a aba "Rotinas"',
    description:
      'Validar que, ao clicar na aba "Rotinas", o usuário seja redirecionado corretamente para a página de Rotinas.',
    priority: 'Medium',
    preconditionCode: 'PC-01',
    steps: [
      {
        action: 'Acesse a página inicial do painel administrativo.'
      },
      {
        action: 'Localize a aba "Rotinas" no menu lateral esquerdo.'
      },
      {
        action: 'Clique na aba "Rotinas".',
        result:
          'O usuário é redirecionado corretamente para a página de Rotinas.'
      }
    ]
  },
  {
    tcid: 3,
    summary:
      'Verificar a exibição do botão "Período" acima do botão "Marcação manual"',
    description:
      'Validar que o botão "Período" seja exibido corretamente na página de "Rotinas", acima do botão "Marcação manual".',
    priority: 'Medium',
    preconditionCode: 'PC-02',
    steps: [
      {
        action: 'Acesse a página de "Rotinas".'
      },
      {
        action:
          'Observe a área localizada acima do botão "Marcação manual".',
        result:
          'O botão "Período" é exibido corretamente acima do botão "Marcação manual".'
      }
    ]
  },
  {
    tcid: 4,
    summary:
      'Verificar a exibição do botão "Marcação manual" abaixo do botão "Período"',
    description:
      'Validar que o botão "Marcação manual" seja exibido corretamente na página de "Rotinas", abaixo do botão "Período".',
    priority: 'Medium',
    preconditionCode: 'PC-02',
    steps: [
      {
        action: 'Acesse a página de "Rotinas".'
      },
      {
        action:
          'Observe a área localizada abaixo do botão "Período".',
        result:
          'O botão "Marcação manual" é exibido corretamente abaixo do botão "Período".'
      }
    ]
  },
  {
    tcid: 5,
    summary:
      'Verificar a exibição do botão "Ausência" abaixo do botão "Marcação manual"',
    description:
      'Validar que o botão "Ausência" seja exibido corretamente na página de "Rotinas", abaixo do botão "Marcação manual".',
    priority: 'Medium',
    preconditionCode: 'PC-02',
    steps: [
      {
        action: 'Acesse a página de "Rotinas".'
      },
      {
        action:
          'Observe a área localizada abaixo do botão "Marcação manual".',
        result:
          'O botão "Ausência" é exibido corretamente abaixo do botão "Marcação manual".'
      }
    ]
  },
  {
    tcid: 6,
    summary: 'Verificar o funcionamento do botão "Período"',
    description:
      'Validar que, ao clicar no botão "Período", os dois calendários sejam exibidos corretamente, permitindo a seleção do período desejado.',
    priority: 'Medium',
    preconditionCode: 'PC-02',
    steps: [
      {
        action: 'Acesse a página de "Rotinas".'
      },
      {
        action: 'Clique no botão "Período".',
        result:
          'Os dois calendários são exibidos corretamente, permitindo a seleção do período desejado.'
      }
    ]
  },
  {
    tcid: 7,
    summary: 'Verificar o funcionamento do botão "Marcação manual"',
    description:
      'Validar que, ao clicar no botão "Marcação manual", os campos necessários para preenchimento sejam exibidos corretamente.',
    priority: 'Medium',
    preconditionCode: 'PC-02',
    steps: [
      {
        action: 'Acesse a página de "Rotinas".'
      },
      {
        action: 'Clique no botão "Marcação manual".',
        result:
          'Os campos Tipo de marcação, Horário da marcação e Motivo são exibidos corretamente.'
      }
    ]
  },
  {
    tcid: 8,
    summary: 'Verificar se o período é filtrado corretamente',
    description:
      'Validar que, ao selecionar um período inicial e final no filtro Período, os registros exibidos correspondem corretamente ao intervalo selecionado.',
    priority: 'Medium',
    preconditionCode: 'PC-07',
    steps: [
      {
        action: 'Acesse a página de "Rotinas".'
      },
      {
        action: 'Clique no botão "Período".'
      },
      {
        action:
          'Selecione uma data inicial e uma data final nos calendários exibidos.'
      },
      {
        action:
          'Confirme a seleção do período clicando em Aplicar.',
        result:
          'O período é filtrado corretamente, exibindo apenas os registros correspondentes ao intervalo selecionado.'
      }
    ]
  },
  {
    tcid: 9,
    summary:
      'Verificar a correspondência entre Marcação manual e o colaborador selecionado (Entrada)',
    description:
      'Validar que a marcação manual do tipo Entrada seja registrada corretamente para o colaborador selecionado.',
    priority: 'Medium',
    preconditionCode: 'PC-03',
    steps: [
      {
        action: 'Acesse a página de "Rotinas".'
      },
      {
        action: 'Clique no botão "Período".'
      },
      {
        action:
          'Selecione uma data inicial e uma data final.'
      },
      {
        action:
          'Confirme a seleção do período clicando em Aplicar.'
      },
      {
        action: 'Clique no botão "Marcação manual".'
      },
      {
        action:
          'Selecione o Tipo de marcação como Entrada.'
      },
      {
        action:
          'Informe o horário da marcação.'
      },
      {
        action:
          'Informe o motivo da marcação manual.'
      },
      {
        action:
          'Selecione o colaborador desejado.'
      },
      {
        action: 'Clique em Salvar.',
        result:
          'A marcação manual do tipo Entrada é registrada corretamente para o colaborador selecionado.'
      }
    ]
  },
  {
    tcid: 10,
    summary:
      'Verificar a correspondência entre Marcação manual e o colaborador selecionado (Saída para o almoço)',
    description:
      'Validar que a marcação manual do tipo Saída para o almoço seja registrada corretamente para o colaborador selecionado.',
    priority: 'Medium',
    preconditionCode: 'PC-03',
    steps: [
      {
        action: 'Acesse a página de "Rotinas".'
      },
      {
        action: 'Clique no botão "Período".'
      },
      {
        action:
          'Selecione uma data inicial e uma data final.'
      },
      {
        action:
          'Confirme a seleção do período clicando em Aplicar.'
      },
      {
        action: 'Clique no botão "Marcação manual".'
      },
      {
        action:
          'Selecione o Tipo de marcação como Saída para o almoço.'
      },
      {
        action:
          'Informe o horário da marcação.'
      },
      {
        action:
          'Informe o motivo da marcação manual.'
      },
      {
        action:
          'Selecione o colaborador desejado.'
      },
      {
        action: 'Clique em Salvar.',
        result:
          'A marcação manual do tipo Saída para o almoço é registrada corretamente para o colaborador selecionado.'
      }
    ]
  }
];

function montarDescricaoTeste(test: ManualTestData) {
  return test.description;
}

async function buscarOuCriarPrecondition(
  precondition: PreconditionData
) {
  const summary = precondition.title;

  let issue = await buscarIssuePorSummary(
    summary,
    issueTypes.precondition
  );

  if (issue) {
    console.log(`PRECONDITION EXISTENTE: ${issue.issueKey}`);

    await atualizarDefinicaoManualPrecondition(
      issue.issueId,
      precondition.description
    );

    console.log(`MANUAL DEFINITION ATUALIZADA: ${issue.issueKey}`);

    return {
      id: issue.issueId,
      key: issue.issueKey,
      code: precondition.code
    };
  }

  const novaPrecondition = await criarIssue(
    summary,
    '',
    issueTypes.precondition
  );

  await atualizarDefinicaoManualPrecondition(
    novaPrecondition.issueId,
    precondition.description
  );

  console.log(`PRECONDITION CRIADA: ${novaPrecondition.issueKey}`);
  console.log(`MANUAL DEFINITION ATUALIZADA: ${novaPrecondition.issueKey}`);

  return {
    id: novaPrecondition.issueId,
    key: novaPrecondition.issueKey,
    code: precondition.code
  };
}

async function buscarOuCriarManualTest(
  test: ManualTestData
) {
  const summary = test.summary;

  let issue = await buscarIssuePorSummary(
    summary,
    issueTypes.test
  );

  if (issue) {
    console.log(`MANUAL TEST EXISTENTE: ${issue.issueKey}`);

    return {
      id: issue.issueId,
      key: issue.issueKey,
      tcid: test.tcid,
      preconditionCode: test.preconditionCode,
      steps: test.steps
    };
  }

  const novoTest = await criarIssue(
    summary,
    montarDescricaoTeste(test),
    issueTypes.test
  );

  console.log(`MANUAL TEST CRIADO: ${novoTest.issueKey}`);

  return {
    id: novoTest.issueId,
    key: novoTest.issueKey,
    tcid: test.tcid,
    preconditionCode: test.preconditionCode,
    steps: test.steps
  };
}

async function buscarOuCriarTestSet() {
  const summary = 'Validação manual do fluxo de Rotinas';

  let issue = await buscarIssuePorSummary(
    summary,
    issueTypes.testSet
  );

  if (issue) {
    console.log(`TEST SET EXISTENTE: ${issue.issueKey}`);

    return {
      issueId: issue.issueId,
      issueKey: issue.issueKey
    };
  }

  const novo = await criarIssue(
    summary,
    'Agrupamento dos testes manuais relacionados ao fluxo de Rotinas.',
    issueTypes.testSet
  );

  console.log(`TEST SET CRIADO: ${novo.issueKey}`);

  return novo;
}

async function buscarOuCriarTestPlan() {
  const summary = 'Validação manual do fluxo de Rotinas';

  let issue = await buscarIssuePorSummary(
    summary,
    issueTypes.testPlan
  );

  if (issue) {
    console.log(`TEST PLAN EXISTENTE: ${issue.issueKey}`);

    return {
      issueId: issue.issueId,
      issueKey: issue.issueKey
    };
  }

  const novo = await criarIssue(
    summary,
    'Plano de testes manuais relacionados ao fluxo de Rotinas.',
    issueTypes.testPlan
  );

  console.log(`TEST PLAN CRIADO: ${novo.issueKey}`);

  return novo;
}

async function main() {
  try {
    console.log('Importando Preconditions manuais...');

    const createdPreconditions = [];

    for (const precondition of preconditions) {
      const created = await buscarOuCriarPrecondition(
        precondition
      );

      createdPreconditions.push(created);
    }

    console.log('Importando Manual Tests...');

    const createdTests = [];

    for (const test of manualTests) {
      const created = await buscarOuCriarManualTest(test);
      createdTests.push(created);
    }

    console.log('Ligando Preconditions aos Manual Tests...');

    for (const test of createdTests) {
      const precondition = createdPreconditions.find(
        item => item.code === test.preconditionCode
      );

      if (!precondition) {
        throw new Error(
          `Precondition ${test.preconditionCode} não encontrada para TCID ${test.tcid}`
        );
      }

      await adicionarPreconditionsAoTest(
        test.id,
        [precondition.id]
      );

      await criarIssueLink(precondition.key, test.key);
    }

    console.log('Adicionando passos manuais aos Tests...');

    for (const test of createdTests) {
      for (const step of test.steps) {
        await adicionarPassoManualAoTest(
          test.id,
          step.action,
          step.data || '',
          step.result || ''
        );
      }
    }

    const testIds = createdTests.map(test => test.id);

    const testSet = await buscarOuCriarTestSet();

    await adicionarTestsAoTestSet(
      testSet.issueId,
      testIds
    );

    const testPlan = await buscarOuCriarTestPlan();

    await adicionarTestsAoTestPlan(
      testPlan.issueId,
      testIds
    );

    console.log('Criando Test Execution manual...');

    const testExecution = await criarIssue(
      'Execução manual - Rotinas',
      'Execução manual dos testes relacionados ao fluxo de Rotinas.',
      issueTypes.testExecution
    );

    await adicionarTestsAoTestExecution(
      testExecution.issueId,
      testIds
    );

    await associarTestExecutionAoTestPlan(
      testPlan.issueId,
      testExecution.issueId
    );

    console.log('Criando vínculos Jira...');

    for (const test of createdTests) {
      await criarIssueLink(testSet.issueKey, test.key);
      await criarIssueLink(testPlan.issueKey, test.key);
      await criarIssueLink(testExecution.issueKey, test.key);
    }

    await criarIssueLink(testPlan.issueKey, testExecution.issueKey);

    await criarIssueLink(developmentIssueKey, testSet.issueKey);
    await criarIssueLink(developmentIssueKey, testPlan.issueKey);
    await criarIssueLink(developmentIssueKey, testExecution.issueKey);

    for (const precondition of createdPreconditions) {
      await criarIssueLink(developmentIssueKey, precondition.key);
    }

    const executionData = {
      featurePath: 'manual/rotinas',
      mode: 'manual',
      module: 'rotinas',
      developmentIssueKey,
      preconditions: createdPreconditions,
      tests: createdTests,
      testSet: {
        id: testSet.issueId,
        key: testSet.issueKey
      },
      testPlan: {
        id: testPlan.issueId,
        key: testPlan.issueKey
      },
      testExecution: {
        id: testExecution.issueId,
        key: testExecution.issueKey
      }
    };

    salvarExecutionData(executionData);

    console.log('IMPORTAÇÃO MANUAL DE ROTINAS CONCLUÍDA COM SUCESSO');
    console.log(JSON.stringify(executionData, null, 2));
  } catch (error: any) {
    console.log('ERRO AO IMPORTAR TESTES MANUAIS DE ROTINAS');
    console.log(error?.response?.data || error.message);
  }
}

main();
