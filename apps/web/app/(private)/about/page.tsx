import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ClickableCard from '@/components/ClickableCard';

/**
 * Replace this constant with your own repo URL when you fork.
 * Used to point documentation cards at the markdown sources on GitHub.
 */
const REPO_URL = 'https://github.com/your-org/your-repo';
const DOCS_BASE_URL = `${REPO_URL}/blob/main/docs`;

interface Tile {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

const highlights: Tile[] = [
  {
    title: 'Feature-based',
    description:
      'Every domain owns its actions, hooks, query keys, schemas, and types — in the same file layout, every time.',
    icon: <CategoryRoundedIcon fontSize="small" />,
  },
  {
    title: 'Result<T> over throws',
    description:
      'Server actions return typed { success, data } | { success, error }. No opaque errors crossing the wire.',
    icon: <VerifiedRoundedIcon fontSize="small" />,
  },
  {
    title: 'Client-side RBAC',
    description:
      'admin / editor / viewer / user with a RolesProvider adapter. Plug Supabase, NextAuth, or custom JWT in minutes.',
    icon: <ShieldRoundedIcon fontSize="small" />,
  },
  {
    title: 'Customized MUI theme',
    description:
      'Five color scales, dark/light/system mode, and wrapper components (CustomTextField, FormGrid, FilterCard).',
    icon: <PaletteRoundedIcon fontSize="small" />,
  },
];

const docs: Tile[] = [
  {
    title: 'Conventions',
    description: 'Feature folders, Result<T>, React Query helpers, validation.',
    icon: <MenuBookRoundedIcon fontSize="small" />,
    href: `${DOCS_BASE_URL}/conventions.md`,
  },
  {
    title: 'Design Patterns',
    description: 'Palette, spacing, page anatomy, components, CRUD flows.',
    icon: <PaletteRoundedIcon fontSize="small" />,
    href: `${DOCS_BASE_URL}/design-patterns.md`,
  },
  {
    title: 'Access Control',
    description: 'RBAC matrix and adapter examples for Supabase / NextAuth.',
    icon: <SecurityRoundedIcon fontSize="small" />,
    href: `${DOCS_BASE_URL}/access-control.md`,
  },
  {
    title: 'Environments',
    description: 'Local, preview, production. Vercel + env var patterns.',
    icon: <CloudRoundedIcon fontSize="small" />,
    href: `${DOCS_BASE_URL}/environments.md`,
  },
  {
    title: 'Tech Stack',
    description: 'Why each library is in the template, and what isn’t.',
    icon: <LayersRoundedIcon fontSize="small" />,
    href: `${DOCS_BASE_URL}/tech-stack.md`,
  },
  {
    title: 'Git Workflow',
    description: 'Branch model, PR conventions, CI, hotfixes.',
    icon: <AccountTreeRoundedIcon fontSize="small" />,
    href: `${DOCS_BASE_URL}/git-workflow.md`,
  },
];

/**
 * Neutral icon tile used inside every card on this page. Same surface
 * as `action.hover` so colored backgrounds don't decorate informational
 * content — the icon does enough work on its own.
 */
function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 1,
        bgcolor: 'action.hover',
        color: 'text.secondary',
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

function TileBody({ title, description }: { title: string; description: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Stack>
  );
}

export default function AboutPage() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        About
      </Typography>

      {/* Hero — sits at the top of the page like a subtitle, no card wrapper */}
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        An opinionated starter for building MUI-based dashboards. Ships with a
        feature-based architecture, typed server actions, React Query helpers,
        and a client-side RBAC scaffold — without locking you into any backend
        or auth provider.
      </Typography>

      {/* What's inside */}
      <Typography component="h3" variant="subtitle2" sx={{ mb: 2 }}>
        What&apos;s inside
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {highlights.map((h) => (
          <Grid key={h.title} size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <IconTile>{h.icon}</IconTile>
                  <TileBody title={h.title} description={h.description} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Documentation */}
      <Typography component="h3" variant="subtitle2" sx={{ mb: 2 }}>
        Documentation
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {docs.map((doc) => (
          <Grid key={doc.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <ClickableCard href={doc.href} external>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                  sx={{ pr: 3 }}
                >
                  <IconTile>{doc.icon}</IconTile>
                  <TileBody
                    title={doc.title}
                    description={doc.description}
                  />
                </Stack>
              </CardContent>
            </ClickableCard>
          </Grid>
        ))}
      </Grid>

      {/* Resources */}
      <Typography component="h3" variant="subtitle2" sx={{ mb: 2 }}>
        Resources
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ClickableCard href={REPO_URL} external>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ pr: 3 }}>
                <IconTile>
                  <AccountTreeRoundedIcon fontSize="small" />
                </IconTile>
                <TileBody
                  title="Source on GitHub"
                  description="Issues, releases, and contribution guide."
                />
              </Stack>
            </CardContent>
          </ClickableCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <IconTile>
                  <GavelRoundedIcon fontSize="small" />
                </IconTile>
                <TileBody
                  title="MIT License"
                  description="Use it however you want, commercially or not."
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
