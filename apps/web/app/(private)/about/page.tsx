import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function AboutPage() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        About
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 720 }}>
        <Typography variant="body1" color="text.secondary">
          This is a Next.js 15 + MUI 6 + Turborepo template. It ships with a
          deeply customized theme, feature-based architecture, server actions
          with typed <code>Result&lt;T&gt;</code> returns, React Query helpers,
          and a sensible RBAC scaffold — without locking you into any backend
          or auth provider.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Replace this page with your own about, changelog, or marketing
          content. The route is open to any authenticated user by default —
          see <code>lib/auth/permissions.ts</code> to wire restrictions.
        </Typography>
      </Stack>
    </Box>
  );
}
