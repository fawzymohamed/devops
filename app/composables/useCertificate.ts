/**
 * useCertificate Composable
 * =========================
 * Handles certificate generation and PDF download.
 * Uses html2canvas and jsPDF for client-side PDF generation.
 *
 * Features:
 * - Generate unique certificate IDs
 * - Calculate total learning hours
 * - Render certificate to PDF
 * - Download generated certificate
 *
 * Usage:
 * ```typescript
 * const { generateCertificateId, downloadCertificate, isGenerating } = useCertificate()
 * await downloadCertificate(certificateData)
 * ```
 */

import type { CertificateData } from '~/data/types'

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useCertificate() {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  /** Whether PDF generation is in progress */
  const isGenerating = ref(false)

  /** Error message if generation fails */
  const error = ref<string | null>(null)

  // ---------------------------------------------------------------------------
  // Certificate ID Generation
  // ---------------------------------------------------------------------------

  /**
   * Generate a unique certificate ID
   * Format: DEVOPS-{timestamp}-{random}
   * @returns Unique certificate identifier string
   */
  function generateCertificateId(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `DEVOPS-${timestamp}-${random}`
  }

  // ---------------------------------------------------------------------------
  // Time Calculations
  // ---------------------------------------------------------------------------

  /**
   * Calculate total hours spent based on completed lessons
   * Assumes average of 15 minutes per lesson
   * @param completedLessons - Number of lessons completed
   * @returns Total hours (rounded to 1 decimal)
   */
  function calculateTotalHours(completedLessons: number): number {
    const minutes = completedLessons * 15
    return Math.round((minutes / 60) * 10) / 10
  }

  /**
   * Format hours for display
   * @param hours - Number of hours
   * @returns Formatted string (e.g., "12.5 hours")
   */
  function formatHours(hours: number): string {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }

  // ---------------------------------------------------------------------------
  // Date Formatting
  // ---------------------------------------------------------------------------

  /**
   * Format date for certificate display
   * @param isoDate - ISO date string
   * @returns Formatted date string (e.g., "January 1, 2025")
   */
  function formatCertificateDate(isoDate: string): string {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // ---------------------------------------------------------------------------
  // PDF Generation
  // ---------------------------------------------------------------------------

  /**
   * Generate PDF from certificate preview element
   * @param data - Certificate data for metadata
   * @returns Blob of generated PDF or null on failure
   */
  async function generatePDF(data: CertificateData): Promise<Blob | null> {
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

      // Find certificate element
      const element = document.getElementById('certificate-preview')
      if (!element) {
        throw new Error('Certificate preview element not found')
      }

      // Render to canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        backgroundColor: '#1f2937', // gray-800
        logging: false,
        useCORS: true
      })

      // Convert to PDF (A4 landscape)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Calculate dimensions to fit A4
      const pdfWidth = 297 // A4 landscape width in mm
      const pdfHeight = 210 // A4 landscape height in mm
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      // Center vertically if image is shorter than page
      const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0

      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight)

      // Add metadata
      pdf.setProperties({
        title: `DevOps LMS Certificate - ${data.userName}`,
        subject: 'Course Completion Certificate',
        author: 'DevOps LMS',
        keywords: 'devops, certificate, completion',
        creator: 'DevOps LMS Platform'
      })

      return pdf.output('blob')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to generate PDF'
      console.error('Certificate PDF generation failed:', e)
      return null
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Generate and download certificate as PDF
   * @param data - Certificate data
   */
  async function downloadCertificate(data: CertificateData): Promise<void> {
    const blob = await generatePDF(data)

    if (!blob) {
      return
    }

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `DevOps-Certificate-${data.certificateId}.pdf`

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // ---------------------------------------------------------------------------
  // Certificate Data Builder
  // ---------------------------------------------------------------------------

  /**
   * Build certificate data from progress
   * @param userName - User's full name
   * @param completedLessons - Number of completed lessons
   * @param totalLessons - Total lessons in course
   * @param averageQuizScore - Average quiz score percentage
   * @returns Complete CertificateData object
   */
  function buildCertificateData(
    userName: string,
    completedLessons: number,
    totalLessons: number,
    averageQuizScore: number
  ): CertificateData {
    return {
      certificateId: generateCertificateId(),
      userName,
      completionDate: new Date().toISOString(),
      lessonsCompleted: completedLessons,
      totalLessons,
      averageQuizScore,
      totalHours: calculateTotalHours(completedLessons)
    }
  }

  // ---------------------------------------------------------------------------
  // Return Public API
  // ---------------------------------------------------------------------------

  return {
    // State (readonly)
    isGenerating: readonly(isGenerating),
    error: readonly(error),

    // ID & calculations
    generateCertificateId,
    calculateTotalHours,
    formatHours,
    formatCertificateDate,

    // PDF generation
    generatePDF,
    downloadCertificate,

    // Data builder
    buildCertificateData
  }
}
