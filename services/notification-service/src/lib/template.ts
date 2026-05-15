import fs from 'fs';
import path from 'path';

/**
 * Simple template engine to render HTML templates with variables.
 * Placeholders should be in the format {{variableName}}.
 */
export const renderTemplate = (templateName: string, variables: Record<string, any>): string => {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName} not found at ${templatePath}`);
  }

  let template = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders {{key}} with values from variables object or empty string
  const placeholderRegex = /{{(\w+)}}/g;
  template = template.replace(placeholderRegex, (match, key) => {
    const value = variables[key];
    return value !== undefined && value !== null ? value.toString() : '';
  });

  return template;
};
