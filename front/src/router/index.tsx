import React, { useEffect, useState } from 'react'
import CONFIG from '@/config'
import { MainRoutes } from './routes'
import { BrowserRouter as Router } from 'react-router-dom'

export default function () {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? (
    <Router basename={CONFIG.baseURL}>
      <MainRoutes />
    </Router>
  ) : null
}
