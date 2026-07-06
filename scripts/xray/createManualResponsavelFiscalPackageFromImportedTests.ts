import {
    criarIssue,
    buscarIssuePorSummary,
    criarIssueLink,
    issueTypes
  } from './lib/jira';
  
  import {
    adicionarPreconditionsAoTest,
    adicionarTestsAoTestExecution,
    adicionarTestsAoTestPlan,
    adicionarTestsAoTestSet,
    associarTestExecutionAoTestPlan,
    atualizarDefinicaoManualPrecondition
  } from './lib/xray';
  
  interface PreconditionData {
    code: string;
    title: string;
    description: string;
  }
  
  interface TestMapping {
    tcid: number;
    summary: string;
    preconditionCode: string;
  }
  
  const developmentIssueKey = process.argv[2];
  
  if (!developmentIssueKey) {
    throw new Error('Informe a AP. Exemplo: AP-1');
  }
  
  const preconditions: PreconditionData[] = [
    {
      code: 'PC-01',
      title: 'Acesso ao painel administrativo',
      description: `Eu como QA,
  Gostaria de logar no painel administrativo com um usuário administrador ativo,
  Porque assim consigo acessar as abas de colaboradores e de empresas para realizar os testes de validação.`
    },
    {
      code: 'PC-02',
      title: 'Existência de um responsável fiscal cadastrado',
      description: `Eu como QA,
  Gostaria que já exista um responsável fiscal cadastrado com e-mail válido no sistema,
  Porque assim consigo validar o envio do e-mail e a confirmação do processo.`
    },
    {
      code: 'PC-03',
      title: 'Acesso à caixa de e-mail do responsável fiscal',
      description: `Eu como QA,
  Gostaria de ter acesso à caixa de entrada do e-mail cadastrado como responsável fiscal,
  Porque assim consigo verificar se a mensagem de validação é enviada e consigo concluir a validação clicando no botão recebido.`
    },
    {
      code: 'PC-04',
      title: 'Configuração de mensagens no painel administrativo',
      description: `Eu como QA,
  Gostaria que na aba de Colaboradores seja exibida a mensagem “Verifique o e-mail do responsável fiscal: [Nome] – Valide o e-mail de faturamento”,
  Porque assim consigo testar o atalho direto para a edição de dados fiscais e validação do e-mail.`
    },
    {
      code: 'PC-05',
      title: 'Acesso ao menu Empresas habilitado',
      description: `Eu como QA,
  Gostaria de ter habilitado o acesso ao menu Empresas > Gerenciar Empresas > Dados Fiscais,
  Porque assim consigo testar a segunda forma de chegar na tela de edição e validação de e-mail.`
    }
  ];
  
  const tests: TestMapping[] = [
    {
      tcid: 1,
    summary: 'Validar responsavel fiscal pela aba de colaboradores',
      preconditionCode: 'PC-04'
    },
    {
      tcid: 2,
    summary: 'Validar responsavel fiscal pela aba de dados fiscais',
      preconditionCode: 'PC-05'
    },
    {
      tcid: 3,
      summary: 'Exibição do pop-up após clicar em Validar e-mail',
      preconditionCode: 'PC-02'
    },
    {
      tcid: 4,
      summary: 'Conteúdo do pop-up exibido',
      preconditionCode: 'PC-02'
    },
    {
      tcid: 5,
      summary: 'Receber o e-mail de validação no endereço informado',
      preconditionCode: 'PC-03'
    },
    {
      tcid: 6,
      summary: 'Validar e-mail clicando no botão dentro da mensagem recebida',
      preconditionCode: 'PC-03'
    },
    {
      tcid: 7,
      summary: 'Exibir mensagem de confirmação após validação',
      preconditionCode: 'PC-02'
    },
    {
      tcid: 8,
      summary: 'Confirmar que responsável fiscal aparece como validado após a confirmação',
      preconditionCode: 'PC-02'
    },
    {
      tcid: 9,
      summary: 'Garantir que mensagens de aviso não sejam mais exibidas após validação',
      preconditionCode: 'PC-01'
    }
  ];
  
  const packageConfig = {
    modulo: 'Responsável Fiscal - Validação de e-mail',
  
    testSet: {
      summary:
        'Validação da gestão de Responsável Fiscal - Validação de e-mail no Painel Administrativo.',
      description:
        `Eu como QA,
  
  Gostaria de validar os fluxos de Responsável Fiscal - Validação de e-mail no Painel Administrativo,
  
  Porque assim consigo garantir o funcionamento correto da funcionalidade, incluindo validações de regras de negócio, persistência das informações e controle de permissões.`
    },
  
    testPlan: {
      summary:
        'Validação da gestão de Responsável Fiscal - Validação de e-mail no Painel Administrativo.',
      description:
        `Eu como QA
  
  Gostaria de testar todas as funcionalidades relacionadas a Responsável Fiscal - Validação de e-mail no Painel Administrativo
  
  Porque assim consigo garantir o correto funcionamento das regras de negócio, persistência das informações e controle de permissões da funcionalidade.`
    },
  
    testExecution: {
      summary:
        'Execução de testes da gestão de Responsável Fiscal - Validação de e-mail no Painel Administrativo.',
      description:
        `Eu como QA
  
  Gostaria de executar todos os testes relacionados a Responsável Fiscal - Validação de e-mail no Painel Administrativo
  
  Porque assim consigo garantir o correto funcionamento das regras de negócio, persistência das informações e controle de permissões da funcionalidade.`
    }
  };
  
  type XrayIssue = {
    id: string;
    key: string;
  };
  
  type PreconditionResult = XrayIssue & {
    code: string;
  };
  
  type TestResult = XrayIssue & {
    tcid: number;
    summary: string;
    preconditionCode: string;
  };
  
  async function buscarOuCriarPrecondition(
    precondition: PreconditionData
  ): Promise<PreconditionResult> {
    const issue = await buscarIssuePorSummary(
      precondition.title,
      issueTypes.precondition
    );
  
    if (issue) {
      console.log(`PRECONDITION EXISTENTE: ${issue.issueKey}`);
  
      await atualizarDefinicaoManualPrecondition(
        issue.issueId,
        precondition.description
      );
  
      return {
        id: issue.issueId,
        key: issue.issueKey,
        code: precondition.code
      };
    }
  
    const nova = await criarIssue(
      precondition.title,
      '',
      issueTypes.precondition
    );
  
    await atualizarDefinicaoManualPrecondition(
      nova.issueId,
      precondition.description
    );
  
    console.log(`PRECONDITION CRIADA: ${nova.issueKey}`);
  
    return {
      id: nova.issueId,
      key: nova.issueKey,
      code: precondition.code
    };
  }
  
  async function buscarTestImportado(
    test: TestMapping
  ): Promise<TestResult> {
    const issue = await buscarIssuePorSummary(
      test.summary,
      issueTypes.test
    );
  
    if (!issue) {
      throw new Error(
        `Test importado não encontrado no Jira/Xray: TCID ${test.tcid} - ${test.summary}`
      );
    }
  
    console.log(`TEST IMPORTADO ENCONTRADO: ${issue.issueKey}`);
  
    return {
      id: issue.issueId,
      key: issue.issueKey,
      tcid: test.tcid,
      summary: test.summary,
      preconditionCode: test.preconditionCode
    };
  }
  
  async function buscarOuCriarArtefato(
    summary: string,
    description: string,
    issueType: string,
    label: string
  ): Promise<XrayIssue> {
    const issue = await buscarIssuePorSummary(
      summary,
      issueType
    );
  
    if (issue) {
      console.log(`${label} EXISTENTE: ${issue.issueKey}`);
  
      return {
        id: issue.issueId,
        key: issue.issueKey
      };
    }
  
    const novo = await criarIssue(
      summary,
      description,
      issueType
    );
  
    console.log(`${label} CRIADO: ${novo.issueKey}`);
  
    return {
      id: novo.issueId,
      key: novo.issueKey
    };
  }
  
  async function main() {
    console.log('Buscando/criando Preconditions...');
  
    const preconditionsCriadas: PreconditionResult[] = [];
  
    for (const precondition of preconditions) {
      const criada = await buscarOuCriarPrecondition(precondition);
      preconditionsCriadas.push(criada);
    }
  
    console.log('Buscando Tests importados...');
  
    const testsEncontrados: TestResult[] = [];
  
    for (const test of tests) {
      const encontrado = await buscarTestImportado(test);
      testsEncontrados.push(encontrado);
    }
  
    console.log('Ligando Preconditions aos Tests...');
  
    for (const test of testsEncontrados) {
      const precondition = preconditionsCriadas.find(
        item => item.code === test.preconditionCode
      );
  
      if (!precondition) {
        throw new Error(
          `Precondition não encontrada para o TCID ${test.tcid}: ${test.preconditionCode}`
        );
      }
  
      await adicionarPreconditionsAoTest(
        test.id,
        [precondition.id]
      );
  
      await criarIssueLink(
        precondition.key,
        test.key
      );
    }
  
    const testIds = testsEncontrados.map(test => test.id);
  
    const testSet = await buscarOuCriarArtefato(
      packageConfig.testSet.summary,
      packageConfig.testSet.description,
      issueTypes.testSet,
      'TEST SET'
    );
  
    const testPlan = await buscarOuCriarArtefato(
      packageConfig.testPlan.summary,
      packageConfig.testPlan.description,
      issueTypes.testPlan,
      'TEST PLAN'
    );
  
    const testExecution = await criarIssue(
      packageConfig.testExecution.summary,
      packageConfig.testExecution.description,
      issueTypes.testExecution
    );
  
    console.log(`TEST EXECUTION CRIADO: ${testExecution.issueKey}`);
  
    console.log('Adicionando Tests ao Test Set, Test Plan e Test Execution...');
  
    await adicionarTestsAoTestSet(
      testSet.id,
      testIds
    );
  
    await adicionarTestsAoTestPlan(
      testPlan.id,
      testIds
    );
  
    await adicionarTestsAoTestExecution(
      testExecution.issueId,
      testIds
    );
  
    await associarTestExecutionAoTestPlan(
      testPlan.id,
      testExecution.issueId
    );
  
    console.log('Criando vínculos Jira...');
  
    for (const test of testsEncontrados) {
      await criarIssueLink(testSet.key, test.key);
      await criarIssueLink(testPlan.key, test.key);
      await criarIssueLink(testExecution.issueKey, test.key);
    }
  
    await criarIssueLink(testPlan.key, testExecution.issueKey);
  
    await criarIssueLink(developmentIssueKey, testSet.key);
    await criarIssueLink(developmentIssueKey, testPlan.key);
    await criarIssueLink(developmentIssueKey, testExecution.issueKey);
  
    for (const precondition of preconditionsCriadas) {
      await criarIssueLink(developmentIssueKey, precondition.key);
    }
  
    console.log('PACOTE MANUAL DE RESPONSÁVEL FISCAL CRIADO COM SUCESSO');
  
    console.log(JSON.stringify({
      developmentIssueKey,
      preconditions: preconditionsCriadas,
      tests: testsEncontrados,
      testSet,
      testPlan,
      testExecution: {
        id: testExecution.issueId,
        key: testExecution.issueKey
      }
    }, null, 2));
  }
  
  main().catch((error) => {
    console.error('ERRO AO CRIAR PACOTE MANUAL DE RESPONSÁVEL FISCAL');
    console.error(error);
    process.exit(1);
  });
