import fs from 'fs';
import path from 'path';

export const getStub = (basePath: string) => (stub: string) => {
  return fs.readFileSync(
    path.resolve(__dirname, `./stubs/${basePath}/${stub}`),
    { encoding: 'utf8' }
  );
};

export const saveSnapshot = (basePath: string) => (
  stub: string,
  content: string
) => {
  const segments = stub.split('.');
  segments.splice(-1, 0, 'result');
  const fileName = segments.join('.');

  fs.writeFileSync(
    path.resolve(__dirname, `./stubs/${basePath}/${fileName}`),
    content
  );
};
