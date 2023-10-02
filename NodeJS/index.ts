import './service/cloud';
import { me } from './extensions/me';
import { claps } from './extensions/claps';
import { likes } from './extensions/likes';
import { loginByToken } from './extensions/loginByToken';
import { disableGraphQLFields } from './utils/disableGraphQLFields';
import { meUpdate } from './extensions/meUpdate';
import { article } from './extensions/article';
import { addIndexByArticleLink } from './extensions/article/addIndexByArticleLink';
import { user } from './extensions/users-permissions/user';

export default {
  register(/*{ strapi }*/) {
    const extensionService = strapi.service('plugin::graphql.extension');

    disableGraphQLFields(extensionService);

    extensionService.use(claps);
    extensionService.use(likes);
    extensionService.use(me);
    extensionService.use(loginByToken);
    extensionService.use(meUpdate);
    extensionService.use(article);
    extensionService.use(user);
  },

  async bootstrap(/*{ strapi }*/) {
    const extensionService = strapi.service('plugin::graphql.extension');

    disableGraphQLFields(extensionService);

    await addIndexByArticleLink();
  },
};
