'use client';

import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { APP_ROUTES, ROUTE_LABELS } from '@/constants/app-routes';
import { hasAccess } from '@/lib/auth/permissions';
import { useRoles } from '@/providers/RolesProvider';

interface MenuSection {
  key: string;
  title: string;
  items: { icon: React.ReactNode; href: string }[];
}

const sections: MenuSection[] = [
  {
    key: 'home',
    title: 'Home',
    items: [{ icon: <HomeRoundedIcon />, href: APP_ROUTES.private.dashboard }],
  },
  {
    key: 'management',
    title: 'Management',
    items: [{ icon: <PeopleRoundedIcon />, href: APP_ROUTES.private.users }],
  },
];

interface BottomLink {
  text: string;
  icon: React.ReactNode;
  href: string;
  external?: boolean;
}

const REPORT_URL =
  'https://github.com/vctorgriggi/next-mui-monorepo-template/issues/new';

const bottomLinks: BottomLink[] = [
  { text: 'About', icon: <InfoRoundedIcon />, href: APP_ROUTES.private.about },
  {
    text: 'Report issue',
    icon: <BugReportRoundedIcon />,
    href: REPORT_URL,
    external: true,
  },
];

export default function MenuContent() {
  const pathname = usePathname();
  const roles = useRoles();

  const visibleSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasAccess(item.href, roles)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {visibleSections.map((section, sectionIndex) => (
          <div key={section.key}>
            <ListSubheader
              sx={{
                fontSize: 12,
                fontWeight: 600,
                px: 1.5,
                py: 0,
                lineHeight: '36px',
                ...(sectionIndex > 0 && { mt: 2 }),
              }}
            >
              {section.title}
            </ListSubheader>

            {section.items.map((item) => (
              <ListItem
                key={item.href}
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  selected={pathname.startsWith(item.href)}
                  component={Link}
                  href={item.href}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={ROUTE_LABELS[item.href]} />
                </ListItemButton>
              </ListItem>
            ))}
          </div>
        ))}
      </List>

      <List dense>
        {bottomLinks.map((item) => {
          const linkProps = item.external
            ? {
                component: 'a' as const,
                href: item.href,
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {
                component: Link,
                href: item.href,
              };
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={!item.external && pathname.startsWith(item.href)}
                {...linkProps}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}
