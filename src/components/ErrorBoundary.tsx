import { Component, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-4xl font-semibold">Algo deu errado nesta página</h1>
        <p className="text-2 mt-3">Os seus dados salvos no aparelho não foram afetados.</p>
        <pre className="surface mt-4 overflow-auto rounded-xl p-3 text-left text-xs">{this.state.error.message}</pre>
        <div className="mt-6 flex justify-center gap-2">
          <button className="btn btn-primary" onClick={() => this.setState({ error: null })}>
            Tentar novamente
          </button>
          <a className="btn btn-ghost" href="#/">
            Ir para o início
          </a>
        </div>
      </div>
    )
  }
}
