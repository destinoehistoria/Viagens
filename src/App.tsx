import { useEffect, type ReactNode } from 'react'
import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import { setActiveTrip } from './data/active'
import { startSync } from './lib/sync'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { TripRoute } from './components/TripRoute'
import { AuthProvider } from './lib/auth'
import { TripsPage } from './pages/TripsPage'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { TodayPage } from './pages/TodayPage'
import { ItineraryPage } from './pages/ItineraryPage'
import { CitiesPage, CityPage } from './pages/CityPage'
import { MapPage } from './pages/MapPage'
import { BookingsPage } from './pages/BookingsPage'
import { FinancePage } from './pages/FinancePage'
import { ChecklistPage } from './pages/ChecklistPage'
import { JournalPage } from './pages/JournalPage'
import { InfoPage } from './pages/InfoPage'
import { CreditsPage } from './pages/CreditsPage'

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-goldx text-xs font-semibold uppercase tracking-[0.25em]">Página não encontrada</p>
      <h1 className="mt-2 text-5xl font-semibold">Caminho fora do mapa</h1>
      <Link to="/" className="btn btn-primary mt-6">
        Voltar às viagens
      </Link>
    </div>
  )
}

/** Páginas fora de uma viagem (lista, login): desativa a viagem e a sincronização. */
function NoTrip({ children }: { children: ReactNode }) {
  setActiveTrip(null)
  useEffect(() => {
    document.title = 'Viagens — André & Ricardo'
    void startSync(null)
  }, [])
  return <Layout>{children}</Layout>
}

function TripRoutes() {
  return (
    <TripRoute>
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="hoje" element={<TodayPage />} />
            <Route path="roteiro" element={<ItineraryPage />} />
            <Route path="roteiro/:date" element={<ItineraryPage />} />
            <Route path="cidades" element={<CitiesPage />} />
            <Route path="cidades/:id" element={<CityPage />} />
            <Route path="mapa" element={<MapPage />} />
            <Route path="reservas" element={<BookingsPage />} />
            <Route path="financeiro" element={<FinancePage />} />
            <Route path="checklist" element={<ChecklistPage />} />
            <Route path="caderno" element={<JournalPage />} />
            <Route path="caderno/:date" element={<JournalPage />} />
            <Route path="informacoes" element={<InfoPage />} />
            <Route path="creditos" element={<CreditsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </TripRoute>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <NoTrip>
            <TripsPage />
          </NoTrip>
        }
      />
      <Route
        path="/entrar"
        element={
          <NoTrip>
            <LoginPage />
          </NoTrip>
        }
      />
      <Route path="/v/:slug/*" element={<TripRoutes />} />
      <Route
        path="*"
        element={
          <NoTrip>
            <NotFound />
          </NoTrip>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  )
}
