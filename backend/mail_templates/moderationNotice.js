const { renderBaseTemplate, escapeHtml } = require('./baseTemplate');

module.exports = ({
  subject,
  heading,
  intro,
  details = [],
  ctaLabel,
  ctaUrl
}) => {
  const listItems = Array.isArray(details)
    ? details.filter(Boolean).map((item) => `<li style="margin:0 0 8px;">${escapeHtml(item)}</li>`).join('')
    : '';

  const bodyHtml = listItems
    ? `
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;">
        <ul style="margin:0;padding-left:20px;font-size:14px;color:#334155;">
          ${listItems}
        </ul>
      </div>
    `
    : '';

  return {
    subject: subject || 'Moderation Update',
    text: [intro, ...(Array.isArray(details) ? details.filter(Boolean) : [])].filter(Boolean).join('\n'),
    html: renderBaseTemplate({
      preheader: 'Moderation update from DEMS',
      heading: heading || 'Moderation Update',
      intro: intro || 'There is a new update regarding your report or appeal.',
      bodyHtml,
      ctaLabel,
      ctaUrl,
      supportEmail: process.env.SUPPORT_EMAIL
    })
  };
};
