import fs from 'fs';
import path from 'path';

const replacements = {
  'bg-white': 'bg-white dark:bg-slate-900',
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-950',
  'bg-slate-100': 'bg-slate-100 dark:bg-slate-900/80',
  'text-slate-900': 'text-slate-900 dark:text-white',
  'text-slate-800': 'text-slate-800 dark:text-slate-200',
  'text-slate-700': 'text-slate-700 dark:text-slate-300',
  'text-slate-600': 'text-slate-600 dark:text-slate-400',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'border-slate-100': 'border-slate-100 dark:border-slate-800/50',
  'border-slate-200': 'border-slate-200 dark:border-slate-700/80',
  'border-slate-300': 'border-slate-300 dark:border-slate-700',
  'bg-teal-50': 'bg-teal-50 dark:bg-teal-900/30',
  'bg-indigo-50': 'bg-indigo-50 dark:bg-indigo-900/30',
  'text-teal-900': 'text-teal-900 dark:text-teal-100',
  'text-teal-800': 'text-teal-800 dark:text-teal-300'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const [key, value] of Object.entries(replacements)) {
        // Regex to match the key only if it's not already preceded by dark: and not followed by a dash
        // We use negative lookbehind for dark: and positive lookbehind for boundary or quote/space
        const regex = new RegExp(`(?<!dark:)\\b${key}\\b(?!-)`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, value);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDir(path.join(process.cwd(), 'frontend', 'src'));
console.log('Dark mode classes applied successfully.');
