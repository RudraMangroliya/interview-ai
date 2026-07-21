import React from 'react'
import './loader.scss'

export const RecentReportsSkeleton = () => {
    return (
        <div className="skeleton-reports">
            {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                    <div className="skeleton-line skeleton-title" />
                    <div className="skeleton-line skeleton-meta" />
                    <div className="skeleton-line skeleton-badge" />
                </div>
            ))}
        </div>
    )
}

export default RecentReportsSkeleton
