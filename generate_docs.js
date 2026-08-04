const fs = require('fs');
const path = require('path');

// Read the helpArticles.tsx source file
const content = fs.readFileSync('/home/nkr/Projects/Iyal-Inc Family/ActOneCode/src/data/helpArticles.tsx', 'utf8');

// Parse out categories
const categoriesMatch = content.match(/export const categories = \[(.*?)\];/s);
let categories = [];
if (categoriesMatch) {
  categories = eval('[' + categoriesMatch[1] + ']');
}

// Extract articles array content
const articlesMatch = content.match(/export const articles: HelpArticle\[\] = (\[.*?\]);\s*export const categories/s);
let articles = [];
if (articlesMatch) {
  articles = eval(articlesMatch[1]);
}

console.log(`Loaded ${articles.length} articles across ${categories.length} categories.`);

// Simple markdown to HTML converter for article content
function mdToHtml(md) {
  let html = md;
  
  // Code blocks
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/<kbd>(.*?)<\/kbd>/g, '<kbd>$1</kbd>');
  
  // Tables
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  let newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table class="docs-table"><thead>';
        let headers = line.split('|').slice(1, -1).map(h => h.trim());
        tableHtml += '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
      } else if (line.includes('---')) {
        // Separator line, skip
        continue;
      } else {
        let cells = line.split('|').slice(1, -1).map(c => c.trim());
        tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table>';
        newLines.push(tableHtml);
        tableHtml = '';
      }
      newLines.push(line);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table>';
    newLines.push(tableHtml);
  }
  
  html = newLines.join('\n');

  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>'); // basic wrapper
  
  // Paragraphs (double newline)
  let paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(p => {
    p = p.trim();
    if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<table') || p.startsWith('<ul') || p.startsWith('<hr')) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return html;
}

// Generate doc cards JSON for frontend index or build static single-page app
fs.writeFileSync('/home/nkr/Projects/Iyal-Inc Family/iyal-ink website/actone/docs/articles_data.json', JSON.stringify({ categories, articles }, null, 2));

console.log('Saved articles_data.json successfully.');
