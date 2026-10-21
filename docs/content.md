# Content — EN / PT

All copy for the site. The agent moves it into `app/[lang]/dictionaries/{en,pt}.json` (UI strings) and `content/projects.ts` (project pages). Items marked **[confirm]** need Jhon's answer before going live. Placeholder content is listed at the end and must be named in the README.

## Global

| Key | EN | PT |
|---|---|---|
| name | Jhon Silva | Jhon Silva |
| rev | REV 2026.10 | REV 2026.10 |
| skip | Skip to content | Pular para o conteúdo |
| nav.work | Work | Trabalhos |
| nav.live | Live | Ao vivo |
| nav.contact | Contact | Contato |
| nav.menu | Menu | Menu |
| theme.label | Theme | Tema |
| theme.light / dark / system | Light / Dark / Auto | Claro / Escuro / Auto |
| lang.label | Language | Idioma |
| footer.built | Built with Next.js | Feito com Next.js |
| footer.source | Source on GitHub | Código no GitHub |
| footer.sheet | Sheet 1 of 1 | Folha 1 de 1 |

## Home

| Key | EN | PT |
|---|---|---|
| hero.eyebrow | Full-stack engineer · AI products | Engenheiro full stack · Produtos com IA |
| hero.title (lines) | I build / AI solutions / for any problem. | Crio soluções / com IA para / qualquer / problema. |
| hero.lead | SaaS, automations and WhatsApp campaigns, from idea to production. Developer at Zapichat, CTO at Léia, founder of Nextech. | SaaS, automações e disparos no WhatsApp, da ideia à produção. Desenvolvedor no Zapichat, CTO da Léia e fundador da Nextech. |
| hero.ctaWork | See the work | Ver os trabalhos |
| hero.ctaContact | Get in touch | Falar comigo |
| specs.title | General specifications | Especificações gerais |
| specs.frontend | Next.js · React · TypeScript · Tailwind | (same) |
| specs.backend | Python · Django · Node · Supabase | (same) |
| specs.ai | LangChain · RAG with pgvector · OpenRouter | LangChain · RAG com pgvector · OpenRouter |
| specs.infra | AWS EC2 · Vercel · Redis · Celery | (same) |
| work.title | Selected work | Trabalhos selecionados |
| work.count | 3 parts | 3 peças |
| work.cols | Fig. · Part no. · Product · Role · Stack · Status | Fig. · Código · Produto · Papel · Stack · Status |
| status.production | In production | Em produção |
| status.early | Early customers | Primeiros clientes |
| status.testing | In testing | Em testes |
| live.title | Live readings | Leituras ao vivo |
| live.lead | Trending models on the Hugging Face Hub, fetched by the server on every request. | Modelos em alta no Hugging Face Hub, buscados pelo servidor a cada acesso. |
| live.read | Read {time} UTC | Lido às {time} UTC |
| live.cols | # · Model · Task · Likes · Downloads | # · Modelo · Tarefa · Curtidas · Downloads |
| live.error | Couldn't reach Hugging Face. The rest of the page still works. | Não foi possível acessar o Hugging Face. O resto da página continua funcionando. |
| live.retry | Retry | Tentar de novo |
| live.empty | No trending models right now. | Nenhum modelo em alta agora. |
| contactBand.title | Contact | Contato |
| contactBand.text | Building something that needs to talk to people? Send me a message. | Está construindo algo que precisa conversar com pessoas? Me mande uma mensagem. |
| contactBand.cta | Write to me | Escrever |

No reply time is promised (decided Oct 21: leave it out).

## Contact page

| Key | EN | PT |
|---|---|---|
| contact.title | Send a message | Envie uma mensagem |
| contact.lead | Every field is required. | Todos os campos são obrigatórios. |
| field.name | Name | Nome |
| field.email | Email | E-mail |
| field.message | Message | Mensagem |
| field.emailPlaceholder | name@company.com | nome@empresa.com |
| submit | Send message | Enviar mensagem |
| sending | Sending… | Enviando… |
| sent.title | Message sent | Mensagem enviada |
| sent.text | Thanks, {name}. It's in my inbox. | Obrigado, {name}. Ela já está na minha caixa de entrada. |
| err.name | Enter your name (2 to 80 characters). | Informe seu nome (de 2 a 80 caracteres). |
| err.email | Enter an email like name@company.com. | Informe um e-mail como nome@empresa.com. |
| err.message | Write at least 10 characters (max 2000). | Escreva pelo menos 10 caracteres (máximo 2000). |
| err.summary | Fix the fields below and send again. | Corrija os campos abaixo e envie de novo. |
| err.rateLimited | You sent several messages in a short time. Try again in {minutes} min. | Você enviou várias mensagens em pouco tempo. Tente de novo em {minutes} min. |
| err.server | The message didn't go through. Your text is still in the form; try again. | A mensagem não foi enviada. Seu texto continua no formulário; tente de novo. |

## Metadata

Titles and descriptions reuse the copy above: home = `name · hero.eyebrow` + `hero.lead`, project = `name · code` + summary, contact = `contact.title` + the key below.

| Key | EN | PT |
|---|---|---|
| meta.jobTitle | Full-stack engineer | Engenheiro full stack |
| meta.contactDescription | Send Jhon Silva a message about a project or a role. | Envie uma mensagem para Jhon Silva sobre um projeto ou uma vaga. |

## 404

| Key | EN | PT |
|---|---|---|
| nf.code | ERR-404 | ERR-404 |
| nf.title | Part not found | Peça não encontrada |
| nf.text | This page isn't in the catalog. It may have moved, or the link has a typo. | Esta página não está no catálogo. Ela pode ter mudado de lugar, ou o link tem um erro de digitação. |
| nf.requested | Requested | Pedido |
| nf.available | Available | Disponíveis |
| nf.back | Back to the catalog | Voltar ao catálogo |

## Projects

### PRJ-01 · Zapichat (`/work/zapichat`)

- **Summary** — EN: Multi-tenant CRM and customer service on WhatsApp. PT: CRM e atendimento multi-tenant pelo WhatsApp.
- **Role**: Full-stack developer / Desenvolvedor full stack
- **Status**: In production / Em produção
- **Period**: 2026 – present / 2026 – hoje
- **Channel**: WhatsApp Cloud API (Meta)
- **Frontend**: React · TypeScript · Vite · Tailwind
- **Backend**: Supabase (Postgres, Auth, Realtime, Storage, Edge Functions in Deno) · worker for queued sends
- **Infra**: Vercel · Sentry
- **Link**: zapichat.com.br
- **1 · The problem** — EN: Sales and support teams run on WhatsApp, but conversations scatter across phones and nobody sees the pipeline. PT: Times de vendas e atendimento vivem no WhatsApp, mas as conversas ficam espalhadas pelos celulares e ninguém enxerga o funil.
- **2 · What the product does** — EN / PT:
  - Shared inbox for the team on the official WhatsApp API / Caixa de entrada compartilhada pela API oficial do WhatsApp
  - CRM pipeline with deals and stages / Funil de CRM com negócios e etapas
  - Bulk campaigns with scheduling / Disparos em massa com agendamento
  - Automations, NPS surveys and analytics / Automações, pesquisas de NPS e análises
  - Many companies on one platform, each isolated / Várias empresas numa plataforma, cada uma isolada
- **3 · Decisions**
  - D-01 Sends go through a queue / Disparos passam por uma fila — EN: Bulk campaigns are queued and a separate worker sends them, so the app never blocks while thousands of messages go out. PT: Campanhas em massa entram numa fila e um worker separado faz os envios, então o app não trava enquanto milhares de mensagens saem.
  - D-02 One platform, isolated companies / Uma plataforma, empresas isoladas — EN: Postgres Row Level Security keeps each company's data apart, enforced by the database, not by app code. PT: O Row Level Security do Postgres separa os dados de cada empresa, e quem garante isso é o banco, não o código do app.
- **Figures**: FIG. 1 inbox, FIG. 2 CRM pipeline — **placeholder until demo screenshots exist**

### PRJ-02 · Léia (`/work/leia`)

- **Summary** — EN: An AI assistant on WhatsApp that answers condominium residents and passes to the manager what needs a person. PT: Uma assistente de IA no WhatsApp que responde aos moradores do condomínio e passa para o síndico o que precisa de uma pessoa.
- **Role**: CTO
- **Status**: Early customers / Primeiros clientes
- **Period**: 2026 – present / 2026 – hoje
- **Channel**: WhatsApp Cloud API (Meta), in coexistence with the phone app / em coexistência com o app do celular
- **Backend**: Django 6 · DRF · PostgreSQL + pgvector · Redis · Celery · Channels
- **AI**: LangChain · LangGraph · OpenRouter · OpenAI embeddings
- **Infra**: AWS EC2
- **Link**: assistenteleia.com.br
- **1 · The problem** — EN: Residents ask the building the same questions every day: opening hours, rules, fees, bookings. Léia answers them on the WhatsApp number the condominium already uses, from the building's own documents. PT: Os moradores fazem as mesmas perguntas todo dia: horários, regras, taxas, reservas. A Léia responde pelo número de WhatsApp que o condomínio já usa, com base nos documentos do próprio prédio.
- **2 · What we built** — EN / PT:
  - RAG agent over the building's rules and bylaws, with OCR for scanned PDFs / Agente com RAG sobre o regimento e a convenção, com OCR para PDF escaneado
  - Voice notes transcribed and photos described before the agent replies / Áudios transcritos e fotos descritas antes de o agente responder
  - Human handoff: inbox, manager queue, incidents and notices / Atendimento humano: caixa de entrada, fila do síndico, ocorrências e avisos
  - Common-area bookings with optional Google Calendar sync / Reserva de áreas comuns com sincronização opcional no Google Agenda
  - Virtual numbers verified inside the app, no SIM card / Número virtual verificado pelo próprio app, sem chip
  - Billing through Asaas with a conversation quota per plan / Cobrança pelo Asaas com cota de conversas por plano
- **3 · Decisions**
  - D-01 Official API, same number / API oficial, mesmo número — EN: Coexistence lets the manager keep the phone app. When the manager replies from the phone, Léia steps back from that conversation. PT: A coexistência deixa o síndico manter o app no celular. Quando ele responde pelo celular, a Léia sai daquela conversa.
  - D-02 Chunk by section, not by size / Fatiar por seção, não por tamanho — EN: Bylaws are split along their own sections, so an answer quotes one rule instead of half of two. PT: O regimento é dividido pelas próprias seções, então a resposta cita uma regra inteira em vez de metade de duas.
  - D-03 Slow work off the request / Trabalho pesado fora da requisição — EN: Transcription, OCR and indexing run in Celery workers; the inbox updates over WebSockets. PT: Transcrição, OCR e indexação rodam em workers do Celery; a caixa de entrada atualiza por WebSockets.
- **Figures**: FIG. 1 manager inbox, FIG. 2 resident chat, FIG. 3 indexed documents — **placeholder until demo screenshots exist** (use `/dialog-test/` for a chat without real residents)

### PRJ-03 · Nextech (`/work/nextech`)

- **Summary** — EN: AI assistants on WhatsApp for clinics: answering, qualifying, booking and follow-up. PT: Assistentes de IA no WhatsApp para clínicas: atendimento, qualificação, agendamento e follow-up.
- **Role**: Founder and only developer / Fundador e único desenvolvedor
- **Status**: In testing, not launched yet / Em testes, ainda não lançado
- **Period**: 2026 – present / 2026 – hoje
- **Channel**: WhatsApp Cloud API with coexistence, connected by Embedded Signup
- **Stack**: Next.js 16 (App Router) · TypeScript · Supabase (Postgres, Auth, RLS) · Vitest
- **AI**: OpenRouter · Gemini 2.5 Flash (model set by config, never hardcoded)
- **Integrations**: Google Calendar (OAuth per clinic) · Resend · Asaas
- **Link**: nextech.ia.br
- **1 · The problem** — EN: Clinics lose patients who message after hours or never get a reply. Every unanswered message is a missed booking. PT: Clínicas perdem pacientes que mandam mensagem fora do horário ou nunca recebem resposta. Cada mensagem sem resposta é uma consulta perdida.
- **2 · What I'm building** — EN / PT:
  - 24/7 answers on the clinic's own WhatsApp number / Atendimento 24h no número de WhatsApp da própria clínica
  - Booking that checks the clinic's calendar / Agendamento que consulta a agenda da clínica
  - Follow-up and handoff to a person with a summary / Follow-up e passagem para uma pessoa com resumo
  - One adapter interface for every CRM / Uma interface de adaptador para todos os CRMs
- **3 · Decisions**
  - D-01 Patient data is sensitive by default / Dado de paciente é sensível por padrão — EN: Every table with clinic data has RLS by clinic, and the clinic id always comes from the server session. Message content is never logged in plain text. PT: Toda tabela com dado de clínica tem RLS por clínica, e o id da clínica sempre vem da sessão no servidor. Conteúdo de mensagem nunca vai para o log em texto puro.
  - D-02 Each clinic's secrets are encrypted / Segredos de cada clínica são criptografados — EN: WhatsApp and Google tokens belong to the clinic, so they are encrypted at rest in the database, not stored as infra secrets. PT: Os tokens de WhatsApp e Google pertencem à clínica, então ficam criptografados no banco, e não como segredo de infraestrutura.
  - D-03 Automation as code / Automação como código — EN: No n8n. Webhooks, AI orchestration, scheduling and billing live in the app, tested and versioned. PT: Nada de n8n. Webhooks, orquestração da IA, agendamento e cobrança ficam no app, testados e versionados.
- **How I work on it** (good for the follow-up talk) — EN: One spec per session; the agent implements on `staging`; I review every PR to `main`; tests are the quality gate. PT: Uma spec por sessão; o agente implementa na `staging`; eu reviso todo PR para a `main`; os testes são o portão de qualidade.
- **Figures**: FIG. 1 clinic dashboard, FIG. 2 calendar — **placeholder until demo screenshots exist** (`npm run demo:preparar` builds a demo account)

## Placeholder content (name it in the README)

- Project figures until real demo screenshots replace them.
- Any **[confirm]** item not answered.
