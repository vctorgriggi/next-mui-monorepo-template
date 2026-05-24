'use client';

import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import * as React from 'react';

import CustomTextField from './CustomTextField';
import { richTextSx } from './richTextStyles';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  onEscape?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  onBlur,
  onEscape,
  placeholder = 'Write here...',
  autoFocus = false,
  minHeight = 120,
  maxHeight = 400,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    autofocus: autoFocus ? 'end' : false,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onBlur: () => onBlur?.(),
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (event.key === 'Escape' && onEscape) {
          event.preventDefault();
          onEscape();
          return true;
        }
        return false;
      },
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return null;

  return (
    <Box
      sx={(theme) => ({
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        '&:focus-within': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.4)}`,
        },
      })}
    >
      <Toolbar editor={editor} />
      <Divider />
      <Box
        sx={(theme) => ({
          minHeight,
          maxHeight,
          overflow: 'auto',
          padding: theme.spacing(1, 1.5),
          '& .ProseMirror': {
            outline: 'none',
            ...theme.typography.body2,
            '& p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              color: theme.palette.text.disabled,
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
            ...richTextSx(theme),
          },
        })}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}

interface ToolButtonProps {
  label: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolButton({
  label,
  shortcut,
  active,
  disabled,
  onClick,
  children,
}: ToolButtonProps) {
  const tooltipLabel = shortcut ? `${label} (${shortcut})` : label;
  return (
    <Tooltip title={tooltipLabel} placement="top">
      <Box
        component="button"
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={active}
        sx={(theme) => ({
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          border: 0,
          borderRadius: 0.75,
          padding: 0,
          cursor: disabled ? 'default' : 'pointer',
          color: disabled
            ? 'action.disabled'
            : active
              ? 'primary.main'
              : 'text.secondary',
          bgcolor: active
            ? alpha(theme.palette.primary.main, 0.12)
            : 'transparent',
          transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            bgcolor: disabled
              ? 'transparent'
              : active
                ? alpha(theme.palette.primary.main, 0.18)
                : 'action.hover',
          },
        })}
      >
        {children}
      </Box>
    </Tooltip>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const [linkDialog, setLinkDialog] = React.useState<{
    open: boolean;
    initialUrl: string;
  }>({ open: false, initialUrl: '' });

  function openLink() {
    const previous = (editor.getAttributes('link').href as string) ?? '';
    setLinkDialog({ open: true, initialUrl: previous });
  }

  function applyLink(url: string) {
    const trimmed = url.trim();
    if (trimmed === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: trimmed, target: '_blank' })
        .run();
    }
    setLinkDialog({ open: false, initialUrl: '' });
  }

  const ICON = { fontSize: 16 } as const;
  const linkActive = editor.isActive('link');

  return (
    <>
      <Stack
        direction="row"
        spacing={0.25}
        sx={{ alignItems: 'center', flexWrap: 'wrap', p: 0.5, gap: 0.25 }}
      >
        <ToolButton
          label="Heading"
          shortcut="Ctrl+Alt+2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <TitleRoundedIcon sx={ICON} />
        </ToolButton>
        <ToolButton
          label="Subheading"
          shortcut="Ctrl+Alt+3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Box
            component="span"
            sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}
          >
            H3
          </Box>
        </ToolButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />

        <ToolButton
          label="Bold"
          shortcut="Ctrl+B"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBoldRoundedIcon sx={ICON} />
        </ToolButton>
        <ToolButton
          label="Italic"
          shortcut="Ctrl+I"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalicRoundedIcon sx={ICON} />
        </ToolButton>
        <ToolButton
          label="Strikethrough"
          shortcut="Ctrl+Shift+S"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughSRoundedIcon sx={ICON} />
        </ToolButton>
        <ToolButton
          label="Inline code"
          shortcut="Ctrl+E"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeRoundedIcon sx={ICON} />
        </ToolButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />

        <ToolButton
          label="Bulleted list"
          shortcut="Ctrl+Shift+8"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedRoundedIcon sx={ICON} />
        </ToolButton>
        <ToolButton
          label="Numbered list"
          shortcut="Ctrl+Shift+7"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedRoundedIcon sx={ICON} />
        </ToolButton>
        <ToolButton
          label="Blockquote"
          shortcut="Ctrl+Shift+B"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FormatQuoteRoundedIcon sx={ICON} />
        </ToolButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />

        <ToolButton
          label={linkActive ? 'Edit link' : 'Insert link'}
          active={linkActive}
          onClick={openLink}
        >
          <LinkRoundedIcon sx={ICON} />
        </ToolButton>
      </Stack>

      <LinkDialog
        open={linkDialog.open}
        initialUrl={linkDialog.initialUrl}
        onClose={() => setLinkDialog({ open: false, initialUrl: '' })}
        onConfirm={applyLink}
      />
    </>
  );
}

interface LinkDialogProps {
  open: boolean;
  initialUrl: string;
  onClose: () => void;
  onConfirm: (url: string) => void;
}

function LinkDialog({ open, initialUrl, onClose, onConfirm }: LinkDialogProps) {
  const [value, setValue] = React.useState(initialUrl);

  // Sync with initialUrl when the dialog reopens for another link.
  React.useEffect(() => {
    if (open) setValue(initialUrl);
  }, [open, initialUrl]);

  const isEditing = initialUrl !== '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm(value);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEnforceFocus
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Edit link' : 'Insert link'}</DialogTitle>
        <DialogContent>
          <CustomTextField
            autoFocus
            placeholder="https://..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            type="url"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          {isEditing && (
            <Button color="error" onClick={() => onConfirm('')}>
              Remover
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={!value.trim()}>
            {isEditing ? 'Save' : 'Insert'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
