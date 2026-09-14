const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const renderSafeMarkdown = (markdown = '') => {
  const lines = escapeHtml(markdown).split('\n');
  const html = [];
  let listOpen = false;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${paragraph.join('<br/>')}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listOpen) return;
    html.push('</ul>');
    listOpen = false;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }

    const formatted = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    if (formatted.startsWith('## ')) {
      flushParagraph();
      closeList();
      html.push(`<h2>${formatted.slice(3)}</h2>`);
      return;
    }

    if (formatted.startsWith('# ')) {
      flushParagraph();
      closeList();
      html.push(`<h1>${formatted.slice(2)}</h1>`);
      return;
    }

    if (formatted.startsWith('- ')) {
      flushParagraph();
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${formatted.slice(2)}</li>`);
      return;
    }

    closeList();
    paragraph.push(formatted);
  });

  flushParagraph();
  closeList();

  return { __html: html.join('\n') };
};
