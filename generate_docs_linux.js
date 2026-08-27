const fs = require('fs');
const path = require('path');

// Single source of truth — Linux path
const HELP_PATH = '/home/nkr/Projects/Iyal-Inc Family/ActOne-Screenplay/src/data/helpArticles.tsx';
const SHORTCUTS_PATH = '/home/nkr/Projects/Iyal-Inc Family/ActOne-Screenplay/src/constants/shortcuts.ts';
const OUT_JSON = path.join(__dirname, 'actone/docs/articles_data.json');
const OUT_JS   = path.join(__dirname, 'actone/docs/articles_data.js');

function loadShortcutsMarkdown() {
  const src = fs.readFileSync(SHORTCUTS_PATH, 'utf8');
  const registry = [];
  const re = /\{\s*id:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*,\s*category:\s*"([^"]+)"\s*,\s*keys:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const keys = [...m[4].matchAll(/"([^"]+)"/g)].map(k => k[1]);
    registry.push({ label: m[2], category: m[3], keys });
  }
  const cats = ["File & Document","Editor & Formatting","Navigation & View","Zoom & Interface"];
  let md = "ActOne is designed for keyboard-driven writing. Below is the complete list of shortcuts, automatically generated from system settings.\n\n";
  for (const cat of cats) {
    const items = registry.filter(i => i.category === cat);
    if (!items.length) continue;
    md += `**${cat}**\n\n`;
    md += `| Action | Shortcut |\n|--------|----------|\n`;
    for (const it of items) md += `| ${it.label} | ${it.keys.map(k => `<kbd>${k}</kbd>`).join(" + ")} |\n`;
    md += `\n`;
  }
  return md.trim();
}

const shortcutsMarkdown = loadShortcutsMarkdown();
let content = fs.readFileSync(HELP_PATH, 'utf8');
content = content.replace(/content:\s*generateShortcutsHelpMarkdown\(\)/g, `content: ${JSON.stringify(shortcutsMarkdown)}`);

const categories = eval('[' + content.match(/export const categories = \[(.*?)\];/s)[1] + ']');
const articles = eval('(' + content.match(/export const articles: HelpArticle\[\] = (\[.*?\]);\s*export const categories/s)[1] + ')');

console.log(`Loaded ${articles.length} articles across ${categories.length} categories.`);
for (const c of categories) console.log(`  ${c}: ${articles.filter(a => a.category === c).length}`);

const payload = { categories, articles };
fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2) + '\n');
console.log(`Wrote ${OUT_JSON}`);

const header = `// AUTO-GENERATED — DO NOT EDIT MANUALLY\n// Source: ActOne-Screenplay/src/data/helpArticles.tsx (single source of truth)\n// Generated: ${new Date().toISOString()}\n// To regenerate: node generate_docs_linux.js\n// Categories: ${categories.length} | Articles: ${articles.length}\n`;
fs.writeFileSync(OUT_JS, header + `const DOCS_DATA = ${JSON.stringify(payload, null, 2)};\n`);
console.log(`Wrote ${OUT_JS}`);
