import { UID } from '../types';

enum DisableFieldType {
  full,
  input,
  output,
  filters,
}
enum DisableActionType {
  create = 'create',
  update = 'update',
  delete = 'delete',
}

const disableFields = {
  [UID.USER]: {
    disableActions: [DisableActionType.delete],
    disableFields: {
      role: [DisableFieldType.output, DisableFieldType.input],
      blocked: [DisableFieldType.output, DisableFieldType.input],
      username: [DisableFieldType.output, DisableFieldType.input],
      password: [DisableFieldType.output, DisableFieldType.input],
      provider: [DisableFieldType.output, DisableFieldType.input],
      confirmed: [DisableFieldType.output, DisableFieldType.input],
      resetPasswordToken: [DisableFieldType.output, DisableFieldType.input],
      confirmationToken: [DisableFieldType.output, DisableFieldType.input],
      createdAt: [DisableFieldType.output, DisableFieldType.input],
      updatedAt: [DisableFieldType.output, DisableFieldType.input],
      likedArticles: [DisableFieldType.input, DisableFieldType.output],
      clappedArticles: [DisableFieldType.input, DisableFieldType.output],
    },
  },
  [UID.ARTICLE]: {
    disableFields: {
      likes: [DisableFieldType.input],
      claps: [DisableFieldType.input],
      views: [DisableFieldType.input],
      oldUserId: [DisableFieldType.input, DisableFieldType.output, DisableFieldType.filters],
      oldId: [DisableFieldType.input, DisableFieldType.output, DisableFieldType.filters],
      articleLink: [DisableFieldType.input],
      likedUsers: [DisableFieldType.input, DisableFieldType.output, DisableFieldType.filters],
      clappedUsers: [DisableFieldType.input, DisableFieldType.output, DisableFieldType.filters],
    },
  },
};

export const disableGraphQLFields = extensionService => {
  Object.keys(disableFields).forEach(uidKey => {
    const shadowCRUD = extensionService.shadowCRUD(uidKey);

    if (disableFields[uidKey].disableQueries) {
      shadowCRUD.disableQueries();
    }

    if (disableFields[uidKey].disableActions) {
      shadowCRUD.disableActions(disableFields[uidKey].disableActions);
    }

    if (disableFields[uidKey].disableFields) {
      Object.keys(disableFields[uidKey].disableFields).forEach(fieldKey => {
        disableFields[uidKey].disableFields[fieldKey].forEach(disableType => {
          const field = shadowCRUD.field(fieldKey);
          switch (disableType) {
            case DisableFieldType.full:
              field.disable();
              return;
            case DisableFieldType.input:
              field.disableInput();
              return;
            case DisableFieldType.output:
              field.disableOutput();
              return;
            case DisableFieldType.filters:
              field.disableFilters();
              return;
          }
        });
      });
    }
  });
};
