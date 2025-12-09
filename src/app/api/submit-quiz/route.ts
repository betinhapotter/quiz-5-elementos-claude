import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Element, elementsInfo } from '@/types/quiz';

// Inicializa Resend (configure RESEND_API_KEY no .env)
const resend = new Resend(process.env.RESEND_API_KEY);

interface SubmitQuizBody {
  email: string;
  name?: string;
  result: {
    lowestElement: Element;
    lowestScore: number;
    scores: Record<Element, number>;
    pattern?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitQuizBody = await request.json();
    const { email, name, result } = body;

    // Validação básica
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (!result || !result.lowestElement) {
      return NextResponse.json(
        { error: 'Resultado do quiz inválido' },
        { status: 400 }
      );
    }

    const elementInfo = elementsInfo[result.lowestElement];

    // Aqui você salvaria no banco de dados
    // await db.quizResults.create({ email, name, result, createdAt: new Date() });

    // Envia email com resultado
    const emailContent = generateEmailContent(result.lowestElement, name);

    // Descomente quando tiver a API key do Resend configurada
    /*
    await resend.emails.send({
      from: 'Jaya Roberta <quiz@seudominio.com>',
      to: email,
      subject: `Seu resultado: Elemento ${elementInfo.name.toUpperCase()} desalinhado ${elementInfo.icon}`,
      html: emailContent,
    });
    */

    // Por enquanto, só loga
    console.log('Quiz submetido:', {
      email,
      name,
      lowestElement: result.lowestElement,
      scores: result.scores,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Resultado enviado para seu email!',
    });
  } catch (error) {
    console.error('Erro ao processar quiz:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

function generateEmailContent(element: Element, name?: string): string {
  const templates: Record<Element, { subject: string; body: string }> = {
    terra: {
      subject: 'Elemento TERRA desalinhado 🌍',
      body: `
        <h2>O QUE ISSO SIGNIFICA:</h2>
        <p>A base do seu relacionamento está instável. Isso pode significar:</p>
        <ul>
          <li>Falta de confiança plena</li>
          <li>Compromisso vago ou inconsistente</li>
          <li>Ausência de rituais/tradições que conectam vocês</li>
          <li>Sensação de que "cada um vive sua vida"</li>
        </ul>
        
        <h2>POR QUE VOCÊS FALAM MAS NÃO SE SENTEM OUVIDOS:</h2>
        <p>Quando a TERRA está desalinhada, as conversas ficam superficiais porque falta a SEGURANÇA para serem vulneráveis. Vocês não confiam que o outro vai "segurar" o que for dito.</p>
        
        <h2>PRIMEIROS PASSOS:</h2>
        <ol>
          <li>Conversem sobre compromisso: "Você está 100% dentro dessa relação?"</li>
          <li>Criem 1 ritual simples: jantar juntos 3x/semana SEM celular</li>
          <li>Alinhem valores: "O que é inegociável pra você numa relação?"</li>
        </ol>
      `,
    },
    agua: {
      subject: 'Elemento ÁGUA desalinhado 💧',
      body: `
        <h2>O QUE ISSO SIGNIFICA:</h2>
        <p>Falta conexão emocional profunda. Isso pode significar:</p>
        <ul>
          <li>Vocês conversam sobre logística (contas, compromissos) mas não sobre sentimentos</li>
          <li>Você não conhece os sonhos/medos reais do seu parceiro(a)</li>
          <li>Falta acolhimento emocional nos momentos difíceis</li>
          <li>Cada um fica na sua "bolha emocional"</li>
        </ul>
        
        <h2>POR QUE VOCÊS FALAM MAS NÃO SE SENTEM OUVIDOS:</h2>
        <p>Quando a ÁGUA está desalinhada, vocês até trocam palavras, mas não há EMPATIA. Um fala sobre emoção, o outro responde com lógica. Não há encontro verdadeiro.</p>
        
        <h2>PRIMEIROS PASSOS:</h2>
        <ol>
          <li>Façam 1 pergunta profunda por dia: "O que te deixou mais feliz hoje? E mais triste?"</li>
          <li>Pratiquem escuta sem tentar "resolver": só acolham</li>
          <li>Criem "mapas de amor": dediquem 30 min para explorar os sonhos/medos do outro</li>
        </ol>
      `,
    },
    ar: {
      subject: 'Elemento AR desalinhado 🌬️',
      body: `
        <h2>O QUE ISSO SIGNIFICA:</h2>
        <p>A comunicação entre vocês está travada. Isso pode significar:</p>
        <ul>
          <li>Vocês falam MAS não se sentem ouvidos</li>
          <li>Discussões viram brigas que nunca resolvem nada</li>
          <li>Um pede atenção/conversa e o outro ignora ou minimiza</li>
          <li>Existe muro de silêncio ou explosões</li>
        </ul>
        
        <h2>POR QUE VOCÊS FALAM MAS NÃO SE SENTEM OUVIDOS:</h2>
        <p>Quando o AR está desalinhado, é EXATAMENTE isso: vocês falam línguas diferentes. Um fala, o outro ouve como ataque. Um pede conexão, o outro lê como cobrança. O ar não circula.</p>
        
        <h2>PRIMEIROS PASSOS:</h2>
        <ol>
          <li>Respondam aos pedidos de conexão (mesmo que seja "agora não posso, mas às 20h sim")</li>
          <li>Durante conflitos, façam pausas de 20 min quando esquentar demais</li>
          <li>Pratiquem espelhamento: "O que ouvi você dizer foi... Entendi certo?"</li>
        </ol>
      `,
    },
    fogo: {
      subject: 'Elemento FOGO desalinhado 🔥',
      body: `
        <h2>O QUE ISSO SIGNIFICA:</h2>
        <p>A paixão e admiração estão apagadas. Isso pode significar:</p>
        <ul>
          <li>A relação virou "administrativa" (dividir tarefas, pagar contas)</li>
          <li>Pouco ou nenhum contato físico/afetivo</li>
          <li>Vocês não admiram ou incentivam os sonhos um do outro</li>
          <li>Falta desejo, curiosidade, ser FÃ um do outro</li>
        </ul>
        
        <h2>POR QUE VOCÊS FALAM MAS NÃO SE SENTEM OUVIDOS:</h2>
        <p>Quando o FOGO está desalinhado, vocês até conversam, mas falta CALOR. As palavras são frias, técnicas, sem vida. Não há energia, não há brilho nos olhos.</p>
        
        <h2>PRIMEIROS PASSOS:</h2>
        <ol>
          <li>Expressem 1 admiração por dia: "Eu admiro em você..."</li>
          <li>Resgatem toque físico não-sexual: abraço de 20 segundos, massagem, dançar junto</li>
          <li>Apoiem os sonhos do outro ATIVAMENTE: "Como posso te ajudar com isso?"</li>
        </ol>
      `,
    },
    eter: {
      subject: 'Elemento ÉTER desalinhado ✨',
      body: `
        <h2>O QUE ISSO SIGNIFICA:</h2>
        <p>Falta perspectiva positiva e propósito maior. Isso pode significar:</p>
        <ul>
          <li>Foco constante no que está errado, não no que funciona</li>
          <li>Sensação de "estamos juntos mas pra quê?"</li>
          <li>Falta de visão de futuro compartilhada</li>
          <li>Relacionamento sem significado que transcenda o cotidiano</li>
        </ul>
        
        <h2>POR QUE VOCÊS FALAM MAS NÃO SE SENTEM OUVIDOS:</h2>
        <p>Quando o ÉTER está desalinhado, vocês conversam sobre problemas mas não sobre PROPÓSITO. Falta o "por quê maior" que dá sentido às dificuldades. Sem isso, toda conversa parece vazia.</p>
        
        <h2>PRIMEIROS PASSOS:</h2>
        <ol>
          <li>Façam "poupança emocional": todo dia, compartilhem 1 coisa que admiram no outro</li>
          <li>Conversem sobre visão de futuro: "Como queremos estar daqui 5 anos?"</li>
          <li>Criem um propósito compartilhado: um valor/missão que guia vocês</li>
        </ol>
      `,
    },
  };

  const template = templates[element];
  const greeting = name ? `Oi ${name},` : 'Oi,';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #E25822; }
        h2 { color: #5A524A; margin-top: 24px; }
        ul, ol { padding-left: 20px; }
        li { margin-bottom: 8px; }
        .cta { background: #E25822; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 24px 0; font-weight: bold; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <p>${greeting}</p>
      <p>Seu teste revelou que o elemento <strong>${elementsInfo[element].name.toUpperCase()}</strong> está desalinhado no seu relacionamento.</p>
      
      ${template.body}
      
      <h2>QUER MERGULHAR MAIS FUNDO?</h2>
      <p>O <strong>Diagnóstico Completo dos 5 Elementos</strong> analisa TODOS os 5 elementos do seu relacionamento (não só o desalinhado) e te entrega um plano de ação personalizado de 30 dias.</p>
      
      <a href="https://seusite.com/diagnostico-completo" class="cta">FAZER DIAGNÓSTICO COMPLETO — R$27</a>
      
      <div class="footer">
        <p>Um abraço,<br><strong>Jaya Roberta</strong></p>
        <p>Terapeuta Integrativa | Relacionamentos & Sexualidade</p>
        <p><a href="https://www.instagram.com/jaya.terapia/">@jaya.terapia</a></p>
      </div>
    </body>
    </html>
  `;
}
