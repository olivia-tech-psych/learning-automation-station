console.log("Hackathon mode: activated! 💖");

document.addEventListener('DOMContentLoaded', () => {
  // ✅ Now pdfjsLib is guaranteed to exist
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // ✅ Make goToPage globally accessible
  window.goToPage = function(page) {
    const text = localStorage.getItem('pdfText');
    if (!text) {
      alert("Please upload a PDF first!");
      return;
    }
    window.location.href = page;
  };

  // ✅ PDF upload handler
  document.getElementById('pdfUpload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      alert("File too large! Please upload a PDF under 5 MB.");
      event.target.value = "";
      return;
    }

   try {
    const arrayBuffer = await file.arrayBuffer();
    // ✅ Fixed: use { data: arrayBuffer }
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = ''

      // Extract all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + ' ';
      }

      localStorage.setItem('pdfText', fullText.trim());
      console.log("PDF text saved ✅");
    } catch (err) {
      console.error("PDF extraction failed:", err);
      alert("Failed to read PDF. Please use a text-based PDF (not scanned).");
    }
  });
});