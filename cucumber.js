module.exports = {
  default: {
    paths: ['features/*.feature'],
    require: ['steps/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'json:reports/cucumber-report.json'
    ]
  }
};
