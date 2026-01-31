/**
 * Meta-Command Engine: *commad
 * Automates the creation of agents, tasks, and workflows across the entire AIOS ecosystem.
 * Syncs with AntiGravity, Cursor, Claude (Cline), and Gemini.
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configurações de Diretórios
const CORE_AGENTS_DIR = path.join(process.cwd(), '.aios-core', 'development', 'agents');
const IDE_RULES = [
    path.join(process.cwd(), '.cursorrules'),
    path.join(process.cwd(), '.clinerules'),
    path.join(process.cwd(), '.gemini', 'antigravity', 'rules')
];

async function createCommad() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('❌ Uso: node scripts/commad.js <type> <name> [description]');
        process.exit(1);
    }

    const [type, name, description] = args;
    const agentId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const targetFile = path.join(CORE_AGENTS_DIR, `${agentId}.md`);

    console.log(`🛠️ Iniciando criação de ${type}: @${agentId}...`);

    try {
        // 1. Verificação de Existência
        try {
            await fs.access(targetFile);
            console.error(`⚠️ Erro: @${agentId} já existe em ${targetFile}`);
            process.exit(1);
        } catch (e) {
            // Arquivo não existe, podemos prosseguir
        }

        // 2. Geração do Boilerplate (Alta Qualidade)
        const boilerplate = `
# ${agentId}

ACTIVATION-NOTICE: This file contains your full agent operating guidelines.

## COMPLETE AGENT DEFINITION

\`\`\`yaml
agent:
  id: ${agentId}
  name: "${name}"
  title: "${type === 'agent' ? 'AIOS Specialized Agent' : 'AIOS Task Workflow'}"
  icon: "🔧"
  whenToUse: "${description || 'Nova capacidade adicionada ao ecossistema AIOS.'}"

persona:
  role: "Especialista em ${name}"
  style: "Direto, metódico e focado em resultados."
  identity: "Parte integrante do sistema AntiGravity."

commands:
  - name: execute
    description: "Executa a função principal do @${agentId}"
    action: "Inicia o fluxo definido para ${name}"

security:
  validation:
    - "Sempre validar inputs do usuário antes de processar"
\`\`\`

---
*Gerado automaticamente via *commad em ${new Date().toISOString()}*
`;

        // 3. Salvar no Core (Fonte da Verdade)
        await fs.mkdir(CORE_AGENTS_DIR, { recursive: true });
        await fs.writeFile(targetFile, boilerplate.trim(), 'utf8');
        console.log(`✅ Definição principal criada: ${targetFile}`);

        // 4. Distribuir para IDE Rules (.cursorrules, .clinerules, etc)
        console.log('📝 Atualizando regras multi-IDE...');
        const ruleUpdate = `- @${agentId}: ${description || 'Agente especializado em ' + name}\n`;

        for (const rulePath of IDE_RULES) {
            try {
                // Ensure directory exists
                const dir = path.dirname(rulePath);
                await fs.mkdir(dir, { recursive: true });

                let currentContent = '';
                try {
                    currentContent = await fs.readFile(rulePath, 'utf8');
                } catch (e) {
                    currentContent = '# AIOS Rules & Agent Directory\n\n';
                }

                if (!currentContent.includes(`@${agentId}`)) {
                    const separator = currentContent.endsWith('\n') ? '' : '\n';
                    await fs.appendFile(rulePath, `${separator}${ruleUpdate}`, 'utf8');
                    console.log(`  ✅ Regra atualizada: ${path.basename(rulePath)}`);
                }
            } catch (err) {
                console.error(`  ⚠️ Erro ao atualizar ${rulePath}: ${err.message}`);
            }
        }

        // 5. Sincronizar com AntiGravity (Opcional, mas recomendado)
        console.log('🔄 Sincronizando com AntiGravity...');
        try {
            execSync('node scripts/sync-agents.js', { stdio: 'inherit' });
        } catch (syncErr) {
            console.error('⚠️ Aviso: Falha na sincronização automatizada. Execute npm run sync:agents manualmente.');
        }

        console.log(`\n✨ @${agentId} está configurado em todo o ecossistema!`);

    } catch (error) {
        console.error('💥 Erro fatal no *commad:', error.message);
        process.exit(1);
    }
}

createCommad();
