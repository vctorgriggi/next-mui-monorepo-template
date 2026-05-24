import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Link, { type LinkProps } from '@mui/material/Link';
import NextLink from 'next/link';

interface ArrowBackLinkProps extends Omit<LinkProps, 'href'> {
  label: string;
  href: string;
}

/**
 * Inline "← back to X" link, used at the top of detail pages.
 *
 * Pair with the page header below it, e.g.:
 *   <ArrowBackLink label="Users" href={APP_ROUTES.private.users} />
 *   <Typography variant="h6">Edit user</Typography>
 */
export default function ArrowBackLink({
  label,
  href,
  ...props
}: ArrowBackLinkProps) {
  return (
    <Link
      sx={{ display: 'inline-flex', alignItems: 'center', mb: 1 }}
      component={NextLink}
      href={href}
      underline="hover"
      variant="body2"
      {...props}
    >
      <ArrowBackRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
      {label}
    </Link>
  );
}
