import type { StaticImageData } from "next/image";
import type { Screenshot } from "@/components/figure";
import type { Locale } from "@/lib/i18n";
import leia1 from "./images/leia-1.png";
import leia2 from "./images/leia-2.png";
import leia3 from "./images/leia-3.png";
import nextech1 from "./images/nextech-1.png";
import nextech2 from "./images/nextech-2.png";
import nextech3 from "./images/nextech-3.png";
import zapichat1 from "./images/zapichat-1.png";
import zapichat2 from "./images/zapichat-2.png";
import zapichat3 from "./images/zapichat-3.png";

// Project pages (docs/content.md, "Projects"). Shared facts sit on the
// project; everything a reader sees in one language sits in `copy`.

export type ProjectStatus = "production" | "early" | "testing";

// Rows of the project spec table. Role, status and link have their own fields.
export type SpecKey = "period" | "channel" | "frontend" | "backend" | "ai" | "infra" | "stack" | "integrations";

type FigureCopy = { caption: string; alt: string };

type Decision = { title: string; text: string };

export type ProjectCopy = {
  summary: string;
  // What the product does for its customer, in the product's own words.
  pitch: string;
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
  // Screenshots by figure index, and the home thumbnail. A figure without
  // one renders the drawn placeholder.
  images?: (Screenshot | undefined)[];
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
    images: [{ src: zapichat1 }, { src: zapichat2, position: "right" }, { src: zapichat3, position: "left" }],
    thumbnail: zapichat1,
    copy: {
      en: {
        summary: "Multi-tenant CRM and customer service on WhatsApp.",
        pitch:
          "Smart customer-service automation. Zapichat brings a company's whole WhatsApp into one shared inbox on Meta's official API, with a CRM pipeline, scheduled bulk campaigns, automations and NPS surveys. Every company is isolated on the same platform, and managers see the whole pipeline instead of conversations scattered across phones.",
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
          {
            caption: "Landing page: the shared inbox with quick replies",
            alt: "Zapichat landing page showing the shared inbox on desktop and phone, with a customer conversation and the quick replies panel",
          },
          {
            caption: "Sign-in page",
            alt: "Zapichat sign-in page with the headline “Venda mais. Responda melhor.” and the login form",
          },
          {
            caption: "Company dashboard: quick actions and conversations that need attention",
            alt: "Zapichat company dashboard with the side menu, a product news card, quick actions to reply, add a contact or send a bulk campaign, and conversations waiting for a reply",
          },
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
        pitch:
          "Automação inteligente de atendimento. O Zapichat reúne o WhatsApp da empresa inteira numa caixa de entrada só, pela API oficial da Meta, com funil de CRM, disparos em massa agendados, automações e pesquisas de NPS. Cada empresa fica isolada na mesma plataforma, e o gestor enxerga o funil inteiro em vez de conversas espalhadas pelos celulares.",
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
            caption: "Landing page: a caixa de entrada com respostas rápidas",
            alt: "Landing page do Zapichat mostrando a caixa de entrada no computador e no celular, com uma conversa de cliente e o painel de respostas rápidas",
          },
          {
            caption: "Página de login",
            alt: "Página de login do Zapichat com o título “Venda mais. Responda melhor.” e o formulário de acesso",
          },
          {
            caption: "Painel da empresa: ações rápidas e conversas que precisam de atenção",
            alt: "Painel da empresa no Zapichat com o menu lateral, um card de novidades do produto, ações rápidas para responder, adicionar contato ou fazer disparo em massa, e conversas aguardando resposta",
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
    images: [{ src: leia1 }, { src: leia2 }, { src: leia3, position: "left" }],
    thumbnail: leia1,
    copy: {
      en: {
        summary:
          "An AI assistant on WhatsApp that answers condominium residents and passes to the manager what needs a person.",
        pitch:
          "The manager sleeps; Léia answers. She talks to residents on the WhatsApp number the building already uses, at any hour, and handles everyday questions on her own (opening hours, rules, bills, bookings) from the condominium's own documents. When something is urgent or sensitive, she calls the person in charge. When a rule changes, the answer changes with it.",
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
          {
            caption: "Landing page: a resident books the party room on WhatsApp",
            alt: "Léia landing page with the headline “O síndico dorme. A léia responde.” beside a WhatsApp chat where a resident books the party room",
          },
          {
            caption: "Sign-in page",
            alt: "Léia sign-in page: user and password form over a drawn city skyline",
          },
          {
            caption: "Manager overview on a new account: setup, plan quota and service numbers",
            alt: "Léia manager dashboard on a new account: assistant, WhatsApp and document base not set up yet, 0 of 1,000 plan conversations used and service counters at zero",
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
        pitch:
          "O síndico dorme, a Léia responde. Ela atende os moradores no número de WhatsApp que o prédio já usa, a qualquer hora, e resolve sozinha as dúvidas do dia a dia, como horários, regras, boletos e reservas, com base nos documentos do próprio condomínio. Quando o assunto é urgente ou sensível, ela chama o responsável. Se a regra muda, a resposta muda junto.",
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
            caption: "Landing page: um morador reserva o salão de festas pelo WhatsApp",
            alt: "Landing page da Léia com o título “O síndico dorme. A léia responde.” ao lado de uma conversa de WhatsApp em que um morador reserva o salão de festas",
          },
          {
            caption: "Página de login",
            alt: "Página de login da Léia: formulário de usuário e senha sobre o desenho de uma cidade",
          },
          {
            caption: "Visão geral do síndico numa conta nova: configuração, cota do plano e números do atendimento",
            alt: "Painel do síndico na Léia numa conta nova: assistente, WhatsApp e base de documentos ainda não configurados, 0 de 1.000 conversas do plano usadas e contadores de atendimento zerados",
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
    images: [{ src: nextech1 }, { src: nextech2 }, { src: nextech3, position: "left" }],
    thumbnail: nextech1,
    copy: {
      en: {
        summary: "AI assistants on WhatsApp for clinics: answering, qualifying, booking and follow-up.",
        pitch:
          "Fast answers, smart management. Nextech puts an AI assistant on the clinic's WhatsApp that replies in seconds, understands voice notes, tells real patients from casual questions and books against the clinic's real calendar, with no one on staff in the middle. Patients who stop replying get a follow-up, and everything lands in the clinic's CRM.",
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
          {
            caption: "Landing page: AI assistants for clinics",
            alt: "Nextech landing page with the headline “Atendimento ágil. Nextech AI.” and buttons to book a meeting or see a demo",
          },
          {
            caption: "Sign-in to the clinic panel",
            alt: "Nextech sign-in page for the clinic panel, with email and password fields",
          },
          {
            caption: "Clinic overview with fictional demo data: what needs attention",
            alt: "Nextech clinic dashboard in demo mode with fictional data, listing four items that need attention, such as an urgent patient report and a template rejected by Meta",
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
        pitch:
          "Atendimento ágil, gestão inteligente. A Nextech coloca no WhatsApp da clínica um assistente de IA que responde em segundos, entende áudio, separa quem quer marcar de quem só está perguntando e agenda direto na agenda real da clínica, sem ninguém da equipe no meio. Quem para de responder recebe follow-up, e tudo vai para o CRM da clínica.",
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
          {
            caption: "Landing page: assistentes de IA para clínicas",
            alt: "Landing page da Nextech com o título “Atendimento ágil. Nextech AI.” e botões para agendar uma reunião ou ver a demonstração",
          },
          {
            caption: "Login no painel da clínica",
            alt: "Página de login do painel da clínica na Nextech, com campos de e-mail e senha",
          },
          {
            caption: "Visão geral da clínica com dados fictícios de demonstração: o que precisa de atenção",
            alt: "Painel da clínica na Nextech em modo demonstração com dados fictícios, listando quatro itens que precisam de atenção, como um relato urgente de paciente e um template rejeitado pela Meta",
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
