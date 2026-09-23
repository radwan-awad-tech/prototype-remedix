const fs = require('fs');
const path = 'src/i18n/translations.ts';
let content = fs.readFileSync(path, 'utf8');

// The goal is to ensure all single quotes inside the translation values (which are wrapped in single quotes) are escaped.
// Since the file is structured as: key: 'value',
// we can use a regex to find the values and fix them.

const lines = content.split('\n');
const fixedLines = lines.map(line => {
    // Match lines like:    key: 'value',
    const match = line.match(/^(\s*\w+:\s*')(.*)(',?)$/);
    if (match) {
        const [full, start, value, end] = match;
        // Unescape first to avoid double escaping if some are already escaped
        let unescaped = value.replace(/\\'/g, "'");
        // Now escape all single quotes
        let escaped = unescaped.replace(/'/g, "\\'");
        return start + escaped + end;
    }
    return line;
});

fs.writeFileSync(path, fixedLines.join('\n'));
