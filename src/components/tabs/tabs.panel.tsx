import { Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  selected: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, selected, index } = props;
  const shouldDisplay = selected === index;
  if (shouldDisplay) {
    return (
      <Box
        height="100%"
        width="100%"
        id={`tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {children}
      </Box>
    );
  }
  return <div />;
};

export default TabPanel;
