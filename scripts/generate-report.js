const report = require('multiple-cucumber-html-reporter');

console.log('INICIANDO GERAÇÃO RELATÓRIO...');

report.generate({

  jsonDir: 'reports',

  reportPath: 'reports/html-report',

  metadata: {

    browser: {
      name: 'chrome',
      version: 'latest'
    },

    device: 'Local test machine',

    platform: {
      name: 'windows',
      version: '11'
    }
  },

  customData: {

    title: 'Execução Automação',

    data: [

      {
        label: 'Projeto',
        value: 'Playwright + Cucumber'
      },

      {
        label: 'QA',
        value: 'Matheus Faiotto'
      }
    ]
  }
});

console.log('RELATÓRIO GERADO!');