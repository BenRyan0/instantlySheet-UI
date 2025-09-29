"use client"

import React from "react"

const statusMap = {
  0: { color: "bg-gray-300", label: "Draft", pulsing: false },
  1: { color: "bg-green-400", label: "Active", pulsing: true },
  2: { color: "bg-yellow-400", label: "Paused", pulsing: false },
  3: { color: "bg-blue-500", label: "Completed", pulsing: true },
  4: { color: "bg-purple-500", label: "Running Subsequences", pulsing: true },
  "-99": { color: "bg-red-600", label: "Account Suspended", pulsing: false },
  "-1": { color: "bg-orange-500", label: "Accounts Unhealthy", pulsing: false },
  "-2": { color: "bg-pink-500", label: "Bounce Protect", pulsing: false },
}

export default function StatusIndicator({ status = 0 }) {
  const { color, label, pulsing } = statusMap[status] || {
    color: "bg-gray-300",
    label: "Unknown",
    pulsing: false,
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="relative inline-flex">
        <div
          className={`rounded-full ${color} h-[10px] w-[10px] inline-block`}
          aria-hidden="true"
        ></div>

        {pulsing && (
          <div
            className={`absolute animate-ping rounded-full ${color} h-[10px] w-[10px]`}
            aria-hidden="true"
          ></div>
        )}
      </div>

      {/* Screen reader only */}
      {/* <span className="sr-only">{label}</span> */}
    </div>
  )
}
