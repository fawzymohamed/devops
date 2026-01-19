/**
 * useCheatSheetPdf Composable
 * ===========================
 * Handles cheat sheet PDF generation and print-quality output.
 * Uses a print window for crisp text and a legacy html2canvas fallback.
 *
 * Features:
 * - Generate multi-page PDFs from cheat sheet content
 * - Portrait A4 orientation with proper margins
 * - Auto page-break handling for long content
 * - Download generated PDF with topic-based filename
 *
 * Usage:
 * ```typescript
 * const { downloadCheatSheet, isGenerating, error } = useCheatSheetPdf()
 * await downloadCheatSheet('SDLC Models', 'sdlc-models')
 * ```
 */

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Extended HTMLElement with iframe reference for cleanup */
interface CloneElement extends HTMLElement {
  _parentIframe?: HTMLIFrameElement
}

/**
 * Escape HTML for safe insertion into a new window.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Create a preprocessed clone in an isolated iframe
 * This avoids oklch parsing issues by not inheriting the main page's stylesheets
 */
async function createProcessedClone(sourceElement: HTMLElement): Promise<CloneElement> {
  // Create an invisible iframe for isolation
  const iframe = document.createElement('iframe')
  iframe.style.position = 'absolute'
  iframe.style.left = '-9999px'
  iframe.style.top = '0'
  iframe.style.width = `${sourceElement.offsetWidth + 100}px`
  iframe.style.height = `${sourceElement.scrollHeight + 100}px`
  iframe.style.border = 'none'

  document.body.appendChild(iframe)

  // Wait for iframe to be ready
  await new Promise(resolve => setTimeout(resolve, 50))

  const iframeDoc = iframe.contentDocument
  if (!iframeDoc) {
    iframe.remove()
    throw new Error('Could not access iframe document')
  }

  // Add minimal, oklch-free CSS for styling (LIGHT MODE for printing)
  const style = iframeDoc.createElement('style')
  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', 'Arial', sans-serif;
      background-color: #ffffff;
      color: #1f2937;
      padding: 1.5rem;
      line-height: 1.5;
      font-size: 12pt;
    }
    h2 {
      font-size: 14pt;
      font-weight: 700;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      color: #111827;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 0.25rem;
      page-break-after: avoid;
    }
    h3 {
      font-size: 12pt;
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: #1f2937;
      page-break-after: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.75rem 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    th {
      background-color: #3b82f6;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 0.5rem 0.625rem;
      border: 1px solid #2563eb;
    }
    td {
      padding: 0.375rem 0.625rem;
      border: 1px solid #d1d5db;
      color: #374151;
    }
    tr:nth-child(even) td {
      background-color: #f9fafb;
    }
    strong {
      color: #111827;
      font-weight: 600;
    }
    ul, ol {
      margin: 0.5rem 0;
      padding-left: 1.25rem;
    }
    li {
      color: #374151;
      margin: 0.2rem 0;
      page-break-inside: avoid;
    }
    code {
      background-color: #f3f4f6;
      padding: 0.15rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 12pt;
      line-height: 1.5;
      color: #059669;
      font-family: 'Consolas', 'Monaco', monospace;
      font-variant-ligatures: none;
    }
    pre {
      background-color: #eef2f7;
      border-radius: 0.375rem;
      padding: 0.75rem;
      overflow-x: auto;
      border: 1px solid #cbd5e1;
      page-break-inside: avoid;
      line-height: 1.5;
    }
    pre code {
      font-size: 12pt;
      line-height: 1.55;
      color: #0f172a;
      font-variant-ligatures: none;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    p {
      margin: 0.375rem 0;
    }
  `
  iframeDoc.head.appendChild(style)

  // Clone the content into the iframe
  const clone = sourceElement.cloneNode(true) as CloneElement
  clone.id = 'cheat-sheet-pdf-clone'

  // Remove any inherited classes that might conflict
  clone.className = ''
  clone.style.cssText = ''

  iframeDoc.body.appendChild(clone)

  // Store iframe reference for cleanup
  clone._parentIframe = iframe

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 100))

  return clone
}

/**
 * Cleanup function to remove iframe after PDF generation
 */
function cleanupClone(clone: CloneElement): void {
  const iframe = clone._parentIframe
  if (iframe && iframe.parentNode) {
    iframe.remove()
  } else if (clone.parentNode) {
    clone.remove()
  }
}

/**
 * Open a print window with vector text for crisp PDF output.
 */
async function openPrintWindow(
  title: string,
  sourceElement: HTMLElement
): Promise<void> {
  const safeTitle = escapeHtml(title)
  const clonedContent = sourceElement.cloneNode(true) as HTMLElement
  const firstHeading = clonedContent.querySelector('h1')
  if (firstHeading) {
    firstHeading.remove()
  }
  clonedContent.querySelectorAll('button').forEach(button => button.remove())
  const contentHtml = clonedContent.innerHTML

  const printFrame = document.createElement('iframe')
  printFrame.setAttribute('aria-hidden', 'true')
  printFrame.style.position = 'fixed'
  printFrame.style.right = '0'
  printFrame.style.bottom = '0'
  printFrame.style.width = '0'
  printFrame.style.height = '0'
  printFrame.style.border = '0'

  const printHtml = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${safeTitle}</title>
        <style>
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          body {
            font-family: "Segoe UI", Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            line-height: 1.55;
            font-size: 12pt;
          }
          main {
            max-width: 860px;
            margin: 0 auto;
            padding: 18mm 14mm;
          }
          h1 {
            font-size: 18pt;
            margin: 0 0 12pt;
            color: #0f172a;
          }
          h2 {
            font-size: 14pt;
            margin: 18pt 0 8pt;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 4pt;
            color: #111827;
            page-break-after: avoid;
          }
          h3 {
            font-size: 12pt;
            margin: 14pt 0 6pt;
            color: #1f2937;
            page-break-after: avoid;
          }
          p { margin: 6pt 0; }
          ul, ol { margin: 6pt 0 10pt 18pt; }
          li { margin: 4pt 0; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10pt 0;
            font-size: 11pt;
            page-break-inside: avoid;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 6pt 8pt;
            text-align: left;
          }
          th {
            background: #e2e8f0;
            color: #0f172a;
            font-weight: 700;
          }
          code {
            font-family: Consolas, "Courier New", monospace;
            font-size: 11.5pt;
            background: #f1f5f9;
            padding: 1pt 3pt;
            border-radius: 3pt;
            color: #0f172a;
            font-variant-ligatures: none;
          }
          pre {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6pt;
            padding: 8pt 10pt;
            overflow: visible;
            white-space: pre-wrap;
            word-break: break-word;
            page-break-inside: avoid;
          }
          pre code {
            font-size: 11.5pt;
            line-height: 1.55;
            background: transparent;
            padding: 0;
          }
          button,
          [role="button"],
          .copy-button,
          .code-copy,
          .shiki-copy {
            display: none !important;
          }
          a { color: #1d4ed8; text-decoration: none; }
          img { max-width: 100%; height: auto; }
          blockquote {
            border-left: 3pt solid #cbd5e1;
            padding-left: 10pt;
            margin: 10pt 0;
            color: #334155;
          }
          @page { margin: 12mm; }
          @media print {
            main { padding: 0; max-width: 100%; }
            pre, table, blockquote, ul, ol { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <main>
          <h1>${safeTitle}</h1>
          ${contentHtml}
        </main>
      </body>
    </html>
  `

  printFrame.srcdoc = printHtml
  document.body.appendChild(printFrame)

  await new Promise<void>((resolve) => {
    printFrame.onload = () => resolve()
    setTimeout(() => resolve(), 200)
  })

  const frameWindow = printFrame.contentWindow
  if (!frameWindow) {
    printFrame.remove()
    throw new Error('Unable to open print frame. Please try again.')
  }

  frameWindow.focus()
  frameWindow.print()

  setTimeout(() => {
    printFrame.remove()
  }, 1000)
}

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useCheatSheetPdf() {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  /** Whether PDF generation is in progress */
  const isGenerating = ref(false)

  /** Error message if generation fails */
  const error = ref<string | null>(null)

  // ---------------------------------------------------------------------------
  // PDF Configuration
  // ---------------------------------------------------------------------------

  /** PDF margins in mm */
  const MARGINS = {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15
  }

  /** A4 dimensions in mm */
  const A4 = {
    width: 210,
    height: 297
  }

  /** Content area dimensions (A4 minus margins) */
  const CONTENT_AREA = {
    width: A4.width - MARGINS.left - MARGINS.right,
    height: A4.height - MARGINS.top - MARGINS.bottom
  }

  // ---------------------------------------------------------------------------
  // PDF Generation
  // ---------------------------------------------------------------------------

  /**
   * Generate PDF from cheat sheet content element
   * @param title - Cheat sheet title for metadata
   * @param elementId - DOM element ID to render (default: 'cheat-sheet-content')
   * @returns Blob of generated PDF or null on failure
   */
  async function generatePDF(
    title: string,
    elementId: string = 'cheat-sheet-content'
  ): Promise<Blob | null> {
    // Only run on client
    if (typeof window === 'undefined') return null

    isGenerating.value = true
    error.value = null

    try {
      // Dynamic imports for client-side only libraries
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])

      // Find cheat sheet element
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Cheat sheet element #${elementId} not found`)
      }

      // Create a preprocessed clone to avoid oklch color parsing issues
      const processedElement = await createProcessedClone(element)

      // Render to canvas with high quality
      const deviceScale = window.devicePixelRatio || 1
      const renderScale = Math.min(6.5, Math.max(4, deviceScale * 3))
      const canvas = await html2canvas(processedElement, {
        scale: renderScale, // Higher resolution for crisp text
        backgroundColor: '#ffffff', // White background for printing
        logging: false,
        useCORS: true,
        allowTaint: true,
        // Ensure full width capture
        windowWidth: processedElement.scrollWidth,
        windowHeight: processedElement.scrollHeight
      })

      // Clean up the temporary element and iframe
      cleanupClone(processedElement)

      // Create PDF in portrait A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Calculate scaling to fit content width with margins
      const imgWidth = CONTENT_AREA.width

      // Convert page height from mm to pixels (at scale 2)
      const pxPerMm = (canvas.width / imgWidth)
      const pageHeightPx = CONTENT_AREA.height * pxPerMm

      // Calculate how many pages we need
      const totalPages = Math.ceil(canvas.height / pageHeightPx)

      // Create pages by slicing the canvas properly
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage()
        }

        // Calculate source region for this page
        const srcY = page * pageHeightPx
        const srcHeight = Math.min(pageHeightPx, canvas.height - srcY)

        // Create a temporary canvas for this page's content
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = srcHeight

        const ctx = pageCanvas.getContext('2d')
        if (ctx) {
          // Draw the portion of the source canvas for this page
          ctx.drawImage(
            canvas,
            0, srcY, canvas.width, srcHeight, // Source rectangle
            0, 0, canvas.width, srcHeight // Destination rectangle
          )
        }

        // Add this page's image to the PDF
        const pageImgData = pageCanvas.toDataURL('image/png')
        const pageImgHeight = (srcHeight * imgWidth) / canvas.width

        pdf.addImage(
          pageImgData,
          'PNG',
          MARGINS.left,
          MARGINS.top,
          imgWidth,
          pageImgHeight,
          undefined,
          'NONE'
        )
      }

      // Add metadata
      pdf.setProperties({
        title: `${title} - Quick Reference`,
        subject: 'DevOps LMS Cheat Sheet',
        author: 'DevOps LMS',
        keywords: 'devops, cheat sheet, quick reference',
        creator: 'DevOps LMS Platform'
      })

      return pdf.output('blob')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to generate PDF'
      console.error('Cheat sheet PDF generation failed:', e)
      return null
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Open print dialog for high-quality PDF output
   * @param title - Cheat sheet title for the print document
   * @param elementId - DOM element ID to render (default: 'cheat-sheet-content')
   */
  async function printCheatSheet(
    title: string,
    elementId: string = 'cheat-sheet-content'
  ): Promise<void> {
    if (typeof window === 'undefined') return

    isGenerating.value = true
    error.value = null

    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Cheat sheet element #${elementId} not found`)
      }

      await openPrintWindow(title, element)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to open print window'
      console.error('Cheat sheet print failed:', e)
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Open print dialog to save the cheat sheet as PDF
   * @param title - Title for the print document
   * @param slug - Topic slug (unused but kept for API stability)
   */
  async function downloadCheatSheet(title: string, slug: string): Promise<void> {
    void slug
    await printCheatSheet(title)
  }

  // ---------------------------------------------------------------------------
  // Return Public API
  // ---------------------------------------------------------------------------

  return {
    // State (readonly)
    isGenerating: readonly(isGenerating),
    error: readonly(error),

    // PDF generation
    generatePDF,
    printCheatSheet,
    downloadCheatSheet
  }
}
