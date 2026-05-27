const report = require('multiple-cucumber-html-reporter');

console.log('GERANDO RELATÓRIO...');

report.generate({

  jsonDir: 'reports',

  reportPath: 'reports/html-report',

  openReportInBrowser: true,

  saveCollectedJSON: true,

  displayDuration: true,

  pageTitle: 'Automação Apponte',

  reportName: 'Execução Automação QA',

  metadata: {

    browser: {
      name: 'chrome',
      version: 'latest'
    },

    device: 'QA Machine',

    platform: {
      name: 'windows',
      version: '11'
    }
  },

  customData: {

    title: 'Execução',

    data: [

      {
        label: 'Projeto',
        value: 'Playwright + Cucumber'
      },

      {
        label: 'QA',
        value: 'Matheus Faiotto'
      },

      {
        label: 'Ambiente',
        value: 'Produção'
      }
    ]
  }
});

console.log('RELATÓRIO GERADO!');
