const resultIcons = {
  ok: {
    icon: 'checkCircle',
    color: 'green',
  },
  ko: {
    icon: 'cancel',
    color: 'red',
  },
  focusedOut: {
    icon: 'cancel',
    color: 'red',
  },
  aband: {
    icon: 'cancel',
    color: 'grey',
  },
  timedout: {
    icon: 'cancel',
    color: 'red',
  },
};

export default function resultIcon(resultStatus) {
  return resultIcons[resultStatus];
}
