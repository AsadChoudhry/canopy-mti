import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { UIProvider } from '@/context/UIContext'
import { StoreProvider } from '@/store/StoreContext'
import { GlobalOverviewPage } from '@/pages/GlobalOverviewPage'
import { CompaniesPage } from '@/pages/CompaniesPage'
import { SolutionsPage } from '@/pages/SolutionsPage'
import { WorkspacePage } from '@/pages/WorkspacePage'
import { NextGenMillsPage } from '@/pages/NextGenMillsPage'
import { RoadmapPage } from '@/pages/RoadmapPage'

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <UIProvider>
          <Routes>
            <Route path="/" element={<GlobalOverviewPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:companyId" element={<CompaniesPage />} />
            <Route path="/companies/:companyId/:tab" element={<CompaniesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/mills" element={<NextGenMillsPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/ecopaper" element={<Navigate to="/solutions" replace />} />
            <Route path="/nextgen" element={<Navigate to="/solutions" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UIProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
