import { ROLES } from '../types';

export default (policyContext, config, { strapi }) => {
  if (policyContext.state.isAuthenticated) {
    const userRole = policyContext.state.user?.role.name;
    if (userRole === ROLES.ADMIN) {
      return true;
    }
  }

  return false;
};
