import { spawnSync } from 'child_process';

const developmentIssueKey = process.argv[2];

if (!developmentIssueKey) {
  throw new Error('Informe a AP. Exemplo: AP-1');
}

function executar(comando: string, args: string[]) {
  const result = spawnSync(comando, args, {
    stdio: 'inherit',
    shell: true
  });

  if (result.status !== 0) {
    throw new Error(`Comando falhou: ${comando} ${args.join(' ')}`);
  }
}

console.log('PASSO 1: Importando CSV pelo Test Case Importer...');
executar('npx', [
  'ts-node',
  'scripts/xray/importCsvViaUI.ts'
]);

console.log('PASSO 2: Criando pacote Xray manual...');
executar('npx', [
  'ts-node',
  'scripts/xray/createManualAusenciasPackageFromImportedTests.ts',
  developmentIssueKey
]);

console.log('PROCESSO COMPLETO FINALIZADO COM SUCESSO');