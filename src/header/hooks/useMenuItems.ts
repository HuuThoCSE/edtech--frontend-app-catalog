import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { ROUTES } from '@src/routes';
import { programsUrl } from '@src/utils';
import type { AppContextTypes, MenuItem } from '../types';
import messages from '../messages';

/**
 * Adds the LMS theme's home/about/contact navigation to Catalog's header,
 * while preserving the stock header's login, signup and user menus.
 */
export const useMenuItems = () => {
  const intl = useIntl();
  const location = useLocation();
  const { authenticatedUser } = useContext(AppContext) as AppContextTypes;
  const lmsBaseUrl = String(getConfig().LMS_BASE_URL || 'http://local.openedx.io:8000').replace(/\/$/, '');
  const canExplore = Boolean(getConfig().ENABLE_COURSE_DISCOVERY) && !getConfig().NON_BROWSABLE_COURSES;

  const mainMenu: MenuItem[] = [
    { type: 'item', href: `${lmsBaseUrl}/`, content: 'Trang chủ', isActive: location.pathname === ROUTES.HOME },
    ...(canExplore ? [{ type: 'item' as const, href: `${lmsBaseUrl}/courses`, content: 'Khám phá khóa học', isActive: location.pathname === ROUTES.COURSES }] : []),
    { type: 'item', href: `${lmsBaseUrl}/about`, content: 'Giới thiệu' },
    { type: 'item', href: `${lmsBaseUrl}/contact`, content: 'Liên hệ' },
    ...(authenticatedUser ? [{ type: 'item' as const, href: `${lmsBaseUrl}/dashboard`, content: 'Khóa học của tôi' }] : []),
    ...(authenticatedUser && getConfig().ENABLE_PROGRAMS ? [{ type: 'item' as const, href: programsUrl(), content: intl.formatMessage(messages.programs) }] : []),
  ];

  const secondaryMenu: MenuItem[] = getConfig().SUPPORT_URL ? [{
    type: 'item',
    href: String(getConfig().SUPPORT_URL),
    content: intl.formatMessage(messages.help),
  }] : [];

  return { mainMenu, secondaryMenu };
};
