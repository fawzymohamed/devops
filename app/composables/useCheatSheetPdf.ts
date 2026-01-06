/**
 * useCheatSheetPdf Composable
 * ===========================
 * Handles cheat sheet PDF generation and download.
 * Uses html2canvas and jsPDF for client-side PDF generation.
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
      font-size: 11pt;
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
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 9pt;
      color: #059669;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    pre {
      background-color: #f3f4f6;
      border-radius: 0.375rem;
      padding: 0.75rem;
      overflow-x: auto;
      border: 1px solid #e5e7eb;
      page-break-inside: avoid;
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
      const canvas = await html2canvas(processedElement, {
        scale: 2, // Higher resolution for crisp text
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
          pageImgHeight
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
   * Generate and download cheat sheet as PDF
   * @param title - Title for the PDF and filename
   * @param slug - Topic slug for filename (e.g., 'sdlc-models')
   */
  async function downloadCheatSheet(title: string, slug: string): Promise<void> {
    const blob = await generatePDF(title)

    if (!blob) {
      return
    }

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug}-cheat-sheet.pdf`

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
    downloadCheatSheet
  }
}
