'use client';

import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTE_LABELS } from '@/constants/app-routes';

import { useBreadcrumbItems } from './BreadcrumbContext';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

function crumbsFromPathname(
  pathname: string,
): { label: string; href: string }[] {
  return pathname
    .split('/')
    .filter(Boolean)
    .reduce<{ label: string; href: string }[]>((acc, _, index, segments) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = ROUTE_LABELS[href];
      if (label) acc.push({ label, href });
      return acc;
    }, []);
}

export default function NavbarBreadcrumbs() {
  const pathname = usePathname();
  const contextItems = useBreadcrumbItems();

  const crumbs =
    contextItems.length > 0 ? contextItems : crumbsFromPathname(pathname);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {crumbs.map((crumb, index) => {
        const last = index === crumbs.length - 1;
        const loading = !crumb.label;

        if (loading) {
          return (
            <Skeleton
              key={crumb.href}
              variant="text"
              width={80}
              sx={{ fontSize: '1rem' }}
            />
          );
        }

        if (last) {
          return (
            <Typography
              key={crumb.href}
              variant="body1"
              sx={{ color: 'text.primary', fontWeight: 600 }}
            >
              {crumb.label}
            </Typography>
          );
        }

        return (
          <MuiLink
            key={crumb.href}
            component={Link}
            href={crumb.href}
            variant="body1"
            underline="hover"
            sx={{ color: 'text.secondary' }}
          >
            {crumb.label}
          </MuiLink>
        );
      })}
    </StyledBreadcrumbs>
  );
}
