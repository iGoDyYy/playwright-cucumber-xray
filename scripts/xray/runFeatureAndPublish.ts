import { execSync } from 'child_process';

async function main() {
  try {
    console.log('Executando Cucumber...');
    execSync('npm run test:cadastro', {
      stdio: 'inherit'
    });
  } catch {
    console.log('Execução Cucumber finalizou com falha.');
  }

  console.log('Publicando resultado individual no Xray...');

  execSync(
    'npx ts-node scripts/xray/publishCucumberReportToXray.ts',
    {
      stdio: 'inherit'
    }
  );
}

main();