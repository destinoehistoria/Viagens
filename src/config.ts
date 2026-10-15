/**
 * Conexão com o Supabase (login, caderno, fotos e financeiro).
 *
 * A URL e a chave "anon"/"publishable" são públicas por natureza: quem protege os
 * dados são as regras de acesso (RLS) em supabase/schema.sql, que só liberam
 * leitura e escrita para os e-mails cadastrados na tabela `membros`.
 * Podem vir de variáveis de ambiente (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
 * ou ficar escritas aqui.
 */
export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL || 'https://kskuyeoaevjvckgtscyh.supabase.co'
export const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza3V5ZW9hZXZqdmNrZ3RzY3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMjY1NTMsImV4cCI6MjEwNzYwMjU1M30._FiD6nQElkp0K90ycIXvdzF9zDkxWCc_Q7y1HqVrqJQ'

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
