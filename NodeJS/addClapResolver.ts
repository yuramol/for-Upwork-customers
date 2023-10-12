import { UID } from '../../types';
import { Args } from './types';
import { getUserFromContext } from '../../utils/getUserFromContext';

export const addClapResolver = async (parent, args: Args, context) => {
  const { articleId } = args;
  console.log('debug > articleId ==== ', articleId);
  const { id: userId } = getUserFromContext(context);

  const article = await strapi.db.query(UID.ARTICLE).findOne({
    where: {
      id: articleId,
    },
    populate: {
      clappedUsers: {
        select: ['id'],
        where: {
          id: userId,
        },
      },
    },
  });

  if (!article) {
    return null;
  }

  if (article.clappedUsers.length) {
    return article;
  } else {
    await strapi.db.connection.raw(
      `
    UPDATE articles
    SET claps = COALESCE(claps, 0) + 1
    WHERE id = :articleId`,
      { articleId },
    );

    const clappedArticle = await strapi.entityService.update(UID.ARTICLE, articleId, {
      data: {
        clappedUsers: {
          connect: [userId],
        },
      },
    });

    return clappedArticle;
  }
};
