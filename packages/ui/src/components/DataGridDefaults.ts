import type { DataGridProps } from '@mui/x-data-grid';

const getRowClassName: DataGridProps['getRowClassName'] = (params) =>
  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';

export const DATA_GRID_DEFAULTS = {
  disableRowSelectionOnClick: true,
  disableColumnResize: true,
  getRowClassName,
  slotProps: {
    loadingOverlay: {
      variant: 'circular-progress' as const,
      noRowsVariant: 'circular-progress' as const,
    },
  },
} satisfies Partial<DataGridProps>;

export const FILTER_PANEL_SLOT_PROPS = {
  filterPanel: {
    filterFormProps: {
      logicOperatorInputProps: {
        variant: 'outlined' as const,
        size: 'small' as const,
      },
      columnInputProps: {
        variant: 'outlined' as const,
        size: 'small' as const,
        sx: { mt: 'auto' },
      },
      operatorInputProps: {
        variant: 'outlined' as const,
        size: 'small' as const,
        sx: { mt: 'auto' },
      },
      valueInputProps: {
        InputComponentProps: {
          variant: 'outlined' as const,
          size: 'small' as const,
        },
      },
    },
  },
} as const;
