import { ProjectModel } from '../models/ProjectModel';
import connectDB from '../config/database';

const projectNames = [
  'Sistema de Gestão Empresarial',
  'App Mobile de Delivery',
  'Portal de E-commerce',
  'Sistema de CRM',
  'Plataforma de Streaming',
  'Sistema de Gestão Hospitalar',
  'App de Controle Financeiro',
  'Portal de Notícias',
  'Sistema de Gestão Educacional',
  'App de Rede Social',
  'Sistema de Gestão de Estoque',
  'Portal de Turismo',
  'App de Fitness',
  'Sistema de Gestão de Projetos',
  'Portal de Imóveis',
  'Sistema de Gestão de RH',
  'App de Transporte',
  'Sistema de Gestão de Vendas',
  'Portal de Cursos Online',
  'App de Música',
  'Sistema de Biblioteca',
  'Portal de Eventos',
  'App de Receitas',
  'Sistema de Gestão de Clientes',
  'Portal de Freelancers',
  'App de Meditação',
  'Sistema de Gestão de Tarefas',
  'Portal de Classificados',
  'App de Clima',
  'Sistema de Gestão de Documentos',
  'Portal de Saúde',
  'App de Jogos',
  'Sistema de Gestão de Contratos',
  'Portal de Investimentos',
  'App de Mapas',
  'Sistema de Gestão de Qualidade',
  'Portal de Arte',
  'App de Comunicação',
  'Sistema de Gestão de Ativos',
  'Portal de Tecnologia',
  'App de Produtividade',
  'Sistema de Gestão de Recursos',
  'Portal de Entretenimento',
  'App de Compras',
  'Sistema de Gestão de Processos',
  'Portal de Ciência',
  'App de Utilidades',
  'Sistema de Gestão de Segurança',
  'Portal de Cultura',
  'App de Negócios'
];

const clients = [
  'Empresa Alpha Ltda',
  'Beta Solutions',
  'Gamma Tech',
  'Delta Corp',
  'Epsilon Digital',
  'Zeta Systems',
  'Eta Consulting',
  'Theta Group',
  'Iota Ventures',
  'Kappa Industries',
  'Lambda Labs',
  'Mu Enterprises',
  'Nu Technologies',
  'Xi Innovations',
  'Omicron Holdings',
  'Pi Dynamics',
  'Rho Partners',
  'Sigma Solutions',
  'Tau Technologies',
  'Upsilon Systems',
  'Phi Consulting',
  'Chi Development',
  'Psi Group',
  'Omega Corporation',
  'Acme Industries'
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function generateProjects() {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conectado com sucesso!');

    console.log('Gerando 50 projetos de teste...');
    
    const projects = [];
    
    for (let i = 0; i < 50; i++) {
      const startDate = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
      const endDate = randomDate(startDate, new Date(2025, 11, 31));
      
      const project = {
        name: projectNames[i],
        client: getRandomElement(clients),
        startDate,
        endDate,
        isFavorite: Math.random() > 0.7, // 30% de chance de ser favorito
        coverImage: undefined // Sem imagem de capa para simplificar
      };
      
      projects.push(project);
    }

    // Inserir todos os projetos
    const result = await ProjectModel.insertMany(projects);
    console.log(`✅ ${result.length} projetos criados com sucesso!`);

    // Mostrar alguns exemplos
    console.log('\n📋 Alguns projetos criados:');
    result.slice(0, 5).forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} - ${project.client}`);
    });

    console.log('\n🎯 Pronto! Agora você pode testar a exclusão no frontend.');
    
  } catch (error) {
    console.error('❌ Erro ao gerar projetos:', error);
  } finally {
    process.exit(0);
  }
}

generateProjects();
