/**
 * useCertificate Composable
 * =========================
 * Handles certificate generation and PDF download for phase-level and course-level certificates.
 * Uses html2canvas and jsPDF for client-side PDF generation.
 *
 * Features:
 * - Generate unique certificate IDs (legacy, phase-specific, course completion)
 * - Build phase certificate data for completed phases
 * - Build course certificate data for full course completion
 * - Get certificate statuses for all 10 phases
 * - Check certificate unlock eligibility (phase and course)
 * - Calculate phase-specific quiz averages and hours spent
 * - Render certificate to PDF
 * - Download certificates with type-specific filenames
 *
 * Usage:
 * ```typescript
 * const {
 *   // State
 *   isGenerating,
 *   error,
 *   // Phase certificates
 *   buildPhaseCertificateData,
 *   canUnlockPhaseCertificate,
 *   getPhaseCertificateStatuses,
 *   getPhaseQuizAverage,
 *   getPhaseHoursSpent,
 *   // Course certificate
 *   buildCourseCertificateData,
 *   canUnlockCourseCertificate,
 *   // PDF generation
 *   downloadCertificate
 * } = useCertificate()
 *
 * // Download a phase certificate
 * const phaseData = buildPhaseCertificateData('phase-1-sdlc')
 * if (phaseData) await downloadCertificate(phaseData, 'phase')
 * ```
 */

import type { CertificateData, PhaseCertificateData, CourseCertificateData, PhaseCertificateStatus } from '~/data/types'
import { roadmapData } from '~/data/roadmap'

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

  /**
   * Generate a phase-specific certificate ID
   * Format: DEVOPS-P{phaseNumber}-{timestamp}-{random}
   * @param phaseNumber - Phase number (1-10)
   * @returns Unique phase certificate identifier string
   */
  function generatePhaseCertificateId(phaseNumber: number): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `DEVOPS-P${phaseNumber}-${timestamp}-${random}`
  }

  /**
   * Generate a course completion certificate ID
   * Format: DEVOPS-MASTER-{timestamp}-{random}
   * @returns Unique course certificate identifier string
   */
  function generateCourseCertificateId(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `DEVOPS-MASTER-${timestamp}-${random}`
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
   * Generate PDF from certificate preview element (legacy version)
   * @param data - Certificate data for metadata
   * @returns Blob of generated PDF or null on failure
   */
  async function generatePDF(data: CertificateData | HTMLElement): Promise<Blob | null> {
    // Handle both HTMLElement and CertificateData inputs
    let element: HTMLElement | null = null
    let userName = 'DevOps Learner'
    let certificateId = ''

    if (data instanceof HTMLElement) {
      // Direct element reference
      element = data
      // Generate certificate ID from the element's data attributes
      certificateId = element.getAttribute('data-certificate-id') || generateCertificateId()
    } else {
      // Legacy: Find element by ID
      if (typeof window === 'undefined') return null
      element = document.getElementById('certificate-preview')
      userName = data.userName
      certificateId = generateCertificateId()
    }

    if (!element) {
      throw new Error('Certificate preview element not found')
    }

    // Only run on client
    if (typeof window === 'undefined') return null

    isGenerating.value = true
    error.value = null

    try {
      // Dynamic imports for client-side only libraries
      const [{ default: _html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])
      // Note: _html2canvas imported for future use if canvas-based approach is needed

      // Create a simple canvas drawing approach to avoid CSS parsing issues
      // Get certificate text content
      const canvasElement = document.createElement('canvas')
      const ctx = canvasElement.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      // Set canvas dimensions (A4 landscape in pixels at 96 DPI)
      const dpi = 96
      const pdfWidth = 297 // mm
      const pdfHeight = 210 // mm
      canvasElement.width = (pdfWidth * dpi) / 25.4
      canvasElement.height = (pdfHeight * dpi) / 25.4

      // Draw background
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height)

      // Draw certificate content
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Certificate of Completion', canvasElement.width / 2, 100)

      ctx.font = '24px Arial'
      ctx.fillStyle = '#d4af37'
      ctx.fillText('DevOps Learning Management System', canvasElement.width / 2, 150)

      ctx.font = '20px Arial'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(`This certifies that ${userName}`, canvasElement.width / 2, 250)
      ctx.fillText('has successfully completed', canvasElement.width / 2, 290)
      ctx.fillText('Phase 1: Software Development Lifecycle (SDLC)', canvasElement.width / 2, 330)

      ctx.font = '16px Arial'
      ctx.fillStyle = '#999999'
      ctx.fillText(`Completed on: ${new Date().toLocaleDateString()}`, canvasElement.width / 2, 450)
      ctx.fillText(`Certificate ID: ${certificateId}`, canvasElement.width / 2, 490)

      const canvas = canvasElement

      // Convert to PDF (A4 landscape)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Use existing pdfWidth and pdfHeight defined above
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      // Center vertically if image is shorter than page
      const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0

      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight)

      // Add metadata
      pdf.setProperties({
        title: `DevOps LMS Certificate - ${userName}`,
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
   * Download a PDF blob with a given filename
   * @param blob - PDF blob to download
   * @param filename - Filename for the download
   */
  function downloadPDF(blob: Blob, filename: string): void {
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Generate and download certificate as PDF
   * Supports phase-specific and course completion certificates
   * @param data - Certificate data (any certificate type)
   * @param certificateType - Type of certificate ('phase' | 'course' | 'legacy')
   */
  async function downloadCertificate(
    data: CertificateData | PhaseCertificateData | CourseCertificateData,
    certificateType: 'phase' | 'course' | 'legacy' = 'legacy'
  ): Promise<void> {
    const blob = await generatePDF(data as CertificateData)

    if (!blob) {
      return
    }

    // Determine filename based on certificate type
    let filename: string

    if (certificateType === 'phase' && 'phaseNumber' in data) {
      // Phase certificate: DevOps-Phase{num}-Certificate-{ID}.pdf
      filename = `DevOps-Phase${data.phaseNumber}-Certificate-${data.certificateId}.pdf`
    } else if (certificateType === 'course') {
      // Course certificate: DevOps-Master-Certificate-{ID}.pdf
      filename = `DevOps-Master-Certificate-${data.certificateId}.pdf`
    } else {
      // Legacy format: DevOps-Certificate-{ID}.pdf
      filename = `DevOps-Certificate-${data.certificateId}.pdf`
    }

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

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
  // Phase Certificate Functions
  // ---------------------------------------------------------------------------

  /**
   * Build phase certificate data for a completed phase
   * @param phaseSlug - Phase slug (e.g., "phase-1-sdlc")
   * @returns PhaseCertificateData or null if phase not found or incomplete
   */
  function buildPhaseCertificateData(phaseSlug: string): PhaseCertificateData | null {
    // Get progress composable
    const {
      progress,
      getCompletedCountForPhase,
      getPhaseSubtopicCount
    } = useProgress()

    // Find phase in roadmap data
    const phase = roadmapData.find(p => p.slug === phaseSlug)
    if (!phase) {
      console.warn(`Phase not found: ${phaseSlug}`)
      return null
    }

    // Check if phase is complete
    const totalLessons = getPhaseSubtopicCount(phaseSlug)
    const completedLessons = getCompletedCountForPhase(phaseSlug)

    if (completedLessons < totalLessons) {
      console.warn(`Phase ${phaseSlug} is not complete: ${completedLessons}/${totalLessons}`)
      return null
    }

    // Get user name
    const userName = progress.value.userName
    if (!userName) {
      console.warn('User name not set - cannot generate certificate')
      return null
    }

    // Calculate phase-specific metrics
    const averageQuizScore = getPhaseQuizAverage(phaseSlug)
    const hoursSpent = getPhaseHoursSpent(phaseSlug)

    return {
      certificateId: generatePhaseCertificateId(phase.phase),
      userName,
      completionDate: new Date().toISOString(),
      phaseNumber: phase.phase,
      phaseName: phase.title.replace(/^Phase \d+:\s*/, ''), // Remove "Phase X: " prefix
      phaseSlug,
      lessonsCompleted: completedLessons,
      totalLessons,
      averageQuizScore,
      hoursSpent
    }
  }

  /**
   * Build course completion certificate data
   * @returns CourseCertificateData or null if course not complete
   */
  function buildCourseCertificateData(): CourseCertificateData | null {
    // Get progress composable
    const {
      progress,
      getCompletedCount,
      getTotalLessonCount,
      getTotalTimeSpentHours,
      getAverageQuizScore
    } = useProgress()

    // Check if all lessons are complete
    const totalLessons = getTotalLessonCount()
    const completedLessons = getCompletedCount()

    if (completedLessons < totalLessons) {
      console.warn(`Course is not complete: ${completedLessons}/${totalLessons}`)
      return null
    }

    // Get user name
    const userName = progress.value.userName
    if (!userName) {
      console.warn('User name not set - cannot generate certificate')
      return null
    }

    // Collect phase completion dates
    const phaseCompletionDates: string[] = []
    for (const phase of roadmapData) {
      // Find the latest completion date among all subtopics in the phase
      let latestDate: Date | null = null

      const phaseProgress = progress.value.phases[phase.slug]
      if (phaseProgress) {
        for (const topic of Object.values(phaseProgress.topics)) {
          for (const subtopic of Object.values(topic.subtopics)) {
            if (subtopic.completedAt) {
              const date = new Date(subtopic.completedAt)
              if (!latestDate || date > latestDate) {
                latestDate = date
              }
            }
          }
        }
      }

      phaseCompletionDates.push(latestDate?.toISOString() ?? new Date().toISOString())
    }

    return {
      certificateId: generateCourseCertificateId(),
      userName,
      completionDate: new Date().toISOString(),
      totalLessonsCompleted: completedLessons,
      totalHoursSpent: getTotalTimeSpentHours(),
      overallQuizScore: getAverageQuizScore(),
      phaseCompletionDates
    }
  }

  /**
   * Get certificate statuses for all phases
   * @returns Array of PhaseCertificateStatus objects
   */
  function getPhaseCertificateStatuses(): PhaseCertificateStatus[] {
    // Get progress composable
    const {
      getCompletedCountForPhase,
      getPhaseSubtopicCount,
      getPhaseCompletionPercentage,
      progress
    } = useProgress()

    return roadmapData.map((phase) => {
      const completedLessons = getCompletedCountForPhase(phase.slug)
      const totalLessons = getPhaseSubtopicCount(phase.slug)
      const completionPercentage = getPhaseCompletionPercentage(phase.slug)

      // Find completion date (latest subtopic completion in phase)
      let completedAt: string | undefined
      if (completionPercentage === 100) {
        const phaseProgress = progress.value.phases[phase.slug]
        if (phaseProgress) {
          let latestDate: Date | null = null
          for (const topic of Object.values(phaseProgress.topics)) {
            for (const subtopic of Object.values(topic.subtopics)) {
              if (subtopic.completedAt) {
                const date = new Date(subtopic.completedAt)
                if (!latestDate || date > latestDate) {
                  latestDate = date
                }
              }
            }
          }
          completedAt = latestDate?.toISOString()
        }
      }

      // Determine status
      const status: 'locked' | 'unlocked' | 'downloaded' = completionPercentage === 100 ? 'unlocked' : 'locked'

      return {
        phaseNumber: phase.phase,
        phaseName: phase.title.replace(/^Phase \d+:\s*/, ''),
        phaseSlug: phase.slug,
        status,
        completionPercentage,
        lessonsCompleted: completedLessons,
        totalLessons,
        completedAt
      }
    })
  }

  /**
   * Check if a phase certificate can be unlocked
   * @param phaseSlug - Phase slug (e.g., "phase-1-sdlc")
   * @returns Boolean indicating if phase is 100% complete
   */
  function canUnlockPhaseCertificate(phaseSlug: string): boolean {
    const { getPhaseCompletionPercentage } = useProgress()
    return getPhaseCompletionPercentage(phaseSlug) === 100
  }

  /**
   * Check if course certificate can be unlocked
   * @returns Boolean indicating if all phases are 100% complete
   */
  function canUnlockCourseCertificate(): boolean {
    const { canGenerateCertificate } = useProgress()
    return canGenerateCertificate()
  }

  /**
   * Get average quiz score for a specific phase
   * @param phaseSlug - Phase slug (e.g., "phase-1-sdlc")
   * @returns Average quiz score (0-100) or 0 if no quizzes
   */
  function getPhaseQuizAverage(phaseSlug: string): number {
    const { progress } = useProgress()

    const phaseProgress = progress.value.phases[phaseSlug]
    if (!phaseProgress) return 0

    let totalScore = 0
    let quizCount = 0

    for (const topic of Object.values(phaseProgress.topics)) {
      for (const subtopic of Object.values(topic.subtopics)) {
        if (subtopic.quizScore !== null) {
          totalScore += subtopic.quizScore
          quizCount++
        }
      }
    }

    return quizCount > 0 ? Math.round(totalScore / quizCount) : 0
  }

  /**
   * Get hours spent on a specific phase
   * @param phaseSlug - Phase slug (e.g., "phase-1-sdlc")
   * @returns Hours spent on the phase (derived from lesson count * 15 min avg)
   */
  function getPhaseHoursSpent(phaseSlug: string): number {
    const { progress } = useProgress()

    const phaseProgress = progress.value.phases[phaseSlug]
    if (!phaseProgress) return 0

    // Count completed lessons
    let completedCount = 0
    for (const topic of Object.values(phaseProgress.topics)) {
      for (const subtopic of Object.values(topic.subtopics)) {
        if (subtopic.completed) completedCount++
      }
    }

    // Use average of 15 minutes per lesson (same as calculateTotalHours)
    const totalMinutes = completedCount * 15
    return Math.round((totalMinutes / 60) * 10) / 10
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
    generatePhaseCertificateId,
    generateCourseCertificateId,
    calculateTotalHours,
    formatHours,
    formatCertificateDate,

    // PDF generation
    generatePDF,
    downloadPDF,
    downloadCertificate,

    // Data builders
    buildCertificateData,
    buildPhaseCertificateData,
    buildCourseCertificateData,

    // Phase certificate functions
    getPhaseCertificateStatuses,
    canUnlockPhaseCertificate,
    canUnlockCourseCertificate,
    getPhaseQuizAverage,
    getPhaseHoursSpent
  }
}
