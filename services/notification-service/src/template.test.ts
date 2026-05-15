import { renderTemplate } from './lib/template';
import fs from 'fs';
import path from 'path';

describe('Template Engine', () => {
  const testTemplatePath = path.join(__dirname, 'templates/test-template.html');

  beforeAll(() => {
    if (!fs.existsSync(path.join(__dirname, 'templates'))) {
      fs.mkdirSync(path.join(__dirname, 'templates'), { recursive: true });
    }
    fs.writeFileSync(testTemplatePath, '<html><body>Hello {{name}}! Your code is {{code}}.</body></html>');
  });

  afterAll(() => {
    if (fs.existsSync(testTemplatePath)) {
      fs.unlinkSync(testTemplatePath);
    }
  });

  it('should render template with variables', () => {
    const html = renderTemplate('test-template', { name: 'Syarif', code: 123456 });
    expect(html).toBe('<html><body>Hello Syarif! Your code is 123456.</body></html>');
  });

  it('should handle missing variables by replacing with empty string', () => {
    const html = renderTemplate('test-template', { name: 'Syarif' });
    expect(html).toBe('<html><body>Hello Syarif! Your code is .</body></html>');
  });

  it('should throw error if template not found', () => {
    expect(() => renderTemplate('non-existent', {})).toThrow();
  });
});
