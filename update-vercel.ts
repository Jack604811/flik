import fs from 'fs';
import path from 'path';
import { APP_DOMAIN, APP_SUBDOMAIN } from './src/app-settings'; // Adjust the path as needed

// Path to your template file and where the final vercel.json will be placed
const templatePath = path.join(__dirname, 'vercel.template.json');
const outputPath = path.join(__dirname, 'vercel.json');

// Function to replace placeholders in vercel.template.json
const updateVercelJson = () => {
  fs.readFile(templatePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      console.error('Error reading the template file', err);
      return;
    }

    // Replace placeholders with actual domain values from settings.ts
    const result = data
      .replace(/__APP_DOMAIN__/g, APP_DOMAIN)
      .replace(/__APP_SUBDOMAIN__/g, APP_SUBDOMAIN);

    fs.writeFile(outputPath, result, 'utf8', (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error('Error writing the vercel.json file', err);
      } else {
        console.log('vercel.json has been successfully generated!');
      }
    });
  });
};

// Execute the function to update vercel.json
updateVercelJson();
