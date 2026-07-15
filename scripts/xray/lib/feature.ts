import fs from 'fs';

export type ScenarioData = {
  name: string;
  scenario: string;
  tags: string[];
};

export type PreconditionData = {
  name: string;
  scenario: string;
};

export function traduzirParaCucumberIngles(text: string) {
  return text
    .replace(/^Cenario:/gm, 'Scenario:')
    .replace(/^Cenário:/gm, 'Scenario:')
    .replace(/^Contexto:/gm, 'Background:')
    .replace(/^Dado /gm, 'Given ')
    .replace(/^Quando /gm, 'When ')
    .replace(/^Então /gm, 'Then ')
    .replace(/^Entao /gm, 'Then ')
    .replace(/^E /gm, 'And ');
}

export function carregarPreconditionDoFeature(pathFeature: string) {
  const feature = fs.readFileSync(pathFeature, 'utf-8');
  const lines = feature.split(/\r?\n/);

  let name = '';
  const contextLines: string[] = [];
  let insideContext = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (
      trimmed.toLowerCase().startsWith('contexto:') ||
      trimmed.toLowerCase().startsWith('background:')
    ) {
      insideContext = true;
      name = trimmed
        .replace(/^Contexto:/i, '')
        .replace(/^Background:/i, '')
        .trim();

      contextLines.push(trimmed);
      continue;
    }

    if (
      insideContext &&
      (
        trimmed.toLowerCase().startsWith('cenario:') ||
        trimmed.toLowerCase().startsWith('cenário:') ||
        trimmed.startsWith('@')
      )
    ) {
      break;
    }

    if (insideContext && trimmed !== '') {
      contextLines.push(trimmed);
    }
  }

  if (!name || contextLines.length === 0) {
    return null;
  }

  return {
    name,
    scenario: traduzirParaCucumberIngles(contextLines.join('\n'))
  } as PreconditionData;
}

export function carregarScenariosDoFeature(
  pathFeature: string,
  ignoredTags: string[] = ['@cadastro-real']
) {
  const feature = fs.readFileSync(pathFeature, 'utf-8');
  const lines = feature.split(/\r?\n/);

  const scenarios: ScenarioData[] = [];
  let pendingTags: string[] = [];
  let currentScenarioName = '';
  let currentScenarioLines: string[] = [];
  let currentScenarioTags: string[] = [];

  function salvarScenarioAtual() {
    if (!currentScenarioName) {
      return;
    }

    const shouldIgnore = currentScenarioTags.some(tag =>
      ignoredTags.includes(tag)
    );

    if (shouldIgnore) {
      return;
    }

    scenarios.push({
      name: currentScenarioName,
      tags: currentScenarioTags,
      scenario: traduzirParaCucumberIngles(
        currentScenarioLines.join('\n')
      )
    });
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('@')) {
      pendingTags.push(trimmed);
      continue;
    }

    if (
      trimmed.toLowerCase().startsWith('contexto:') ||
      trimmed.toLowerCase().startsWith('background:')
    ) {
      continue;
    }

    if (
      trimmed.toLowerCase().startsWith('cenario:') ||
      trimmed.toLowerCase().startsWith('cenário:')
    ) {
      salvarScenarioAtual();

      currentScenarioName = trimmed
        .replace(/^Cenario:/i, '')
        .replace(/^Cenário:/i, '')
        .trim();

      currentScenarioTags = pendingTags;
      pendingTags = [];
      currentScenarioLines = [trimmed];

      continue;
    }

    if (!currentScenarioName) {
      continue;
    }

    if (trimmed === '') {
      continue;
    }

    currentScenarioLines.push(trimmed);
  }

  salvarScenarioAtual();

  return scenarios;
}