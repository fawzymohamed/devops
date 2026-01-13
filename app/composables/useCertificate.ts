/**
 * useCertificate Composable
 * =========================
 * Handles certificate generation and PDF download for phase and course certificates.
 */

import type {
  CertificateData,
  PhaseCertificateData,
  CourseCertificateData,
  PhaseCertificateStatus
} from '~/data/types'
import { getRoadmapById } from '~/data/roadmaps'

// =============================================================================
// COMPOSABLE
// =============================================================================

export function useCertificate() {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  function normalizeRoadmapId(roadmapId: string): string {
    return roadmapId.trim().toUpperCase()
  }

  function getRoadmapOrFallback(roadmapId: string) {
    return getRoadmapById(roadmapId) ?? getRoadmapById('devops')
  }

  // ---------------------------------------------------------------------------
  // Certificate ID Generation
  // ---------------------------------------------------------------------------

  function generateCertificateId(roadmapId = 'devops'): string {
    const prefix = normalizeRoadmapId(roadmapId)
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(16).substring(2, 8).toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  }

  function generatePhaseCertificateId(roadmapId: string, phaseNumber: number): string {
    const prefix = normalizeRoadmapId(roadmapId)
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(16).substring(2, 8).toUpperCase()
    return `${prefix}-P${phaseNumber}-${timestamp}-${random}`
  }

  function generateCourseCertificateId(roadmapId: string): string {
    const prefix = normalizeRoadmapId(roadmapId)
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(16).substring(2, 8).toUpperCase()
    return `${prefix}-MASTER-${timestamp}-${random}`
  }

  // ---------------------------------------------------------------------------
  // Time Calculations
  // ---------------------------------------------------------------------------

  function calculateTotalHours(completedLessons: number): number {
    const minutes = completedLessons * 15
    return Math.round((minutes / 60) * 10) / 10
  }

  function formatHours(hours: number): string {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }

  // ---------------------------------------------------------------------------
  // Date Formatting
  // ---------------------------------------------------------------------------

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

  async function generatePDF(data: CertificateData | HTMLElement): Promise<Blob | null> {
    let element: HTMLElement | null = null
    let userName = 'Learner'
    let certificateId = ''

    if (data instanceof HTMLElement) {
      element = data
      certificateId = element.getAttribute('data-certificate-id') || generateCertificateId()
    } else {
      if (typeof window === 'undefined') return null
      element = document.getElementById('certificate-preview')
      userName = data.userName
      certificateId = generateCertificateId()
    }

    if (!element) {
      throw new Error('Certificate preview element not found')
    }

    if (typeof window === 'undefined') return null

    isGenerating.value = true
    error.value = null

    try {
      const [{ default: _html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])

      const canvasElement = document.createElement('canvas')
      const ctx = canvasElement.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      const dpi = 96
      const pdfWidth = 297
      const pdfHeight = 210
      canvasElement.width = (pdfWidth * dpi) / 25.4
      canvasElement.height = (pdfHeight * dpi) / 25.4

      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Certificate of Completion', canvasElement.width / 2, 100)

      ctx.font = '24px Arial'
      ctx.fillStyle = '#d4af37'
      ctx.fillText('Learning Management System', canvasElement.width / 2, 150)

      ctx.font = '20px Arial'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(`This certifies that ${userName}`, canvasElement.width / 2, 250)
      ctx.fillText('has successfully completed', canvasElement.width / 2, 290)

      ctx.font = '16px Arial'
      ctx.fillStyle = '#999999'
      ctx.fillText(`Completed on: ${new Date().toLocaleDateString()}`, canvasElement.width / 2, 450)
      ctx.fillText(`Certificate ID: ${certificateId}`, canvasElement.width / 2, 490)

      const canvas = canvasElement

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width
      const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0

      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight)

      pdf.setProperties({
        title: `LMS Certificate - ${userName}`,
        subject: 'Course Completion Certificate',
        author: 'LMS',
        keywords: 'certificate, completion',
        creator: 'LMS Platform'
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

  function downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async function downloadCertificate(
    roadmapId: string,
    data: CertificateData | PhaseCertificateData | CourseCertificateData,
    certificateType: 'phase' | 'course' | 'legacy' = 'legacy'
  ): Promise<void> {
    const blob = await generatePDF(data as CertificateData)

    if (!blob) {
      return
    }

    const prefix = normalizeRoadmapId(roadmapId)
    let filename: string

    if (certificateType === 'phase' && 'phaseNumber' in data) {
      filename = `${prefix}-Phase${data.phaseNumber}-Certificate-${data.certificateId}.pdf`
    } else if (certificateType === 'course') {
      filename = `${prefix}-Master-Certificate-${data.certificateId}.pdf`
    } else {
      filename = `${prefix}-Certificate-${data.certificateId}.pdf`
    }

    downloadPDF(blob, filename)
  }

  // ---------------------------------------------------------------------------
  // Certificate Data Builder
  // ---------------------------------------------------------------------------

  function buildCertificateData(
    roadmapId: string,
    userName: string,
    completedLessons: number,
    totalLessons: number,
    averageQuizScore: number
  ): CertificateData {
    return {
      certificateId: generateCertificateId(roadmapId),
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

  function buildPhaseCertificateData(
    roadmapId: string,
    phaseSlug: string
  ): PhaseCertificateData | null {
    const roadmap = getRoadmapOrFallback(roadmapId)
    if (!roadmap) return null

    const {
      getCompletedCountForPhase,
      getPhaseSubtopicCount,
      getUserName
    } = useProgress()

    const phase = roadmap.phases.find(p => p.slug === phaseSlug)
    if (!phase) {
      console.warn(`Phase not found: ${phaseSlug}`)
      return null
    }

    const totalLessons = getPhaseSubtopicCount(roadmapId, phaseSlug)
    const completedLessons = getCompletedCountForPhase(roadmapId, phaseSlug)

    if (completedLessons < totalLessons) {
      console.warn(`Phase ${phaseSlug} is not complete: ${completedLessons}/${totalLessons}`)
      return null
    }

    const userName = getUserName()
    if (!userName) {
      console.warn('User name not set - cannot generate certificate')
      return null
    }

    const averageQuizScore = getPhaseQuizAverage(roadmapId, phaseSlug)
    const hoursSpent = getPhaseHoursSpent(roadmapId, phaseSlug)

    return {
      certificateId: generatePhaseCertificateId(roadmapId, phase.phase),
      userName,
      completionDate: new Date().toISOString(),
      phaseNumber: phase.phase,
      phaseName: phase.title.replace(/^Phase \d+:\s*/, ''),
      phaseSlug,
      lessonsCompleted: completedLessons,
      totalLessons,
      averageQuizScore,
      hoursSpent
    }
  }

  function buildCourseCertificateData(roadmapId: string): CourseCertificateData | null {
    const roadmap = getRoadmapOrFallback(roadmapId)
    if (!roadmap) return null

    const {
      progress,
      getCompletedCount,
      getTotalLessonCount,
      getTotalTimeSpentHours,
      getAverageQuizScore,
      getUserName
    } = useProgress()

    const totalLessons = getTotalLessonCount(roadmapId)
    const completedLessons = getCompletedCount(roadmapId)

    if (completedLessons < totalLessons) {
      console.warn(`Course is not complete: ${completedLessons}/${totalLessons}`)
      return null
    }

    const userName = getUserName()
    if (!userName) {
      console.warn('User name not set - cannot generate certificate')
      return null
    }

    const roadmapProgress = progress.value.roadmaps[roadmapId]
    const phaseCompletionDates: string[] = []

    for (const phase of roadmap.phases) {
      let latestDate: Date | null = null

      const phaseProgress = roadmapProgress?.phases[phase.slug]
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
      certificateId: generateCourseCertificateId(roadmapId),
      userName,
      completionDate: new Date().toISOString(),
      courseName: roadmap.certificateTitle,
      totalLessonsCompleted: completedLessons,
      totalHoursSpent: getTotalTimeSpentHours(roadmapId),
      overallQuizScore: getAverageQuizScore(roadmapId),
      phaseCompletionDates
    }
  }

  function getPhaseCertificateStatuses(roadmapId: string): PhaseCertificateStatus[] {
    const roadmap = getRoadmapOrFallback(roadmapId)
    if (!roadmap) return []

    const {
      getCompletedCountForPhase,
      getPhaseSubtopicCount,
      getPhaseCompletionPercentage,
      progress
    } = useProgress()

    return roadmap.phases.map((phase) => {
      const completedLessons = getCompletedCountForPhase(roadmapId, phase.slug)
      const totalLessons = getPhaseSubtopicCount(roadmapId, phase.slug)
      const completionPercentage = getPhaseCompletionPercentage(roadmapId, phase.slug)

      let completedAt: string | undefined
      const roadmapProgress = progress.value.roadmaps[roadmapId]
      const phaseProgress = roadmapProgress?.phases[phase.slug]
      if (completionPercentage === 100 && phaseProgress) {
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

      const status: 'locked' | 'unlocked' | 'downloaded' = completionPercentage === 100
        ? 'unlocked'
        : 'locked'

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

  function canUnlockPhaseCertificate(roadmapId: string, phaseSlug: string): boolean {
    const { getPhaseCompletionPercentage } = useProgress()
    return getPhaseCompletionPercentage(roadmapId, phaseSlug) === 100
  }

  function canUnlockCourseCertificate(roadmapId: string): boolean {
    const { canGenerateCertificate } = useProgress()
    return canGenerateCertificate(roadmapId)
  }

  function getPhaseQuizAverage(roadmapId: string, phaseSlug: string): number {
    const { progress } = useProgress()

    const roadmapProgress = progress.value.roadmaps[roadmapId]
    const phaseProgress = roadmapProgress?.phases[phaseSlug]
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

  function getPhaseHoursSpent(roadmapId: string, phaseSlug: string): number {
    const { progress } = useProgress()

    const roadmapProgress = progress.value.roadmaps[roadmapId]
    const phaseProgress = roadmapProgress?.phases[phaseSlug]
    if (!phaseProgress) return 0

    let completedCount = 0
    for (const topic of Object.values(phaseProgress.topics)) {
      for (const subtopic of Object.values(topic.subtopics)) {
        if (subtopic.completed) completedCount++
      }
    }

    const totalMinutes = completedCount * 15
    return Math.round((totalMinutes / 60) * 10) / 10
  }

  return {
    isGenerating: readonly(isGenerating),
    error: readonly(error),

    generateCertificateId,
    generatePhaseCertificateId,
    generateCourseCertificateId,
    calculateTotalHours,
    formatHours,
    formatCertificateDate,

    generatePDF,
    downloadPDF,
    downloadCertificate,

    buildCertificateData,
    buildPhaseCertificateData,
    buildCourseCertificateData,

    getPhaseCertificateStatuses,
    canUnlockPhaseCertificate,
    canUnlockCourseCertificate,
    getPhaseQuizAverage,
    getPhaseHoursSpent
  }
}
