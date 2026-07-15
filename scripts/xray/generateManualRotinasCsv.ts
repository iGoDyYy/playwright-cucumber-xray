import fs from 'fs';
import path from 'path';

type ManualStep = {
  action: string;
  data?: string;
  result?: string;
};

type ManualTestData = {
  summary: string;
  description: string;
  priority: string;
  precondition: string;
  steps: ManualStep[];
};

const tests: ManualTestData[] = [
  {
    summary: 'Verificar se o período é filtrado corretamente',
    description:
      'Validar que, ao selecionar um período inicial e final no filtro Período, os registros exibidos correspondem corretamente ao intervalo selecionado.',
    priority: 'Medium',
    precondition:
      'Usuário autenticado com período válido disponível para consulta',
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
  }
];

function csv(value: string) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  
  function gerarCsv(tests: ManualTestData[]) {
    const linhas: string[] = [];
  
    linhas.push([
      'Summary',
      'Description',
      'Priority',
      'Precondition',
      'Step Action',
      'Step Data',
      'Step Expected Result'
    ].join(';'));
  
    for (const test of tests) {
      test.steps.forEach((step, index) => {
        linhas.push([
          index === 0 ? csv(test.summary) : '',
          index === 0 ? csv(test.description) : '',
          index === 0 ? test.priority : '',
          index === 0 ? csv(test.precondition) : '',
          csv(step.action),
          csv(step.data ?? ''),
          csv(step.result ?? '')
        ].join(';'));
      });
    }
  
    const outputDir = path.resolve('reports/xray');
  
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    const outputFile = path.join(
      outputDir,
      'manual-rotinas-tests.csv'
    );
  
    fs.writeFileSync(
      outputFile,
      linhas.join('\n'),
      'utf-8'
    );
  
    console.log(`CSV gerado com sucesso: ${outputFile}`);
  }
  
  gerarCsv(tests);