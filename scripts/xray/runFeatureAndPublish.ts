import { execSync } from 'child_process';

async function main() {
  const scriptName = process.argv[2];

  if (!scriptName) {
    throw new Error(
      'Informe o script do package.json. Exemplo: test:cadastro'
    );
  }

  try {
    console.log(`Executando Cucumber (${scriptName})...`);

    execSync(
      `npm run ${scriptName}`,
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