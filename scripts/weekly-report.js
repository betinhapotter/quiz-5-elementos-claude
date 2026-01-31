/**
 * Weekly Code Story Generator
 * Automatically analyzes git history from the last 7 days and prepares 
 * the narrative for the Majestic Code Story agent.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configurações
const OUTPUT_FILE = 'WEEKLY_STORY.md';
const DAYS_TO_LOOK_BACK = 7;

async function generateWeeklyReport() {
    console.log('🎞️ Iniciando geração do Relatório Semanal de Code Story...');

    try {
        // 1. Obter logs da última semana
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - DAYS_TO_LOOK_BACK);
        const sinceIso = sinceDate.toISOString().split('T')[0];

        console.log(`📅 Analisando commits desde: ${sinceIso}`);

        const gitLogCommand = `git log --since="${sinceIso}" --pretty=format:"%h|%ai|%an|%s"`;
        const logs = execSync(gitLogCommand).toString().trim();

        if (!logs) {
            console.log('⚠️ Nenhum commit encontrado na última semana. Pulando geração.');
            return;
        }

        const commitCount = logs.split('\n').length;
        console.log(`📝 Encontrados ${commitCount} commits.`);

        // 2. Preparar o prompt para o agente (ou para o desenvolvedor ver)
        // Nota: Em um ambiente CI real, este script enviaria os logs para o modelo LLM.
        // Aqui, vamos gerar um template estruturado que o agente completará.

        const reportContent = `# 🎞️ Relatório Semanal: A Jornada da Semana (desde ${sinceIso})

## 📊 Estatísticas da Semana
- **Total de Commits:** ${commitCount}
- **Período:** ${sinceIso} até ${new Date().toISOString().split('T')[0]}

## 📜 Logs Brutos (Para Análise do Agente)
\`\`\`text
${logs}
\`\`\`

---
*Este arquivo foi preparado automaticamente pelo sistema de automação de sexta-feira. 
Mencione @majestic-code-story para transformar esses logs em uma narrativa completa.*
`;

        fs.writeFileSync(OUTPUT_FILE, reportContent, 'utf8');
        console.log(`✅ Relatório base gerado com sucesso em: ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('💥 Erro ao gerar relatório semanal:', error.message);
        process.exit(1);
    }
}

generateWeeklyReport();
