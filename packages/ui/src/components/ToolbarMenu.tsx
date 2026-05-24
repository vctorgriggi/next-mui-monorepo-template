'use client';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export interface ToolbarMenuOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface ToolbarMenuProps<T extends string> {
  icon: React.ReactNode;
  label: string;
  value: T | null;
  options: ToolbarMenuOption<T>[];
  onChange: (value: T | null) => void;
  /** Label for the "clear selection" item. Omit to make the menu non-clearable. */
  clearLabel?: string;
}

export default function ToolbarMenu<T extends string>({
  icon,
  label,
  value,
  options,
  onChange,
  clearLabel,
}: ToolbarMenuProps<T>) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : label;

  const handleSelect = (v: T | null) => {
    onChange(v);
    setAnchor(null);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        startIcon={icon}
        endIcon={<ExpandMoreRoundedIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          textTransform: 'none',
          fontWeight: 400,
          color: 'text.primary',
          '& .MuiButton-startIcon': { mr: 0.75 },
          '& .MuiButton-endIcon': { ml: 0.25 },
        }}
      >
        {displayLabel}
      </Button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 240, maxWidth: 360 } } }}
      >
        {clearLabel && (
          <MenuItem
            selected={value === null}
            onClick={() => handleSelect(null)}
          >
            <ListItemIcon>
              {value === null && <CheckRoundedIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{clearLabel}</ListItemText>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={value === opt.value}
            onClick={() => handleSelect(opt.value)}
            sx={{ alignItems: 'flex-start', py: opt.description ? 1 : 0.75 }}
          >
            <ListItemIcon sx={{ mt: opt.description ? 0.25 : 0 }}>
              {value === opt.value && <CheckRoundedIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText
              primary={opt.label}
              secondary={opt.description}
              slotProps={{
                secondary: {
                  variant: 'caption',
                  sx: { whiteSpace: 'normal', lineHeight: 1.4 },
                },
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
