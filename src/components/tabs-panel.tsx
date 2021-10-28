import { Box, BoxProps } from '@mui/material';

interface TabPanelProps extends BoxProps {
  children?: React.ReactNode;
  index: number;
  selected: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, selected, index, ...rest } = props;
  const shouldDisplay = selected === index;
  if (shouldDisplay) {
    return (
      <Box
        height="100%"
        width="100%"
        id={`tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...rest}
      >
        {children}
      </Box>
    );
  }
  return <div />;
};

export default TabPanel;
