import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'file-manip-bucket',
  access: (allow) => ({
    'psersonal-files/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
});
