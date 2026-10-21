import type { StaticImageData } from "next/image";
import type { Locale } from "@/lib/i18n";

// Project pages (docs/content.md, "Projects"). Shared facts sit on the
// project; everything a reader sees in one language sits in `copy`.

export type ProjectStatus = "production" | "early" | "testing";

// Rows of the project spec table. Role, status and link have their own fields.
export type SpecKey = "period" | "channel" | "frontend" | "backend" | "ai" | "infra" | "stack" | "integrations";

type FigureCopy = { caption: string; alt: string };

type Decision = { title: string; text: string };

export type ProjectCopy = {
  summary: string;
  role: string;
  // Shorter text for the home work list.
  list: { summary: string; role: string };
  specs: { key: SpecKey; value: string }[];
  // FIG. 1, 2… in order. The count sets how many figures the page shows.
  figures: FigureCopy[];
  problem: string;
  built: { title: string; items: string[] };
  decisions: Decision[];
};

export type Project = {
  slug: string;
  code: string;
  name: string;
  status: ProjectStatus;
  // Mono stack line in the home work list (same in both languages).
  stack: string;
  link: { href: string; label: string };
  // Real screenshots, by figure index, and the home thumbnail. Until they
  // exist the placeholder figure renders. TODO: demo screenshots.
  images?: (StaticImageData | undefined)[];
  thumbnail?: StaticImageData;
  copy: Record<Locale, ProjectCopy>;
};

const period = { en: "2026 – present", pt: "2026 – hoje" } as const;

export const projects: Project[] = [
  {
    slug: "zapichat",
    code: "PRJ-01",
    name: "Zapichat",
    status: "production",
    stack: "React · TypeScript · Supabase · Meta Cloud API",
    link: { href: "https://zapichat.com.br/", label: "zapichat.com.br" },
    copy: {
      en: {
        summary: "Multi-tenant CRM and customer service on WhatsApp.",
        role: "Full-stack developer",
        list: { summary: "Multi-tenant CRM and customer service on WhatsApp", role: "Full-stack developer" },
        specs: [
          { key: "period", value: period.en },
          { key: "channel", value: "WhatsApp Cloud API (Meta)" },
          { key: "frontend", value: "React · TypeScript · Vite · Tailwind" },
          {
            key: "backend",
            value: "Supabase (Postgres, Auth, Realtime, Storage, Edge Functions in Deno) · worker for queued sends",
          },
          { key: "infra", value: "Vercel · Sentry" },
        ],
        figures: [
          { caption: "Shared inbox, demo account", alt: "Screenshot placeholder: Zapichat shared inbox" },
          { caption: "CRM pipeline with deals by stage", alt: "Screenshot placeholder: Zapichat CRM pipeline" },
        ],
        problem:
          "Sales and support teams run on WhatsApp, but conversations scatter across phones and nobody sees the pipeline.",
        built: {
          title: "What the product does",
          items: [
            "Shared inbox for the team on the official WhatsApp API",
            "CRM pipeline with deals and stages",
            "Bulk campaigns with scheduling",
            "Automations, NPS surveys and analytics",
            "Many companies on one platform, each isolated",
          ],
        },
        decisions: [
          {
            title: "Sends go through a queue",
            text: "Bulk campaigns are queued and a separate worker sends them, so the app never blocks while thousands of messages go out.",
          },
          {
            title: "One platform, isolated companies",
            text: "Postgres Row Level Security keeps each company's data apart, enforced by the database, not by app code.",
          },
        ],
      },
      pt: {
        summary: "CRM e atendimento multi-tenant pelo WhatsApp.",
        role: "Desenvolvedor full stack",
        list: { summary: "CRM e atendimento multi-tenant pelo WhatsApp", role: "Desenvolvedor full stack" },
        specs: [
          { key: "period", value: period.pt },
          { key: "channel", value: "WhatsApp Cloud API (Meta)" },
          { key: "frontend", value: "React · TypeScript · Vite · Tailwind" },
          {
            key: "backend",
            value: "Supabase (Postgres, Auth, Realtime, Storage, Edge Functions em Deno) · worker para envios em fila",
          },
          { key: "infra", value: "Vercel · Sentry" },
        ],
        figures: [
          {
            caption: "Caixa de entrada compartilhada, conta demo",
            alt: "Captura provisória: caixa de entrada compartilhada do Zapichat",
          },
          {
            caption: "Funil de CRM com negócios por etapa",
            alt: "Captura provisória: funil de CRM do Zapichat",
          },
        ],
        problem:
          "Times de vendas e atendimento vivem no WhatsApp, mas as conversas ficam espalhadas pelos celulares e ninguém enxerga o funil.",
        built: {
          title: "O que o produto faz",
          items: [
            "Caixa de entrada compartilhada pela API oficial do WhatsApp",
            "Funil de CRM com negócios e etapas",
            "Disparos em massa com agendamento",
            "Automações, pesquisas de NPS e análises",
            "Várias empresas numa plataforma, cada uma isolada",
          ],
        },
        decisions: [
          {
            title: "Disparos passam por uma fila",
            text: "Campanhas em massa entram numa fila e um worker separado faz os envios, então o app não trava enquanto milhares de mensagens saem.",
          },
          {
            title: "Uma plataforma, empresas isoladas",
            text: "O Row Level Security do Postgres separa os dados de cada empresa, e quem garante isso é o banco, não o código do app.",
          },
        ],
      },
    },
  },
  {
    slug: "leia",
    code: "PRJ-02",
    name: "Léia",
    status: "early",
    stack: "Django · LangChain · pgvector · AWS EC2",
    link: { href: "https://www.assistenteleia.com.br/", label: "assistenteleia.com.br" },
    copy: {
      en: {
        summary:
          "An AI assistant on WhatsApp that answers condominium residents and passes to the manager what needs a person.",
        role: "CTO",
        list: { summary: "AI assistant that answers condominium residents", role: "CTO" },
        specs: [
          { key: "period", value: period.en },
          { key: "channel", value: "WhatsApp Cloud API (Meta), in coexistence with the phone app" },
          { key: "backend", value: "Django 6 · DRF · PostgreSQL + pgvector · Redis · Celery · Channels" },
          { key: "ai", value: "LangChain · LangGraph · OpenRouter · OpenAI embeddings" },
          { key: "infra", value: "AWS EC2" },
        ],
        figures: [
          { caption: "Manager inbox, demo account", alt: "Screenshot placeholder: Léia manager inbox" },
          { caption: "A resident asks on WhatsApp", alt: "Screenshot placeholder: resident chat on WhatsApp" },
          {
            caption: "Building documents indexed for answers",
            alt: "Screenshot placeholder: building documents indexed by Léia",
          },
        ],
        problem:
          "Residents ask the building the same questions every day: opening hours, rules, fees, bookings. Léia answers them on the WhatsApp number the condominium already uses, from the building's own documents.",
        built: {
          title: "What we built",
          items: [
            "RAG agent over the building's rules and bylaws, with OCR for scanned PDFs",
            "Voice notes transcribed and photos described before the agent replies",
            "Human handoff: inbox, manager queue, incidents and notices",
            "Common-area bookings with optional Google Calendar sync",
            "Virtual numbers verified inside the app, no SIM card",
            "Billing through Asaas with a conversation quota per plan",
          ],
        },
        decisions: [
          {
            title: "Official API, same number",
            text: "Coexistence lets the manager keep the phone app. When the manager replies from the phone, Léia steps back from that conversation.",
          },
          {
            title: "Chunk by section, not by size",
            text: "Bylaws are split along their own sections, so an answer quotes one rule instead of half of two.",
          },
          {
            title: "Slow work off the request",
            text: "Transcription, OCR and indexing run in Celery workers; the inbox updates over WebSockets.",
          },
        ],
      },
      pt: {
        summary:
          "Uma assistente de IA no WhatsApp que responde aos moradores do condomínio e passa para o síndico o que precisa de uma pessoa.",
        role: "CTO",
        list: { summary: "Assistente de IA que responde aos moradores do condomínio", role: "CTO" },
        specs: [
          { key: "period", value: period.pt },
          { key: "channel", value: "WhatsApp Cloud API (Meta), em coexistência com o app do celular" },
          { key: "backend", value: "Django 6 · DRF · PostgreSQL + pgvector · Redis · Celery · Channels" },
          { key: "ai", value: "LangChain · LangGraph · OpenRouter · OpenAI embeddings" },
          { key: "infra", value: "AWS EC2" },
        ],
        figures: [
          {
            caption: "Caixa de entrada do síndico, conta demo",
            alt: "Captura provisória: caixa de entrada do síndico na Léia",
          },
          {
            caption: "Um morador pergunta pelo WhatsApp",
            alt: "Captura provisória: conversa de um morador no WhatsApp",
          },
          {
            caption: "Documentos do prédio indexados para as respostas",
            alt: "Captura provisória: documentos do prédio indexados pela Léia",
          },
        ],
        problem:
          "Os moradores fazem as mesmas perguntas todo dia: horários, regras, taxas, reservas. A Léia responde pelo número de WhatsApp que o condomínio já usa, com base nos documentos do próprio prédio.",
        built: {
          title: "O que construímos",
          items: [
            "Agente com RAG sobre o regimento e a convenção, com OCR para PDF escaneado",
            "Áudios transcritos e fotos descritas antes de o agente responder",
            "Atendimento humano: caixa de entrada, fila do síndico, ocorrências e avisos",
            "Reserva de áreas comuns com sincronização opcional no Google Agenda",
            "Número virtual verificado pelo próprio app, sem chip",
            "Cobrança pelo Asaas com cota de conversas por plano",
          ],
        },
        decisions: [
          {
            title: "API oficial, mesmo número",
            text: "A coexistência deixa o síndico manter o app no celular. Quando ele responde pelo celular, a Léia sai daquela conversa.",
          },
          {
            title: "Fatiar por seção, não por tamanho",
            text: "O regimento é dividido pelas próprias seções, então a resposta cita uma regra inteira em vez de metade de duas.",
          },
          {
            title: "Trabalho pesado fora da requisição",
            text: "Transcrição, OCR e indexação rodam em workers do Celery; a caixa de entrada atualiza por WebSockets.",
          },
        ],
      },
    },
  },
  {
    slug: "nextech",
    code: "PRJ-03",
    name: "Nextech",
    status: "testing",
    stack: "Next.js · Supabase · OpenRouter · Resend",
    link: { href: "https://nextech.ia.br/", label: "nextech.ia.br" },
    copy: {
      en: {
        summary: "AI assistants on WhatsApp for clinics: answering, qualifying, booking and follow-up.",
        role: "Founder and only developer",
        list: { summary: "AI assistants for clinics: booking and follow-up", role: "Founder and developer" },
        specs: [
          { key: "period", value: period.en },
          { key: "channel", value: "WhatsApp Cloud API with coexistence, connected by Embedded Signup" },
          { key: "stack", value: "Next.js 16 (App Router) · TypeScript · Supabase (Postgres, Auth, RLS) · Vitest" },
          { key: "ai", value: "OpenRouter · Gemini 2.5 Flash (model set by config, never hardcoded)" },
          { key: "integrations", value: "Google Calendar (OAuth per clinic) · Resend · Asaas" },
        ],
        figures: [
          { caption: "Clinic dashboard, demo account", alt: "Screenshot placeholder: Nextech clinic dashboard" },
          {
            caption: "Bookings synced with the clinic's calendar",
            alt: "Screenshot placeholder: Nextech booking calendar",
          },
        ],
        problem:
          "Clinics lose patients who message after hours or never get a reply. Every unanswered message is a missed booking.",
        built: {
          title: "What I'm building",
          items: [
            "24/7 answers on the clinic's own WhatsApp number",
            "Booking that checks the clinic's calendar",
            "Follow-up and handoff to a person with a summary",
            "One adapter interface for every CRM",
          ],
        },
        decisions: [
          {
            title: "Patient data is sensitive by default",
            text: "Every table with clinic data has RLS by clinic, and the clinic id always comes from the server session. Message content is never logged in plain text.",
          },
          {
            title: "Each clinic's secrets are encrypted",
            text: "WhatsApp and Google tokens belong to the clinic, so they are encrypted at rest in the database, not stored as infra secrets.",
          },
          {
            title: "Automation as code",
            text: "No n8n. Webhooks, AI orchestration, scheduling and billing live in the app, tested and versioned.",
          },
        ],
      },
      pt: {
        summary: "Assistentes de IA no WhatsApp para clínicas: atendimento, qualificação, agendamento e follow-up.",
        role: "Fundador e único desenvolvedor",
        list: { summary: "Assistentes de IA para clínicas: agendamento e follow-up", role: "Fundador e desenvolvedor" },
        specs: [
          { key: "period", value: period.pt },
          { key: "channel", value: "WhatsApp Cloud API com coexistência, conectado por Embedded Signup" },
          { key: "stack", value: "Next.js 16 (App Router) · TypeScript · Supabase (Postgres, Auth, RLS) · Vitest" },
          { key: "ai", value: "OpenRouter · Gemini 2.5 Flash (modelo definido por configuração, nunca fixo no código)" },
          { key: "integrations", value: "Google Agenda (OAuth por clínica) · Resend · Asaas" },
        ],
        figures: [
          { caption: "Painel da clínica, conta demo", alt: "Captura provisória: painel da clínica na Nextech" },
          {
            caption: "Agendamentos sincronizados com a agenda da clínica",
            alt: "Captura provisória: agenda de consultas da Nextech",
          },
        ],
        problem:
          "Clínicas perdem pacientes que mandam mensagem fora do horário ou nunca recebem resposta. Cada mensagem sem resposta é uma consulta perdida.",
        built: {
          title: "O que estou construindo",
          items: [
            "Atendimento 24h no número de WhatsApp da própria clínica",
            "Agendamento que consulta a agenda da clínica",
            "Follow-up e passagem para uma pessoa com resumo",
            "Uma interface de adaptador para todos os CRMs",
          ],
        },
        decisions: [
          {
            title: "Dado de paciente é sensível por padrão",
            text: "Toda tabela com dado de clínica tem RLS por clínica, e o id da clínica sempre vem da sessão no servidor. Conteúdo de mensagem nunca vai para o log em texto puro.",
          },
          {
            title: "Segredos de cada clínica são criptografados",
            text: "Os tokens de WhatsApp e Google pertencem à clínica, então ficam criptografados no banco, e não como segredo de infraestrutura.",
          },
          {
            title: "Automação como código",
            text: "Nada de n8n. Webhooks, orquestração da IA, agendamento e cobrança ficam no app, testados e versionados.",
          },
        ],
      },
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

// Previous and next project for the pager at the bottom of a project page.
// The list wraps: the first page points back to the last.
export function getAdjacent(slug: string): { previous: Project; next: Project } | undefined {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  const count = projects.length;
  const previous = projects[(index - 1 + count) % count];
  const next = projects[(index + 1) % count];
  if (!previous || !next) return undefined;
  return { previous, next };
}
