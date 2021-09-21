import { Box, Slider } from '@mui/material';

const durationSelect = [
  { value: 0, label: 'unlimited' },
  {
    value: 30,
    label: '30s',
  },
  {
    value: 60,
    label: '1m',
  },
  {
    value: 120,
    label: '2m',
  },
];

function valuetext(value: number) {
  return `${value}m`;
}

function valueLabelFormat(value: number) {
  return durationSelect.findIndex(d => d.value === value) + 1;
}

export default function FormDurationSelect() {
  return (
    <Box sx={{ paddingX: 2 }}>
      <Slider
        aria-label='Restricted values'
        defaultValue={60}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay='auto'
        marks={durationSelect}
        onBlur={e => console.log(e)}
      />
    </Box>
  );
}
