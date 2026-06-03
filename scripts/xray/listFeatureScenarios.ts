import fs from 'fs';

const featurePath = 'features/cadastro.feature';

function traduzirParaCucumberIngles(text: string) {
  return text
    .replace(/^Cenario:/gm, 'Scenario:')
    .replace(/^Cenário:/gm, 'Scenario:')
    .replace(/^Dado /gm, 'Given ')
    .replace(/^Quando /gm, 'When ')
    .replace(/^Então /gm, 'Then ')
    .replace(/^Entao /gm, 'Then ')
    .replace(/^E /gm, 'And ');
}

function carregarScenariosDoFeature(path: string) {
  const feature = fs.readFileSync(path, 'utf-8');
  const lines = feature.split(/\r?\n/);

  const scenarios: {
    name: string;
    scenario: string;
  }[] = [];

  let currentScenarioName = '';
  let currentScenarioLines: string[] = [];

  function salvarScenarioAtual() {
    if (!currentScenarioName) {
      return;
    }

    const scenario = traduzirParaCucumberIngles(
      currentScenarioLines.join('\n')
    );

    scenarios.push({
      name: currentScenarioName,
      scenario
    });
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (
      trimmed.toLowerCase().startsWith('cenario:') ||
      trimmed.toLowerCase().startsWith('cenário:')
    ) {
      salvarScenarioAtual();

      currentScenarioName = trimmed
        .replace(/^Cenario:/i, '')
        .replace(/^Cenário:/i, '')
        .trim();

      currentScenarioLines = [trimmed];

      continue;
    }

    if (!currentScenarioName) {
      continue;
    }

    if (trimmed.startsWith('@') || trimmed === '') {
      continue;
    }

    currentScenarioLines.push(trimmed);
  }

  salvarScenarioAtual();

  return scenarios;
}

const scenarios = carregarScenariosDoFeature(featurePath);

console.log(`Cenários encontrados em ${featurePath}:`);
console.log(JSON.stringify(scenarios, null, 2));