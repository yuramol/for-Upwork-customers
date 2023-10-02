import { createArticleResolver } from './createArticleResolver';
import { deleteArticleResolver } from './deleteArticleResolver';
import { typeDefs } from './typeDefs';
import { updateArticleResolver } from './updateArticleResolver';
import { incViewsResolver } from './incViews';
import { resolversConfig } from './resolversConfig';
import { articleByLinkResolver } from './articleByLinkResolver';

export const article = () => ({
  typeDefs,
  resolversConfig,
  resolvers: {
    Query: {
      articleByLink: articleByLinkResolver,
    },
    Mutation: {
      createArticle: createArticleResolver,
      updateArticle: updateArticleResolver,
      deleteArticle: deleteArticleResolver,
      incViews: incViewsResolver,
    },
  },
});
