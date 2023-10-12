import { UID } from '../../types';
import { Args } from './types';
import { getUserFromContext } from '../../utils/getUserFromContext';

export const addLikeResolver = async (parent, args: Args, context) => {
  const { articleId } = args;

  const { id: userId } = getUserFromContext(context);

  const article = await strapi.db.query(UID.ARTICLE).findOne({
    where: {
      id: articleId,
    },
    populate: {
      likedUsers: {
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

  if (article.likedUsers.length) {
    return article;
  } else {
    await strapi.db.connection.raw(
      `
    UPDATE articles
    SET likes = COALESCE(likes, 0) + 1
    WHERE id = :articleId`,
      { articleId },
    );

    const likedArticle = await strapi.entityService.update(UID.ARTICLE, articleId, {
      data: {
        likedUsers: {
          connect: [userId],
        },
      },
    });

    return likedArticle;
  }
};
