import { randomUUID } from 'node:crypto';

export function getMessageConversationSample() {
  return {
    id: randomUUID(),
    type: 'custom',
    tagName: 'message-conversation',
    props: {
      title: 'Conversation entre Naomi et Mickaël à propos d’une adresse mail',
      messages: [
        {
          userName: 'Naomi',
          direction: 'outgoing',
          content: 'Salut, tu peux me redonner ton adresse mail stp ? 😇',
        },
        {
          userName: 'Mickaël',
          direction: 'incoming',
          content: 'Oui, c’est mickael.aubert123#laposte.net',
        },
        {
          userName: 'Naomi',
          direction: 'outgoing',
          content: 'T’es sûr ? 😬',
        },
        {
          userName: 'Naomi',
          direction: 'outgoing',
          content: 'Tu veux dire mickael.aubert123@laposte.net',
        },
        {
          userName: 'Mickaël',
          direction: 'incoming',
          content: 'Ah oui désolé ! 😣',
        },
        {
          userName: 'Mickaël',
          direction: 'incoming',
          content: 'comment tu as su ? ',
        },
        {
          userName: 'Naomi',
          direction: 'outgoing',
          content: 'Dans une adresse mail, il y a toujours le symbole arobase !',
        },
      ],
    },
  };
}
