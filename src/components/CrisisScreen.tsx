'use client';

import { QuizResult } from '@/types/quiz';

interface CrisisScreenProps {
  result: QuizResult;
  onScheduleSession: () => void;
}

export default function CrisisScreen({ result, onScheduleSession }: CrisisScreenProps) {
  const whatsappNumber = '5561991692353'; // Substituir pelo número real da Jaya
  const whatsappMessage = encodeURIComponent(
    'Olá Jaya! Fiz o Quiz dos 5 Elementos e meu resultado indicou que todos os elementos estão em crise. Gostaria de agendar uma Sessão de Emergência.'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-gray-900 to-gray-950 text-white">
      {/* Header de Alerta */}
      <div className="bg-red-900/50 border-b border-red-700 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🆘</span>
          <span className="font-medium">Alerta: Colapso dos 5 Elementos Detectado</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Título Principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Relacionamento em Crise
          </h1>
          <p className="text-red-300 text-lg">
            Todos os 5 elementos estão em colapso simultâneo
          </p>
        </div>

        {/* Scores Visuais */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-red-900/50">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
            Seus Scores
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(result.scores).map(([element, score]) => (
              <div key={element} className="text-center">
                <div className="text-2xl mb-1">
                  {element === 'terra' && '🌍'}
                  {element === 'agua' && '💧'}
                  {element === 'ar' && '🌬️'}
                  {element === 'fogo' && '🔥'}
                  {element === 'eter' && '✨'}
                </div>
                <div className="text-red-400 font-bold">{score}/8</div>
                <div className="text-xs text-gray-500 capitalize">{element}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mensagem Principal */}
        <div className="bg-gray-800/30 rounded-xl p-6 mb-8 border-l-4 border-red-500">
          <p className="text-lg leading-relaxed mb-4">
            Quando todos os pilares estão abalados ao mesmo tempo, 
            <strong className="text-white"> um planner não é suficiente.</strong>
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            Isso não significa que acabou — casais já saíram de situações piores. 
            Mas vocês precisam de <strong className="text-white">suporte adequado</strong>, não de band-aid.
          </p>
          <p className="text-gray-400 italic">
            Este é um momento que pede atenção profissional.
          </p>
        </div>

        {/* O que eu recomendo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>⚡</span> O que eu recomendo agora
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-4">
              <span className="text-yellow-500 text-xl">1.</span>
              <p><strong>NÃO tomem decisões drásticas essa semana.</strong> Crise não é o melhor momento para escolhas definitivas.</p>
            </div>
            <div className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-4">
              <span className="text-yellow-500 text-xl">2.</span>
              <p><strong>Priorizem segurança</strong> — física e emocional — acima de tudo.</p>
            </div>
            <div className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-4">
              <span className="text-yellow-500 text-xl">3.</span>
              <p><strong>Busquem suporte profissional</strong> — individual ou de casal.</p>
            </div>
            <div className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-4">
              <span className="text-yellow-500 text-xl">4.</span>
              <p><strong>Lembrem-se:</strong> crise não é sentença, é sinal de que algo precisa mudar.</p>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* CTA Principal - Sessão de Emergência */}
        <div className="bg-gradient-to-br from-red-900/50 to-orange-900/30 rounded-2xl p-6 md:p-8 border border-red-700/50">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💬</span>
            <div>
              <h2 className="text-xl font-bold">Sessão de Emergência</h2>
              <p className="text-gray-400 text-sm">30 minutos • Online • Valor a combinar</p>
            </div>
          </div>

          <p className="text-gray-300 mb-6">
            Uma conversa focada para entender o que está acontecendo e criar um plano imediato de estabilização.
          </p>

          <div className="bg-black/30 rounded-xl p-5 mb-6">
            <h3 className="font-semibold mb-3 text-white">Nessa sessão vamos:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Compreender o que detonou a crise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Criar um plano de estabilização de 7 dias</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Definir o que faz sentido para você individualmente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Identificar se há violência/abuso (encaminhamento para autoridades competentes)</span>
              </li>
            </ul>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Agendar Sessão de Emergência
            </span>
          </a>

          <p className="text-center text-gray-500 text-sm mt-4">
            Respondo em até 24 horas úteis
          </p>
        </div>

        {/* Nota de Segurança */}
        <div className="mt-8 bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-300 mb-2">Nota importante sobre segurança</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Se você está em situação de violência doméstica ou abuso, sua segurança vem primeiro. 
                Ligue <strong>180</strong> (Central de Atendimento à Mulher) ou <strong>190</strong> (Polícia). 
                Esses serviços são gratuitos e funcionam 24h.
              </p>
            </div>
          </div>
        </div>

        {/* Assinatura */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">
            Com você nessa travessia,
          </p>
          <p className="text-white font-medium mt-1">
            Jaya Roberta
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Terapeuta Integrativa em Relacionamentos e Sexualidade
          </p>
        </div>
      </div>
    </div>
  );
}
