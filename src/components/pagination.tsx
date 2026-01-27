import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

/**
 * Pagination Component
 * Displays page navigation with Previous, numbered pages, and Next buttons
 *
 * Features:
 * - Shows up to 7 page numbers at once
 * - Ellipsis for large page ranges
 * - Preserves search params when navigating
 * - Responsive design
 */
export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  // Don't render if only one page
  if (totalPages <= 1) {
    return null
  }

  // Build URL with preserved search params
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsisStart = currentPage > 4
    const showEllipsisEnd = currentPage < totalPages - 3

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (showEllipsisStart) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (showEllipsisEnd) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className="flex items-center justify-center gap-2 my-12"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-[hsl(var(--sienna))] bg-white hover:bg-gray-100 transition-all hover:shadow-md"
          aria-label="Previous page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-gray-400 bg-gray-100 cursor-not-allowed"
          disabled
          aria-label="Previous page (disabled)"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-400"
              >
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              className={`min-w-[40px] h-10 flex items-center justify-center rounded-full font-bold transition-all ${
                isActive
                  ? 'bg-[hsl(var(--sienna))] text-white shadow-lg scale-110'
                  : 'bg-white text-[hsl(var(--sienna))] hover:bg-gray-100 hover:shadow-md'
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-[hsl(var(--sienna))] bg-white hover:bg-gray-100 transition-all hover:shadow-md"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      ) : (
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-gray-400 bg-gray-100 cursor-not-allowed"
          disabled
          aria-label="Next page (disabled)"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </nav>
  )
}

/**
 * Results Info Component
 * Shows "Showing X-Y of Z results"
 */
interface ResultsInfoProps {
  currentPage: number
  perPage: number
  totalCount: number
}

export function ResultsInfo({
  currentPage,
  perPage,
  totalCount,
}: ResultsInfoProps) {
  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, totalCount)

  if (totalCount === 0) {
    return null
  }

  return (
    <p className="text-center text-sm text-gray-600 mb-4">
      Showing <span className="font-semibold">{start}</span> to{' '}
      <span className="font-semibold">{end}</span> of{' '}
      <span className="font-semibold">{totalCount}</span> products
    </p>
  )
}
