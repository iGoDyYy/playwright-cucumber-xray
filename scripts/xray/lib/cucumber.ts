import fs from 'fs';

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

export function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function carregarCucumberReport(
  reportPath = 'reports/cucumber-report.json'
) {
  const cucumberReport: CucumberFeature[] = JSON.parse(
    fs.readFileSync(reportPath, 'utf-8')
  );

  return cucumberReport.flatMap(feature =>
    feature.elements || []
  );
}

export function getScenarioStatus(element: CucumberElement) {
  const hasFailedStep = element.steps.some(step =>
    step.result?.status !== 'passed'
  );

  return hasFailedStep ? 'FAILED' : 'PASSED';
}
