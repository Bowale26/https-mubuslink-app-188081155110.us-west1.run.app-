/**
 * Export Utility for MUBUSLINK AI APP
 * Handles generation and download of various file formats.
 */

export type ExportFormat = 'txt' | 'md' | 'html' | 'json' | 'csv' | 'pdf';

export const exportFile = (content: string, filename: string, format: ExportFormat) => {
  let mimeType = 'text/plain';
  let finalContent = content;

  switch (format) {
    case 'md':
      mimeType = 'text/markdown';
      break;
    case 'html':
      mimeType = 'text/html';
      break;
    case 'json':
      mimeType = 'application/json';
      break;
    case 'csv':
      mimeType = 'text/csv';
      break;
    case 'pdf':
      // Note: Real PDF generation usually requires a library like jspdf.
      // For this prototype, we'll export as a formatted HTML that can be printed to PDF.
      mimeType = 'text/html';
      finalContent = `
        <html>
          <head>
            <style>
              body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
              h1 { color: #1a56db; }
              pre { background: #f4f4f4; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            ${content.replace(/\n/g, '<br>')}
          </body>
        </html>
      `;
      break;
  }

  const blob = new Blob([finalContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format === 'pdf' ? 'html' : format}`; // Exporting as HTML for "PDF" in prototype
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Simulates exporting a website as a ZIP structure
 */
export const exportWebsiteZip = (siteData: any) => {
  const { businessName, industry, description } = siteData;
  
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${industry}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-gray-900">
    <nav class="p-6 flex justify-between items-center border-b">
        <h1 class="text-2xl font-bold text-blue-600">${businessName}</h1>
        <div class="space-x-6">
            <a href="#" class="hover:text-blue-600">Home</a>
            <a href="#" class="hover:text-blue-600">Services</a>
            <a href="#" class="hover:text-blue-600">Contact</a>
        </div>
    </nav>
    <header class="py-20 px-6 text-center bg-slate-50">
        <h2 class="text-5xl font-extrabold mb-6">${businessName}</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">${description}</p>
        <button class="mt-10 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Get Started</button>
    </header>
    <footer class="p-10 text-center border-t text-gray-500">
        &copy; ${new Date().getFullYear()} ${businessName}. Built with MUBUSLINK AI.
    </footer>
</body>
</html>
  `;

  const blob = new Blob([indexHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${businessName.toLowerCase().replace(/\s+/g, '-')}-site.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
