import fs from 'fs';

export type ExecutionTest = {
  id: string;
  key: string;
  name: string;
};

export type ExecutionData = {
  featurePath: string;
  tests: ExecutionTest[];
  testSet: {
    id: string;
    key: string;
  };
  testPlan: {
    id: string;
    key: string;
  };
  testExecution: {
    id: string;
    key: string;
  };
};

export const executionFilePath =
  'scripts/xray/current-execution.json';

export function salvarExecutionData(data: ExecutionData) {
  fs.writeFileSync(
    executionFilePath,
    JSON.stringify(data, null, 2)
  );
}

export function lerExecutionData() {
  return JSON.parse(
    fs.readFileSync(executionFilePath, 'utf-8')
  ) as ExecutionData;
}
