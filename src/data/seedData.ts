import { 
  AppState, 
  DiagnosticProcedure, 
  Equipment, 
  KnowledgeArticle, 
  Ticket, 
  TicketEvent, 
  UserProfile 
} from '../types';

export const SEED_USERS: UserProfile[] = [
  {
    id: 'user-tec-01',
    nome: 'Carlos Eduardo Mendes',
    cargo: 'Analista de Suporte N2',
    email: 'carlos.mendes@example.com',
    setor: 'Tecnologia da Informação',
    perfil: 'tecnico',
    avatarInitials: 'CM',
  },
  {
    id: 'user-colab-01',
    nome: 'Mariana Silva',
    cargo: 'Analista Financeiro Pleno',
    email: 'mariana.silva@example.com',
    setor: 'Financeiro',
    perfil: 'colaborador',
    avatarInitials: 'MS',
  },
  {
    id: 'user-admin-01',
    nome: 'Renata Vasconcelos',
    cargo: 'Coordenadora de ITSM e Governança',
    email: 'renata.vasconcelos@example.com',
    setor: 'Tecnologia da Informação',
    perfil: 'admin',
    avatarInitials: 'RV',
  },
];

export const SEED_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-001',
    codigo: 'OTHX-PC-0001',
    tipo: 'Computador',
    fabricante: 'Dell',
    modelo: 'OptiPlex 7090 Micro',
    hostname: 'OTHX-PC-0001',
    ip: '192.168.10.45',
    setor: 'Financeiro',
    usuario: 'Mariana Silva',
    especificacoes: {
      os: 'Windows 11 Pro 64-bit 23H2',
      cpu: 'Intel Core i5-11500T 1.50GHz',
      ram: '16 GB DDR4 3200MHz',
      storage: '512 GB NVMe SSD',
    },
    status: 'operacional',
    observacoes: 'Estação principal do posto de faturamento e conciliação bancária.',
  },
  {
    id: 'eq-002',
    codigo: 'OTHX-NB-0001',
    tipo: 'Notebook',
    fabricante: 'Lenovo',
    modelo: 'ThinkPad T14 Gen 3',
    hostname: 'OTHX-NB-0001',
    ip: '192.168.10.112',
    setor: 'Comercial',
    usuario: 'Roberto Silveira',
    especificacoes: {
      os: 'Windows 11 Pro 64-bit',
      cpu: 'Intel Core i7-1260P',
      ram: '32 GB LPDDR5',
      storage: '1 TB PCIe Gen4 SSD',
    },
    status: 'operacional',
    observacoes: 'Configurado com VPN corporativa OTHX e acesso remoto seguro.',
  },
  {
    id: 'eq-003',
    codigo: 'OTHX-PRN-0001',
    tipo: 'Impressora',
    fabricante: 'Zebra',
    modelo: 'ZT230 Térmica',
    hostname: 'OTHX-PRN-0001',
    ip: '192.168.20.18',
    setor: 'Logística',
    usuario: 'Expedição & Logística',
    especificacoes: {
      os: 'Firmware V72.19.15Z',
      cpu: 'Controlador Zebra 300DPI',
      ram: '128 MB',
      storage: 'Flash Memory 128MB',
    },
    status: 'em_manutencao',
    observacoes: 'Utilizada para impressão de etiquetas de remessa e códigos de barras de pallets.',
  },
  {
    id: 'eq-004',
    codigo: 'OTHX-PC-0002',
    tipo: 'Computador',
    fabricante: 'HP',
    modelo: 'ProDesk 400 G6 SFF',
    hostname: 'OTHX-PC-0002',
    ip: '192.168.30.22',
    setor: 'Operações',
    usuario: 'Recepção Operacional',
    especificacoes: {
      os: 'Windows 10 Pro 22H2',
      cpu: 'Intel Core i3-10100 3.60GHz',
      ram: '8 GB DDR4',
      storage: '256 GB SSD SATA',
    },
    status: 'operacional',
    observacoes: 'Estação de recepção e controle de acesso a unidades fabris.',
  },
  {
    id: 'eq-005',
    codigo: 'OTHX-PRN-0002',
    tipo: 'Impressora',
    fabricante: 'Kyocera',
    modelo: 'ECOSYS M3655idn',
    hostname: 'OTHX-PRN-0002',
    ip: '192.168.10.200',
    setor: 'Administrativo',
    usuario: 'Geral Administrativo',
    especificacoes: {
      os: 'Firmware 2TX_2000.002',
      cpu: 'Cortex-A9 Dual Core 1.2GHz',
      ram: '1 GB',
      storage: 'SD Card 32GB',
    },
    status: 'operacional',
    observacoes: 'Multifuncional de alto volume com duplex automático e digitalização corporativa.',
  },
];

export const SEED_DIAGNOSTICS: DiagnosticProcedure[] = [
  {
    id: 'diag-001',
    titulo: 'Computador não liga',
    categoria: 'Computadores e notebooks',
    dificuldade: 'facil',
    sintomas: [
      'Gabinete sem nenhum LED aceso',
      'Ventoinha não gira ao pressionar o botão Power',
      'Monitor sem receber sinal de vídeo',
      'Nenhum bipe sonoro da placa-mãe',
    ],
    possiveisCausas: [
      'Cabo de força desconectado ou danificado',
      'Chave seletora de voltagem ou filtro de linha desligado',
      'Fonte de alimentação ATX desarmada ou com defeito',
      'Botão Liga/Desliga do painel frontal com mau contato',
      'Curto em periférico conectado às portas USB',
    ],
    etapas: [
      {
        ordem: 1,
        titulo: 'Verificação da Tomada e Filtro de Linha',
        orientacao: 'Checar se a tomada possui energia ativa testando outro aparelho ou observando os LEDs do filtro de linha. Verifique se a chave geral está ligada.',
        resultadoEsperado: 'Energia presente e estável na tomada elétrica da estação.',
        recomendacao: 'Certifique-se da tensão nominal correta (110V / 220V) antes de alterar conectores.',
      },
      {
        ordem: 2,
        titulo: 'Inspeção do Cabo de Força e Conexão Traseira',
        orientacao: 'Desconectar e reconectar com firmeza o cabo tripolar tipo NBR 14136 na traseira da fonte do computador.',
        resultadoEsperado: 'Cabo firmemente encaixado, sem folgas e sem fios partidos.',
        recomendacao: 'Caso o cabo apresente aquecimento ou marcas de dobra severa, substitua imediatamente.',
      },
      {
        ordem: 3,
        titulo: 'Drenagem de Carga Residual (Ciclo de Energia)',
        orientacao: 'Retirar o cabo de força da tomada. Segurar o botão Power pressionado por 20 segundos contínuos para descarregar capacitores da placa-mãe. Em seguida, reconectar e ligar.',
        resultadoEsperado: 'A placa-mãe reinicia os controladores de energia e o sistema inicializa.',
        recomendacao: 'Procedimento padrão e não destrutivo com alta taxa de resolução para proteção contra surtos.',
      },
      {
        ordem: 4,
        titulo: 'Desconexão de Periféricos Não Essenciais',
        orientacao: 'Remover pen drives, adaptadores e impressoras USB. Deixar conectado apenas teclado e mouse nas portas traseiras.',
        resultadoEsperado: 'Eliminação de periféricos em curto que possam desarmar a fonte.',
        recomendacao: 'Se ligar após desconectar, conecte um acessório por vez para identificar o dispositivo defeituoso.',
      },
      {
        ordem: 5,
        titulo: 'Teste com Fonte de Bancada / Multímetro',
        orientacao: 'Caso os passos anteriores falhem, encaminhar o equipamento para a bancada técnica de TI para teste de linhas de +12V, +5V e +3.3V.',
        resultadoEsperado: 'Identificação conclusiva se o defeito é na fonte de alimentação ou placa-mãe.',
        recomendacao: 'Registrar número de patrimônio e providenciar máquina reserva temporária para o colaborador.',
      },
    ],
  },
  {
    id: 'diag-002',
    titulo: 'Impressora puxa várias folhas',
    categoria: 'Impressoras e etiquetas',
    dificuldade: 'facil',
    sintomas: [
      'Alimentação múltipla de papel na bandeja principal',
      'Atolamento de papel logo na entrada do tracionador',
      'Folhas amassadas ou desalinhadas na saída',
    ],
    possiveisCausas: [
      'Borracha do Pick-up Roller (rolete de tração) desgastada ou com sujeira de pó de papel',
      'Separation Pad (almofada de separação) gasta ou desencaixada',
      'Papel com umidade excessiva ou estática acumulada',
      'Guias de largura da bandeja frouxas ou mal ajustadas',
      'Gramatura do papel inadequada para a impressora',
    ],
    etapas: [
      {
        ordem: 1,
        titulo: 'Verificação do Papel e Ventilação das Folhas',
        orientacao: 'Retirar o bloco de folhas da bandeja. Ventilar e folhear as páginas para eliminar a eletricidade estática. Certifique-se de que o papel não está exposto à umidade.',
        resultadoEsperado: 'Folhas soltas e sem aderência mútua.',
        recomendacao: 'Orientar o setor a manter resmas de papel sempre na embalagem protetora original fechada.',
      },
      {
        ordem: 2,
        titulo: 'Ajuste das Guias Laterais da Bandeja',
        orientacao: 'Verificar se as guias de papel estão perfeitamente encostadas nas bordas do bloco (A4 ou Carta) sem apertar excessivamente nem deixar folga.',
        resultadoEsperado: 'Papel alinhado centralmente, impedindo puxadas diagonais.',
        recomendacao: 'Não exceder a linha indicadora de capacidade máxima de folhas na bandeja.',
      },
      {
        ordem: 3,
        titulo: 'Limpeza dos Roletes de Alimentação (Pick-up Roller)',
        orientacao: 'Com a impressora desligada, abrir a tampa de acesso ao papel e limpar suavemente a borracha do rolete de tração com pano de microfibra levemente umedecido em água deionizada.',
        resultadoEsperado: 'Remoção do pó de celulose e restauração da aderência mecânica da borracha.',
        recomendacao: 'Não usar solventes agressivos, acetona ou óleo na borracha do rolete.',
      },
      {
        ordem: 4,
        titulo: 'Inspeção Visual da Almofada de Separação (Pad)',
        orientacao: 'Verificar se a peça de separação abaixo do rolete está desgastada, lisa ou sem a pressão de mola necessária.',
        resultadoEsperado: 'Pad com superfície de atrito íntegra.',
        recomendacao: 'Se o pad estiver liso ou gasto, programar substituição da peça de reposição.',
      },
    ],
  },
  {
    id: 'diag-003',
    titulo: 'Computador sem acesso à rede',
    categoria: 'Redes e internet',
    dificuldade: 'medio',
    sintomas: [
      'Ícone de rede do Windows com globo ou aviso de sem conexão',
      'Mensagem "Rede Não Identificada" ou "Sem Conexão"',
      'Incapaz de acessar compartilhamentos internos e sistemas web',
      'Comando ping para o gateway padrão falha',
    ],
    possiveisCausas: [
      'Cabo de rede RJ-45 desconectado, quebrado ou com trava rompida',
      'Porta do switch corporativo desativada ou na VLAN incorreta',
      'Endereço IP com conflito ou falha na renovação via DHCP',
      'Adaptador de rede desativado nas configurações do sistema',
      'Configuração manual de proxy ou DNS incorreta',
    ],
    etapas: [
      {
        ordem: 1,
        titulo: 'Inspeção Física do Cabo e LEDs da Placa de Rede',
        orientacao: 'Verificar na traseira do computador se os LEDs de link (verde/âmbar) da porta RJ-45 estão acesos e piscando. Reconecte o cabo na tomada de rede da parede.',
        resultadoEsperado: 'LED de Link aceso fixo e LED de atividade piscando.',
        recomendacao: 'Se os LEDs estiverem apagados, teste com outro cabo de rede Cat6 homologado.',
      },
      {
        ordem: 2,
        titulo: 'Verificação do Adaptador de Rede no Sistema',
        orientacao: 'Acessar Conexões de Rede (ncpa.cpl) e confirmar se a interface Ethernet está habilitada.',
        resultadoEsperado: 'Adaptador com status "Habilitado" e velocidade negociada em 1000 Mbps (Gigabit).',
        recomendacao: 'Se estiver desabilitado, clique com botão direito e selecione "Ativar".',
      },
      {
        ordem: 3,
        titulo: 'Renovação do Endereço IP via DHCP',
        orientacao: 'Abrir o Prompt de Comando (cmd) e executar ordenadamente: ipconfig /release seguido de ipconfig /renew.',
        resultadoEsperado: 'A máquina recebe IP válido na faixa corporativa (ex: 192.168.x.x) e máscara correta.',
        recomendacao: 'Se o IP recebido for no formato 169.254.x.x (APIPA), o servidor DHCP está inacessível pelo switch.',
      },
      {
        ordem: 4,
        titulo: 'Teste de Conectividade com Gateway e DNS Corporativo',
        orientacao: 'Executar ping para o Gateway Padrão e para o DNS interno da empresa.',
        resultadoEsperado: 'Respostas com tempo menor que 2ms e 0% de perda de pacotes.',
        recomendacao: 'Se o Gateway responder mas nomes de sites não resolverem, execute: ipconfig /flushdns.',
      },
    ],
  },
  {
    id: 'diag-004',
    titulo: 'Protheus apresenta erro ao iniciar',
    categoria: 'TOTVS Protheus',
    dificuldade: 'medio',
    sintomas: [
      'SmartClient fecha imediatamente após o clique ou tela de splash',
      'Erro "Communication Error - Socket closed" ao conectar',
      'Mensagem "Invalid environment" ou "Thread connection error"',
      'Tela de login do TOTVS Protheus congelada',
    ],
    possiveisCausas: [
      'Serviço do AppServer do Protheus reiniciando ou parado no servidor',
      'Arquivo smartclient.ini corrompido ou apontando para IP antigo',
      'Bloqueio da porta TCP 1234/1235 pelo Firewall local',
      'Limite de licenças concorrentes atingido na base TOTVS',
      'Cache temporário do Protheus corrompido na máquina do usuário',
    ],
    etapas: [
      {
        ordem: 1,
        titulo: 'Verificação da Conexão com o Servidor de Aplicação',
        orientacao: 'Testar conectividade com a porta do AppServer Protheus executando comando de teste de porta ou ping no servidor corporativo erp.example.com.',
        resultadoEsperado: 'Conexão TCP estabelecida com sucesso na porta de atendimento do SmartClient.',
        recomendacao: 'Verifique se o problema ocorre apenas na estação do solicitante ou se há outros chamados do mesmo setor.',
      },
      {
        ordem: 2,
        titulo: 'Conferência do Arquivo de Configuração smartclient.ini',
        orientacao: 'Verificar no diretório C:\\TOTVS\\SmartClient se a seção [PRODUCAO] contém o Server e Port oficiais homologados pela TI.',
        resultadoEsperado: 'Parâmetros de ambiente condizentes com o ambiente de Produção ativo.',
        recomendacao: 'Nunca alterar diretamente conexões de banco de dados ou arquivos de build.',
      },
      {
        ordem: 3,
        titulo: 'Limpeza de Cache Temporário Local',
        orientacao: 'Fechar todas as instâncias do smartclient.exe. Excluir os arquivos temporários da pasta %TEMP% e pasta C:\\TOTVS\\SmartClient\\rpo_cache caso exista.',
        resultadoEsperado: 'O SmartClient baixa novamente os recursos atualizados sem resquícios corrompidos.',
        recomendacao: 'Prática recomendada pela TOTVS após atualizações de patch no RPO.',
      },
      {
        ordem: 4,
        titulo: 'Verificação de Sessão Presa no Monitor de Licenças',
        orientacao: 'Acessar o TOTVS License Server para checar se o usuário possui sessão zumbi ou trava por encerramento anormal.',
        resultadoEsperado: 'Liberação da licença presa permitindo autenticação limpa.',
        recomendacao: 'Se houver necessidade de derrubar sessão, confirme antes se o usuário não estava no meio de rotina de faturamento.',
      },
    ],
  },
  {
    id: 'diag-005',
    titulo: 'VPN não conecta',
    categoria: 'VPN e acessos',
    dificuldade: 'medio',
    sintomas: [
      'FortiClient para em 40% ou 98% da barra de conexão',
      'Erro "Credential or SSL VPN configuration wrong"',
      'Mensagem "Unable to establish the VPN connection (-8)", timeout',
      'Autenticação de dois fatores (MFA) não envia notificação',
    ],
    possiveisCausas: [
      'Senha de rede do Active Directory expirada ou bloqueada por tentativas incorretas',
      'Portal SSL-VPN com porta ou endereço DNS digitado incorretamente',
      'Antivírus ou firewall local bloqueando o driver de túnel virtual (FortiSSL)',
      'Relógio da estação desincronizado gerando falha no token TOTP',
      'Provedor de internet residencial do colaborador bloqueando portas UDP/TCP de VPN',
    ],
    etapas: [
      {
        ordem: 1,
        titulo: 'Validação da Conta no Active Directory (AD)',
        orientacao: 'Consultar no console do AD se a conta do colaborador está ativa, desimpedida e sem exigência de troca imediata de senha.',
        resultadoEsperado: 'Conta em status "Normal / Ativa" e sem lockout de tentativas de senha.',
        recomendacao: 'Caso o usuário esteja com senha vencida, oriente a redefinição através do portal corporativo oficial.',
      },
      {
        ordem: 2,
        titulo: 'Conferência do Endereço do Gateway VPN e Porta',
        orientacao: 'Verificar nas configurações do túnel no FortiClient se o servidor está como vpn.example.com e porta 10443 marcada.',
        resultadoEsperado: 'Parâmetros oficiais da infraestrutura de segurança preenchidos.',
        recomendacao: 'Não marcar a opção "Do not Warn Invalid Server Certificate" sem aprovação da equipe de segurança.',
      },
      {
        ordem: 3,
        titulo: 'Sincronização de Data e Hora do Sistema Operacional',
        orientacao: 'Verificar se o relógio do Windows está sincronizado com os servidores de horário da internet (time.windows.com ou ntp.br).',
        resultadoEsperado: 'Horário local preciso com discrepância menor que 30 segundos.',
        recomendacao: 'Discrepâncias de mais de 1 minuto invalidam tokens de autenticação multifator (MFA).',
      },
      {
        ordem: 4,
        titulo: 'Reinício do Adaptador Virtual WAN Miniport / Fortinet',
        orientacao: 'Executar reinício do serviço FortiClient Service no Windows (services.msc) e restabelecer a conexão de rede virtual.',
        resultadoEsperado: 'Túnel SSL estabelecido com obtenção de IP interno 10.200.x.x e acesso aos servidores.',
        recomendacao: 'Se o travamento persistir em 40%, normalmente trata-se de credencial/MFA incorreto; se travar em 98%, indica conflito de rota local.',
      },
    ],
  },
];

export const SEED_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-001',
    titulo: 'Como liberar porta e reconectar o SmartClient TOTVS Protheus',
    categoria: 'TOTVS Protheus',
    sintomas: [
      'SmartClient não conecta ao AppServer',
      'Erro socket closed ao abrir o Protheus',
      'Tela de login nunca é exibida',
    ],
    conteudo: `### Objetivo
Orientar o procedimento de teste e liberação de conexão entre a estação cliente e o servidor TOTVS Protheus corporativo.

### Pré-requisitos
- Estar conectado à rede cabeada corporativa ou via VPN OTHX autenticada.
- Permissão de acesso ao diretório do SmartClient no Windows.

### Procedimento Passo a Passo
1. Verifique se o arquivo \`smartclient.ini\` localizado em \`C:\\TOTVS\\SmartClient\` aponta para o servidor oficial:
   - **Server:** \`erp.example.com\`
   - **Port:** \`1234\`
   - **Environment:** \`PRODUCAO\`
2. Abra o Prompt de Comando (CMD) e execute o teste de rota:
   \`ping erp.example.com\`
3. Verifique se o Firewall do Windows não está bloqueando o binário \`smartclient.exe\`. Caso necessário, confira nas Regras de Entrada se o aplicativo está liberado para o perfil Domínio.
4. Exclua a pasta temporária de cache: \`C:\\TOTVS\\SmartClient\\rpo_cache\` se existir.
5. Inicie o SmartClient novamente com duplo clique.`,
    status: 'aprovado',
    autor: 'Carlos Eduardo Mendes',
    dataCriacao: '2026-02-10T14:30:00Z',
    dataAtualizacao: '2026-10-15T09:12:00Z',
  },
  {
    id: 'art-002',
    titulo: 'Calibração e configuração de sensor da impressora Zebra ZT230',
    categoria: 'Impressoras e etiquetas',
    sintomas: [
      'Zebra pulando etiquetas em branco',
      'LED de Status piscando em vermelho',
      'Impressão desalinhada fora da margem da etiqueta',
    ],
    conteudo: `### Procedimento de Calibração Manual do Sensor
A impressora térmica Zebra ZT230 necessita de calibração do sensor transmissivo (gap) sempre que um novo lote de etiquetas com tamanho diferente é instalado.

### Passos:
1. Com a impressora ligada e com mídia e ribbon carregados corretamente:
2. Pressione o botão **PAUSE** para pausar a impressão (LED Pause aceso).
3. Pressione e mantenha pressionado o botão **CALIBRATE** (Calibrar) por 3 segundos.
4. A impressora avançará várias etiquetas medindo a transparência do papel e o espaçamento (gap) entre elas.
5. Quando o avanço parar, pressione novamente o botão **PAUSE** para retornar ao estado pronto (LED de status verde sólido).
6. Pressione o botão **FEED** (Avanço) uma única vez. A impressora deverá avançar exatamente uma etiqueta, parando na linha de serrilha de corte.`,
    status: 'aprovado',
    autor: 'Carlos Eduardo Mendes',
    dataCriacao: '2026-03-05T10:00:00Z',
    dataAtualizacao: '2026-09-20T16:40:00Z',
  },
  {
    id: 'art-003',
    titulo: 'Guia de Instalação e Configuração da VPN FortiClient',
    categoria: 'VPN e acessos',
    sintomas: [
      'Necessidade de trabalhar em home office',
      'Acesso seguro a servidores de arquivos e ERP fora do escritório',
    ],
    conteudo: `### Instruções para Colaboradores em Teletrabalho
Para acessar os sistemas internos corporativos em ambiente externo, siga este guia:

1. Baixe o instalador homologado do FortiClient VPN disponível no portal corporativo.
2. Após a instalação, execute o aplicativo e clique no ícone de engrenagem para adicionar nova conexão.
3. Configure os seguintes campos:
   - **Tipo de VPN:** SSL-VPN
   - **Nome da Conexão:** OTHX Corporativo
   - **Gateway Remoto:** \`vpn.example.com\`
   - **Porta:** \`10443\`
   - **Habilitar logon único:** Não
4. Clique em Salvar.
5. Insira seu usuário de rede (ex: \`mariana.silva\`) e sua senha habitual do computador.
6. Digite o código de 6 dígitos recebido no aplicativo de autenticação de dois fatores (MFA).`,
    status: 'aprovado',
    autor: 'Renata Vasconcelos',
    dataCriacao: '2026-01-18T08:00:00Z',
    dataAtualizacao: '2026-10-02T11:25:00Z',
  },
  {
    id: 'art-004',
    titulo: 'Resolução de erro de spooler de impressão travado no Windows',
    categoria: 'Computadores e notebooks',
    sintomas: [
      'Documentos ficam na fila de impressão com status "Excluindo"',
      'Não imprime nem cancela trabalhos',
      'Erro "O serviço de Spooler de Impressão local não está sendo executado"',
    ],
    conteudo: `### Procedimento de Reinício do Spooler de Impressão
Quando documentos corrompidos travam a fila do Windows, utilize os seguintes comandos no terminal com elevação:

1. Abra o Prompt de Comando como Administrador.
2. Pare o serviço:
   \`net stop spooler\`
3. Exclua os arquivos temporários da fila de impressão que estão bloqueados:
   \`del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*"\`
4. Reinicie o serviço:
   \`net start spooler\`
5. Peça para o colaborador tentar enviar uma nova página de teste.`,
    status: 'aprovado',
    autor: 'Carlos Eduardo Mendes',
    dataCriacao: '2026-04-12T11:00:00Z',
    dataAtualizacao: '2026-08-14T15:00:00Z',
  },
  {
    id: 'art-005',
    titulo: 'Instalação e Validação do Certificado Digital A1/A3 para NF-e',
    categoria: 'Sistemas e softwares',
    sintomas: [
      'Erro "Certificado Digital não encontrado" no faturamento',
      'Smart card ou token USB não reconhecido',
    ],
    conteudo: `### Procedimento para Instalação de Certificados A1 (.pfx)
1. Dê um duplo clique no arquivo do certificado \`.pfx\`.
2. Selecione a opção **Máquina Local** e clique em Avançar.
3. Insira a senha fornecida pelo departamento financeiro.
4. Marque a opção: "Marcar esta chave como exportável" e "Incluir todas as propriedades estendidas".
5. Selecione a opção "Selecionar automaticamente o repositório de certificados".
6. Abra as opções da Internet (inetcpl.cpl) -> guia Conteúdo -> botão Certificados e verifique se o certificado corporativo está listado na pasta Pessoal com validade vigente.`,
    status: 'aprovado',
    autor: 'Renata Vasconcelos',
    dataCriacao: '2026-05-20T14:00:00Z',
    dataAtualizacao: '2026-09-30T10:15:00Z',
  },
  {
    id: 'art-006',
    titulo: 'Boas Práticas de Segurança e Acessos ao Active Directory',
    categoria: 'VPN e acessos',
    sintomas: [
      'Orientações gerais sobre senhas e políticas de expiração',
    ],
    conteudo: `### Política de Senhas e Contas
- As senhas da empresa expiram a cada 90 dias conforme diretrizes de segurança da informação e normas ISO 27001.
- A senha deve conter no mínimo 10 caracteres, combinando letras maiúsculas, minúsculas, números e símbolos.
- Bloqueio automático ocorre após 5 tentativas consecutivas incorretas.
- O desbloqueio pode ser solicitado diretamente pelo canal de Help Desk no ramal 4001 ou abertura de OS nesta plataforma.`,
    status: 'rascunho',
    autor: 'Renata Vasconcelos',
    dataCriacao: '2026-10-18T16:00:00Z',
    dataAtualizacao: '2026-10-25T08:30:00Z',
  },
];

export const SEED_TICKETS: Ticket[] = [
  {
    id: 'tick-001',
    numeroOS: 'OS-2026-0001',
    titulo: 'Erro de comunicação no SmartClient ao emitir notas fiscais',
    descricao: 'Ao tentar acessar a rotina de faturamento no TOTVS Protheus, o sistema apresenta a mensagem "Communication Error - Socket closed" e encerra repentinamente.',
    solicitante: 'Mariana Silva',
    email: 'mariana.silva@example.com',
    setor: 'Financeiro',
    categoria: 'TOTVS Protheus',
    subcategoria: 'Módulo Faturamento / Emissão NFe',
    impacto: 'impedido_trabalhar',
    prioridade: 'alta',
    status: 'em_atendimento',
    responsavel: 'Carlos Eduardo Mendes',
    equipamentoId: 'eq-001',
    dataAbertura: '2026-10-27T08:15:00Z',
    dataAtualizacao: '2026-10-27T09:20:00Z',
  },
  {
    id: 'tick-002',
    numeroOS: 'OS-2026-0002',
    titulo: 'Impressora de etiquetas puxando várias folhas e travando na Logística',
    descricao: 'A impressora Zebra da Expedição está puxando três etiquetas de uma vez e atolando na saída do rolete, impedindo o despacho de cargas programadas.',
    solicitante: 'Fernanda Lins',
    email: 'fernanda.lins@example.com',
    setor: 'Logística',
    categoria: 'Impressoras e etiquetas',
    subcategoria: 'Puxando várias folhas ao mesmo tempo / Atolamento',
    impacto: 'setor_parado',
    prioridade: 'critica',
    status: 'novo',
    equipamentoId: 'eq-003',
    dataAbertura: '2026-10-27T09:05:00Z',
    dataAtualizacao: '2026-10-27T09:05:00Z',
  },
  {
    id: 'tick-003',
    numeroOS: 'OS-2026-0003',
    titulo: 'Computador de Operações não liga na recepção da fábrica',
    descricao: 'Estação de triagem operacional não dá nenhum sinal de vida ao apertar o botão de ligar. LEDs da frente apagados e sem rotação da ventoinha da fonte.',
    solicitante: 'Lucas Aguiar',
    email: 'lucas.aguiar@example.com',
    setor: 'Operações',
    categoria: 'Computadores e notebooks',
    subcategoria: 'Computador não liga / Sem energia',
    impacto: 'impedido_trabalhar',
    prioridade: 'alta',
    status: 'novo',
    equipamentoId: 'eq-004',
    dataAbertura: '2026-10-27T07:40:00Z',
    dataAtualizacao: '2026-10-27T07:40:00Z',
  },
  {
    id: 'tick-004',
    numeroOS: 'OS-2026-0004',
    titulo: 'VPN FortiClient falha com timeout para diretoria comercial em viagem',
    descricao: 'Estou em viagem comercial externa e ao conectar à VPN para aprovar ordens de compra, a barra trava em 40% com mensagem de credencial ou timeout.',
    solicitante: 'Roberto Silveira',
    email: 'roberto.silveira@example.com',
    setor: 'Comercial',
    categoria: 'VPN e acessos',
    subcategoria: 'VPN FortiClient não conecta ou desconecta rápido',
    impacto: 'impedido_trabalhar',
    prioridade: 'alta',
    status: 'em_atendimento',
    responsavel: 'Renata Vasconcelos',
    equipamentoId: 'eq-002',
    dataAbertura: '2026-10-26T21:30:00Z',
    dataAtualizacao: '2026-10-27T08:00:00Z',
  },
  {
    id: 'tick-005',
    numeroOS: 'OS-2026-0005',
    titulo: 'Ponto de rede sem internet na sala de inspeção da Qualidade',
    descricao: 'O computador da bancada de calibração está com o ícone do globo na barra de tarefas (Rede não identificada). Não abre o sistema de controle de laudos.',
    solicitante: 'Patrícia Nogueira',
    email: 'patricia.nogueira@example.com',
    setor: 'Qualidade',
    categoria: 'Redes e internet',
    subcategoria: 'Sem acesso à rede local / Servidores internos',
    impacto: 'setor_parado',
    prioridade: 'critica',
    status: 'aguardando_retorno',
    responsavel: 'Carlos Eduardo Mendes',
    dataAbertura: '2026-10-26T14:10:00Z',
    dataAtualizacao: '2026-10-27T08:45:00Z',
  },
  {
    id: 'tick-006',
    numeroOS: 'OS-2026-0006',
    titulo: 'Instalação de software de modelagem 3D homologado',
    descricao: 'Solicito a instalação do visualizador de arquivos CAD homologado na estação de trabalho da Engenharia de Produção.',
    solicitante: 'Claudio Barreto',
    email: 'claudio.barreto@example.com',
    setor: 'Produção',
    categoria: 'Sistemas e softwares',
    subcategoria: 'Instalação de software padrão homologado',
    impacto: 'consigo_trabalhar',
    prioridade: 'media',
    status: 'novo',
    dataAbertura: '2026-10-26T17:00:00Z',
    dataAtualizacao: '2026-10-26T17:00:00Z',
  },
  {
    id: 'tick-007',
    numeroOS: 'OS-2026-0007',
    titulo: 'Substituição de toner e limpeza de cilindro da Kyocera',
    descricao: 'Impressora multifuncional do administrativo está apresentando faixa cinza no lado direito dos documentos digitalizados e impressos.',
    solicitante: 'Juliana Castro',
    email: 'juliana.castro@example.com',
    setor: 'Administrativo',
    categoria: 'Impressoras e etiquetas',
    subcategoria: 'Falha na qualidade da impressão / Manchas',
    impacto: 'consigo_trabalhar',
    prioridade: 'baixa',
    status: 'concluido',
    responsavel: 'Carlos Eduardo Mendes',
    equipamentoId: 'eq-005',
    dataAbertura: '2026-10-25T10:00:00Z',
    dataAtualizacao: '2026-10-25T14:20:00Z',
    dataResolucao: '2026-10-25T14:20:00Z',
    dataConclusao: '2026-10-25T14:20:00Z',
    solucao: 'Efetuada a substituição do cartucho de toner preto original Kyocera e realizada a limpeza do fio de corona e vidro de exposição do scanner. Páginas de teste impressas com alinhamento perfeito.',
  },
  {
    id: 'tick-008',
    numeroOS: 'OS-2026-0008',
    titulo: 'Desbloqueio de senha do Active Directory para colaboradora de folga',
    descricao: 'Usuário bloqueado após tentativas de digitação da senha pelo smartphone corporativo.',
    solicitante: 'Aline Meirelles',
    email: 'aline.meirelles@example.com',
    setor: 'Recursos Humanos',
    categoria: 'VPN e acessos',
    subcategoria: 'Usuário bloqueado no Active Directory (AD)',
    impacto: 'impedido_trabalhar',
    prioridade: 'alta',
    status: 'concluido',
    responsavel: 'Carlos Eduardo Mendes',
    dataAbertura: '2026-10-25T16:15:00Z',
    dataAtualizacao: '2026-10-25T16:45:00Z',
    dataResolucao: '2026-10-25T16:45:00Z',
    dataConclusao: '2026-10-25T16:45:00Z',
    solucao: 'Conta desbloqueada no AD e solicitado reset de credenciais com envio de senha temporária via canal seguro autenticado.',
  },
  {
    id: 'tick-009',
    numeroOS: 'OS-2026-0009',
    titulo: 'Lentidão severa ao gerar relatórios fiscais do mês no Protheus',
    descricao: 'A rotina de apuração do SPED Fiscal está demorando mais de 4 horas para processar e travando a conexão com o banco de dados.',
    solicitante: 'Gabriel Viana',
    email: 'gabriel.viana@example.com',
    setor: 'Financeiro',
    categoria: 'TOTVS Protheus',
    subcategoria: 'Lentidão extrema em rotinas do Protheus',
    impacto: 'consigo_trabalhar',
    prioridade: 'media',
    status: 'em_atendimento',
    responsavel: 'Renata Vasconcelos',
    dataAbertura: '2026-10-24T09:30:00Z',
    dataAtualizacao: '2026-10-26T11:00:00Z',
  },
  {
    id: 'tick-010',
    numeroOS: 'OS-2026-0010',
    titulo: 'Certificado Digital A1 vence em 5 dias no setor financeiro',
    descricao: 'Aviso do portal da Receita Federal alertando sobre a expiração do certificado e-CNPJ da instituição.',
    solicitante: 'Claudia Morais',
    email: 'claudia.morais@example.com',
    setor: 'Financeiro',
    categoria: 'Sistemas e softwares',
    subcategoria: 'Certificado Digital A1 / A3 (Token não reconhecido)',
    impacto: 'sem_interrupcao',
    prioridade: 'media',
    status: 'aguardando_retorno',
    responsavel: 'Renata Vasconcelos',
    dataAbertura: '2026-10-23T15:00:00Z',
    dataAtualizacao: '2026-10-26T14:30:00Z',
  },
  {
    id: 'tick-011',
    numeroOS: 'OS-2026-0011',
    titulo: 'Configuração de novo ponto de rede para posto de supervisão na Produção',
    descricao: 'Necessidade de ativar a porta 14 do patch panel para ligar o computador da supervisão da Linha 2 de montagem.',
    solicitante: 'Simone Rocha',
    email: 'simone.rocha@example.com',
    setor: 'Produção',
    categoria: 'Redes e internet',
    subcategoria: 'Cabo de rede danificado ou desconectado',
    impacto: 'sem_interrupcao',
    prioridade: 'baixa',
    status: 'concluido',
    responsavel: 'Carlos Eduardo Mendes',
    dataAbertura: '2026-10-22T08:00:00Z',
    dataAtualizacao: '2026-10-22T11:45:00Z',
    dataResolucao: '2026-10-22T11:45:00Z',
    dataConclusao: '2026-10-22T11:45:00Z',
    solucao: 'Patch cord conectorizado no switch gerenciável Cisco Catalyst, porta configurada na VLAN Operacional e link de 1Gbps testado com certificador de cabos.',
  },
  {
    id: 'tick-012',
    numeroOS: 'OS-2026-0012',
    titulo: 'Recolhimento de monitores antigos substituídos na Logística',
    descricao: 'Três monitores CRT e cabos VGA antigos precisam ser recolhidos para triagem de descarte sustentável e baixa patrimonial.',
    solicitante: 'Marcos Vinicius',
    email: 'marcos.vinicius@example.com',
    setor: 'Logística',
    categoria: 'Outros',
    subcategoria: 'Descarte ou recolhimento de equipamento antigo',
    impacto: 'sem_interrupcao',
    prioridade: 'baixa',
    status: 'concluido',
    responsavel: 'Carlos Eduardo Mendes',
    dataAbertura: '2026-10-20T14:00:00Z',
    dataAtualizacao: '2026-10-21T10:00:00Z',
    dataResolucao: '2026-10-21T10:00:00Z',
    dataConclusao: '2026-10-21T10:00:00Z',
    solucao: 'Equipamentos recolhidos para o depósito de TI, emitido termo de baixa patrimonial junto à controladoria.',
  },
];

export const SEED_EVENTS: TicketEvent[] = [
  {
    id: 'evt-001',
    ticketId: 'tick-001',
    tipoEvento: 'criacao',
    descricao: 'Chamado aberto por Mariana Silva com impacto "Estou impedido de trabalhar".',
    usuario: 'Mariana Silva',
    visibilidade: 'publico',
    dataHora: '2026-10-27T08:15:00Z',
  },
  {
    id: 'evt-002',
    ticketId: 'tick-001',
    tipoEvento: 'atribuicao',
    descricao: 'Chamado assumido pelo técnico Carlos Eduardo Mendes.',
    usuario: 'Carlos Eduardo Mendes',
    visibilidade: 'publico',
    dataHora: '2026-10-27T08:30:00Z',
  },
  {
    id: 'evt-003',
    ticketId: 'tick-001',
    tipoEvento: 'mudanca_status',
    descricao: 'Status alterado de "Novo" para "Em Atendimento".',
    usuario: 'Carlos Eduardo Mendes',
    visibilidade: 'publico',
    dataHora: '2026-10-27T08:30:00Z',
  },
  {
    id: 'evt-004',
    ticketId: 'tick-001',
    tipoEvento: 'comentario',
    descricao: 'Realizado teste de ping para o servidor do Protheus (erp.example.com). A máquina responde normalmente, indicando que a falha reside no cache local do SmartClient ou bloqueio no firewall local da máquina OTHX-PC-0001.',
    usuario: 'Carlos Eduardo Mendes',
    visibilidade: 'interno',
    dataHora: '2026-10-27T09:20:00Z',
  },
  {
    id: 'evt-005',
    ticketId: 'tick-002',
    tipoEvento: 'criacao',
    descricao: 'Chamado aberto em caráter de urgência pela Logística devido a interrupção no fluxo de expedição.',
    usuario: 'Fernanda Lins',
    visibilidade: 'publico',
    dataHora: '2026-10-27T09:05:00Z',
  },
  {
    id: 'evt-006',
    ticketId: 'tick-007',
    tipoEvento: 'criacao',
    descricao: 'Abertura do chamado para manutenção da impressora multifuncional.',
    usuario: 'Juliana Castro',
    visibilidade: 'publico',
    dataHora: '2026-10-25T10:00:00Z',
  },
  {
    id: 'evt-007',
    ticketId: 'tick-007',
    tipoEvento: 'conclusao',
    descricao: 'Atendimento concluído. Substituído toner original e realizada calibração da imagem.',
    usuario: 'Carlos Eduardo Mendes',
    visibilidade: 'publico',
    dataHora: '2026-10-25T14:20:00Z',
  },
];

export const INITIAL_STATE: AppState = {
  tickets: SEED_TICKETS,
  events: SEED_EVENTS,
  articles: SEED_ARTICLES,
  equipment: SEED_EQUIPMENT,
  diagnostics: SEED_DIAGNOSTICS,
  executions: [],
  currentUser: SEED_USERS[0], // Carlos Eduardo Mendes (Técnico)
  availableUsers: SEED_USERS,
};
