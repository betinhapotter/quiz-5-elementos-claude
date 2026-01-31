/**
 * Agent Synchronization Script
 * Transforms AIOS Core agent definitions (.md/YAML) to AntiGravity format (.yaml)
 * Supports multiple source directories (Core and Expansion Packs)
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const { AgentConfigLoader } = require('../.aios-core/development/scripts/agent-config-loader');

const ANTIGRAVITY_AGENTS_DIR = path.join(process.cwd(), '.antigravity', 'agents');

// Lista de diretórios contendo agentes (.md)
const AGENT_SOURCES = [
    {
        name: 'Core',
        path: path.join(process.cwd(), '.aios-core', 'development', 'agents')
    },
    {
        name: 'Methodology OS',
        path: 'C:\\Users\\Jaya\\methodology-os\\agents'
    }
];

async function syncAgents() {
    console.log('🔄 Iniciando sincronização multi-fonte de agentes...');

    try {
        // Garantir que o diretório de destino existe
        await fs.mkdir(ANTIGRAVITY_AGENTS_DIR, { recursive: true });

        for (const source of AGENT_SOURCES) {
            console.log(`\n📂 Verificando fonte: ${source.name} (${source.path})`);

            try {
                // Verificar se o diretório existe
                await fs.access(source.path);

                const files = await fs.readdir(source.path);
                const agentFiles = files.filter(f => f.endsWith('.md'));

                if (agentFiles.length === 0) {
                    console.log(`⚠️ Nenhum agente .md encontrado em ${source.name}`);
                    continue;
                }

                for (const file of agentFiles) {
                    const agentId = path.basename(file, '.md');
                    console.log(`  📡 Processando @${agentId}...`);

                    try {
                        // O AgentConfigLoader espera o ID do agente e assume que ele está no diretório padrão do core
                        // Se não for do core, precisamos ler o arquivo manualmente e simular o carregamento 
                        // ou injetar o caminho. Como não queremos mudar o Loader original, vamos ler e parsear:

                        const fullPath = path.join(source.path, file);
                        const content = await fs.readFile(fullPath, 'utf8');

                        // O AgentConfigLoader.prototype.loadAgentDefinition faz o parse do YAML no bloco markdown
                        // Vamos replicar a lógica básica de extração do YAML block
                        const yamlMatch = content.match(/```yaml([\s\S]*?)```/);
                        if (!yamlMatch) {
                            console.error(`  ❌ @${agentId}: Nenhum bloco YAML encontrado no arquivo .md`);
                            continue;
                        }

                        const definition = yaml.load(yamlMatch[1]);

                        // Transformar para o formato híbrido do AntiGravity
                        const antiGravityDef = {
                            name: definition.agent.id,
                            displayName: definition.agent.name,
                            description: definition.agent.title || definition.agent.whenToUse,
                            persona: {
                                role: definition.persona?.role || '',
                                expertise: definition.persona?.expertise || []
                            },
                            workflow: {
                                default: `${agentId}-workflow`,
                                triggers: [
                                    `@${agentId}`,
                                    ...(definition.commands ? Object.keys(definition.commands) : [])
                                ]
                            }
                        };

                        // Salvar como .yaml no AntiGravity
                        const outputPath = path.join(ANTIGRAVITY_AGENTS_DIR, `${agentId}.yaml`);
                        await fs.writeFile(outputPath, yaml.dump(antiGravityDef), 'utf8');
                        console.log(`  ✅ @${agentId} sincronizado em .antigravity/agents/${agentId}.yaml`);
                    } catch (err) {
                        console.error(`  ❌ Erro ao processar @${agentId}: ${err.message}`);
                    }
                }
            } catch (dirErr) {
                console.error(`⚠️ Fonte ${source.name} inacessível: ${dirErr.message}`);
            }
        }

        console.log('\n✨ Sincronização multi-fonte concluída com sucesso!');
    } catch (error) {
        console.error('💥 Erro fatal na sincronização:', error.message);
        process.exit(1);
    }
}

syncAgents();
