import axios from 'axios';
import fs from 'fs';
import { getXrayToken } from './getToken';

type ExecutionData = {
  tests: {
    id: string;
    key: string;
    name: string;
  }[];
  testExecution: {
    id: string;
    key: string;
  };
};

type CucumberStep = {
  result?: {
    status?: string;
  };
};

type CucumberElement = {
  name: string;
  steps: CucumberStep[];
};

type CucumberFeature = {
  elements: CucumberElement[];
};

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getScenarioStatus(element: CucumberElement) {
  const hasFailedStep = element.steps.some(step =>
    step.result?.status !== 'passed'
  );

  return hasFailedStep ? 'FAILED' : 'PASSED';
}

async function main() {
  try {
    const executionData: ExecutionData = JSON.parse(
      fs.readFileSync(
        'scripts/xray/current-execution.json',
        'utf-8'
      )
    );

    const cucumberReport: CucumberFeature[] = JSON.parse(
      fs.readFileSync(
        'reports/cucumber-report.json',
        'utf-8'
      )
    );

    const cucumberScenarios = cucumberReport.flatMap(feature =>
      feature.elements || []
    );

    const testsPayload = executionData.tests.map(test => {
      const scenarioResult = cucumberScenarios.find(scenario =>
        normalize(scenario.name) === normalize(test.name)
      );

      if (!scenarioResult) {
        return {
          testKey: test.key,
          status: 'FAILED',
          comment: `Cenário "${test.name}" não encontrado no relatório Cucumber.`
        };
      }

      const status = getScenarioStatus(scenarioResult);

      return {
        testKey: test.key,
        status,
        comment: `Resultado individual importado do Cucumber. Cenário: ${test.name}`
      };
    });

    console.log('Resultados que serão enviados ao Xray:');
    console.log(JSON.stringify(testsPayload, null, 2));

    const token = await getXrayToken();

    const payload = {
      testExecutionKey: executionData.testExecution.key,
      tests: testsPayload
    };

    const response = await axios.post(
      'https://xray.cloud.getxray.app/api/v2/import/execution',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('RESULTADOS INDIVIDUAIS ENVIADOS AO XRAY');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('ERRO AO PUBLICAR RELATÓRIO CUCUMBER NO XRAY');
    console.log(error?.response?.data || error.message);
    process.exit(1);
  }
}

main();
