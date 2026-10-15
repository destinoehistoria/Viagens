/**
 * Conexão com o Supabase (login, caderno, fotos e financeiro).
 *
 * A URL e a chave "anon"/"publishable" são públicas por natureza: quem protege os
 * dados são as regras de acesso (RLS) em supabase/schema.sql, que só liberam
 * leitura e escrita para os e-mails cadastrados na tabela `membros`.
 * Podem vir de variáveis de ambiente (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
 * ou ficar escritas aqui.
 */
export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
