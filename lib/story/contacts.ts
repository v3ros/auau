export type ContactId = 'natasya' | 'alex' | 'angel'

export const OWNER = {
  friendListName: 'Veros',
  status: 'Available',
  photo: undefined,
}

export const contacts: Record<ContactId, { name: string; initial: string; color: string; photo?: string }> = {
  natasya: {
    name: "natasya'sysy",
    initial: 'N',
    color: '#1d9bf0',
  },
  alex: {
    name: 'Alex Rivera',
    initial: 'A',
    color: '#10b981',
  },
  angel: {
    name: 'angel cianjur',
    initial: 'S',
    color: '#f59e0b',
  },
}