import type { RomanticConfig } from '~/types/date'

/**
 * ─────────────────────────────────────────────────────────────
 *  O CONVITE — configuração central
 * ─────────────────────────────────────────────────────────────
 *  Tudo que é pessoal vive aqui: nomes, número, mensagens,
 *  opções de date, cores, música e calendário.
 *
 *  Nas mensagens você pode usar:
 *    {nome}     → nome de quem recebe (ou "você")
 *    {remetente} → seu nome (ou "eu")
 *
 *  IMPORTANTE: troque `whatsappNumber` pelo seu número,
 *  com DDI + DDD, apenas dígitos. Ex.: 5511987654321.
 */
export const romanticConfig: RomanticConfig = {
  recipientName: '',
  senderName: '',
  whatsappNumber: '5515997402280',

  siteUrl: '',
  siteTitle: 'Um convite, só pra você 💗',
  siteDescription:
    'Tem uma pergunta esperando por você. Uma daquelas que podem deixar o dia mais bonito.',
  ogImage: '/images/og-image.png',

  messages: {
    welcomeEyebrow: 'Um convite, feito com carinho',
    welcomeTitle: 'Ei, {nome}...',
    welcomeTitleAccent: '{nome}',
    welcomeLead:
      'Preparei uma coisinha especial pra você. Uma daquelas que a gente guarda na memória.',
    welcomeCta: 'Descobrir surpresa',
    welcomeNote: 'É rapidinho — e eu prometo que vale a pena.',

    invitationEyebrow: 'Capítulo um · o convite',
    invitationTitle: 'Tenho uma perguntinha pra você...',
    invitationTitleAccent: 'perguntinha',
    invitationLead:
      'Sem pressão e sem plateia. Só eu, você e a possibilidade de um dia muito bom.',
    invitationQuestion: 'Você aceita sair comigo?',
    invitationQuestionAccent: 'sair comigo',
    invitationNote: 'Prometo que não mordo. 😌',
    yesLabel: 'Sim, eu aceito',
    noLabel: 'Não',
    noDodgeMessages: [
      'Tem certeza? 🥺',
      'Pensa com carinho...',
      'Essa opção tá com defeito 😂',
      'Olha o outro botão ali! 💗',
      'Vai ser legal, prometo!',
      'Você não vai me deixar nessa, né? 👀',
      'Esse botão não funciona hoje 😅',
      'Já tentou o “sim”? Ele tá bem ali! ✨',
      'O destino já decidiu por nós. 💫',
      'Não vale insistir, viu? 😌',
    ],

    declineEyebrow: 'Tudo certo',
    declineTitle: 'Tudo bem, de verdade.',
    declineTitleAccent: 'de verdade',
    declineText:
      'Obrigado por responder com sinceridade. O convite fica aqui, guardado com carinho — sem cobrança, sem pressa.',
    declineNote: 'Se um dia quiser, é só aparecer. 💗',
    declineCta: 'Voltar ao convite',

    celebrationEyebrow: 'Capítulo dois · o sim',
    celebrationSuspense: 'Pera aí...',
    celebrationTitle: 'VOCÊ DISSE SIM?!',
    celebrationTitleAccent: 'SIM',
    celebrationMessage: 'Você acabou de deixar meu dia muito mais bonito. 💗',
    celebrationSubmessage:
      'Agora só falta a gente decidir como vai ser nosso primeiro date.',
    celebrationCta: 'Vamos escolher nosso date',

    chooseEyebrow: 'Capítulo dois · o programa',
    chooseTitle: 'Como você imagina nosso date?',
    chooseTitleAccent: 'nosso date',
    chooseLead:
      'Escolhe a ideia que mais combina com a gente. Se nenhuma for a sua cara, inventa uma — eu topo.',
    chooseContinue: 'Escolher o dia',
    chooseCustomLabel: 'Conta pra mim o que você gostaria de fazer',
    chooseCustomPlaceholder:
      'Ex.: um piquenique no fim da tarde, ver o pôr do sol...',
    chooseCustomError: 'Me conta a sua ideia pra eu poder planejar. 💗',
    chooseErrorOption: 'Escolhe uma das ideias — ou inventa a sua. 💗',
    chooseNote:
      'Pode mudar de ideia depois. Isso aqui é sobre a gente, não sobre acertar.',

    scheduleEyebrow: 'Capítulo três · o dia',
    scheduleTitle: 'Agora vamos escolher nosso dia especial?',
    scheduleTitleAccent: 'dia especial',
    scheduleLead:
      'Escolhe um dia que fique bom pra você. Se preferir, a gente combina pelo WhatsApp.',
    scheduleModeDate: 'Escolher um dia',
    scheduleModeDateHint: 'Um dia e um horário pra gente guardar.',
    scheduleModeLater: 'Combinar depois',
    scheduleModeLaterHint: 'A gente acerta os detalhes no WhatsApp.',
    scheduleLaterTitle: 'Deixa que a gente combina com calma.',
    scheduleLaterText:
      'Sem problema nenhum. Depois você me chama pelo WhatsApp e a gente encontra um dia que fique bom pra nós dois.',
    scheduleDateLabel: 'O dia',
    scheduleTimeLabel: 'O horário',
    scheduleTimeHint:
      'Escolhe o horário que fica melhor pra você. A gente ajusta se precisar.',
    scheduleNotesLabel: 'Alguma observação? (opcional)',
    scheduleNotesPlaceholder:
      'Algo que você queira me contar, um lugar que ama, uma restrição...',
    scheduleContinue: 'Ver nosso resumo',
    scheduleBack: 'Voltar',
    scheduleErrorDate:
      'Escolhe um dia no calendário — ou marca “combinar depois”.',
    scheduleErrorTime: 'Escolhe um horário pra eu me organizar. 💗',
    scheduleSavedNote: 'Suas escolhas ficam salvas só neste dispositivo.',

    summaryEyebrow: 'Quase lá',
    summaryTitle: 'Nosso date está quase marcado!',
    summaryTitleAccent: 'quase marcado',
    summaryLead: 'Dá uma olhada se ficou do jeito que você imaginou.',
    summaryProgram: 'Programa',
    summaryDate: 'Data',
    summaryTime: 'Horário',
    summaryNotes: 'Observações',
    summaryNone: 'Nenhuma observação.',
    summaryCustomIdea: 'Sua ideia',
    summaryToCombine: 'A combinar',
    summaryToCombineNote: 'A gente acerta pelo WhatsApp 💬',
    summaryConfirm: 'Confirmar nosso date',
    summaryNote:
      'Depois de confirmar, você pode me mandar tudo pelo WhatsApp. Nada é enviado sem você.',
    summaryEdit: 'Alterar',
    summaryBack: 'Voltar ao dia',

    finaleEyebrow: 'Combinado',
    finaleTitle: 'Então tá combinado!',
    finaleTitleAccent: 'combinado',
    finaleMessage:
      'Agora tenho mais um motivo pra ficar esperando ansiosamente pelo nosso encontro.',
    finaleSubmessage:
      'Prometo fazer desse dia uma lembrança especial. ✨',
    finalePsLabel: 'P.S.',
    finalePs:
      'Escolhi você pra dividir um dia comum e transformá-lo em lembrança. Obrigado por dizer sim.',
    finaleSignature: 'com carinho, {remetente}',
    finaleWhatsApp: 'Enviar no WhatsApp',
    finaleWhatsAppHint:
      'O WhatsApp vai abrir com a mensagem pronta. É só escolher o contato e confirmar o envio por lá. 💗',
    finaleGoogle: 'Adicionar ao Google Calendar',
    finaleIcs: 'Baixar evento (.ics)',
    finaleCalendarHint: 'Quer guardar esse dia? Ele fica salvo no seu calendário.',
    finaleNoDateTitle: 'Ainda vamos escolher o dia',
    finaleNoDateText:
      'Quando a gente combinar, você pode voltar aqui e salvar no calendário.',
    finaleEdit: 'Rever nosso date',
    finaleRestart: 'Recomeçar a experiência',
    countdownLabel: 'Contagem regressiva',
    countdownDays: 'dias',
    countdownHours: 'horas',
    countdownMinutes: 'min',
    countdownToday: 'É hoje! 💗',
    countdownPast: 'Esse dia já virou lembrança. 💗',

    footerNote: 'Feito à mão, só entre nós.',
    restartTitle: 'Apagar e recomeçar?',
    restartText:
      'As escolhas salvas neste dispositivo serão apagadas. Você pode começar do zero quando quiser.',
    restartConfirm: 'Recomeçar',
    restartCancel: 'Continuar aqui',

    musicInvite: 'Quer deixar esse momento ainda mais especial?',
    musicActivate: 'Ativar música',
    musicPause: 'Pausar música',
    musicPlaying: 'Tocando agora',
    musicLabel: 'Música',
    musicVolume: 'Volume da música',
    musicUnavailable:
      'A trilha não carregou, mas o convite continua te esperando. 💗',

    secretHint: 'Um segredinho...',
    secretNote: 'Você é a minha parte favorita do dia. 🤍',
    secretClose: 'guardar segredo',

    whatsappGreeting: 'Oiê! 💗',
    whatsappIntro: 'Então... eu aceitei sair com você! 🥹💕',
    whatsappProgramLabel: 'Programa',
    whatsappDateLabel: 'Data',
    whatsappTimeLabel: 'Horário',
    whatsappNotesLabel: 'Observações',
    whatsappCustomLabel: 'Minha ideia',
    whatsappToCombine: 'A combinar pelo WhatsApp 💬',
    whatsappClosing: 'Agora é só a gente combinar os detalhes! 💖',

    notFoundTitle: 'Essa página se perdeu no caminho.',
    notFoundText:
      'Mas o convite continua aqui, guardado com carinho. Que tal voltar?',
    notFoundCta: 'Voltar ao convite',
  },

  theme: {
    paper: '#FBF5EE',
    paperDeep: '#F3E6DD',
    paperSoft: '#FFFBF6',
    cream: '#FFF9F1',
    ink: '#3C2931',
    inkSoft: '#705A63',
    blush: '#F6E4E2',
    rose: '#B56A75',
    roseDeep: '#8B4552',
    red: '#A63D4C',
    lavender: '#E9E2EF',
    lavenderDeep: '#88789A',
    gold: '#B49363',
  },

  dateOptions: [
    {
      id: 'cinema',
      icon: 'film',
      emoji: '🍿',
      title: 'Cinema',
      description: 'Um filminho, uma pipoca e uma ótima companhia.',
      accent: '#7D6B8F',
    },
    {
      id: 'jantar',
      icon: 'dinner',
      emoji: '🍝',
      title: 'Jantar romântico',
      description: 'Uma comida gostosa e horas de conversa.',
      accent: '#A9535F',
    },
    {
      id: 'sorvete',
      icon: 'dessert',
      emoji: '🍨',
      title: 'Sorvete ou açaí',
      description: 'Um encontro leve, doce e cheio de risadas.',
      accent: '#B47A68',
    },
    {
      id: 'cafe',
      icon: 'coffee',
      emoji: '☕',
      title: 'Café',
      description:
        'Um café, uma conversa e a oportunidade de nos conhecermos melhor.',
      accent: '#8A6650',
    },
    {
      id: 'surpresa',
      icon: 'surprise',
      emoji: '✨',
      title: 'Passeio surpresa',
      description: 'Você confia em mim pra escolher um lugar especial?',
      accent: '#A98950',
    },
    {
      id: 'escolha-dela',
      icon: 'custom',
      emoji: '💕',
      title: 'Você escolhe',
      description: 'Me conta o que você gostaria de fazer!',
      accent: '#9A6577',
    },
  ],

  schedule: {
    timeSlots: [
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
      '20:30',
      '21:00',
      '21:30',
    ],
    defaultTime: '19:30',
    maxMonthsAhead: 18,
  },

  music: {
    enabled: true,
    src: '/audio/romantic-loop.mp3',
    title: 'Nosso compasso',
    artist: 'trilha original',
    volume: 0.35,
  },

  calendar: {
    title: 'Nosso primeiro date 💗',
    description: 'Um dia escolhido a dois, com carinho.',
    defaultDurationMinutes: 120,
    timeZone: 'America/Sao_Paulo',
    location: '',
  },

  celebration: {
    suspenseMs: 1500,
    revealMs: 1200,
    confettiPieces: 100,
  },
}

export const customOptionId = 'escolha-dela'
