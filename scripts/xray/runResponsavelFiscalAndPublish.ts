import { execSync } from 'child_process';

async function main() {

  try {

    console.log('Executando testes do Responsável Fiscal...');

    execSync(
      'npm run test:responsavel-fiscal',
      {
        stdio: 'inherit'
      }
    );

  } catch {

    console.log(
      'Execução Cucumber finalizou com falha. Publicando resultado mesmo assim...'
    );

  }

  console.log(
    'Publicando resultado individual no Xray...'
  );

  execSync(
    'npx ts-node scripts/xray/publishCucumberReportToXray.ts',
    {
      stdio: 'inherit'
    }
  );

}

main();