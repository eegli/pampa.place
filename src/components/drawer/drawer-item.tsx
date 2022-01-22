import {ListItem, ListItemText} from '@mui/material';

type ListItemProps = {
  primarText: string;
  secondaryText?: string;
  onClick?: () => void;
  isButton?: boolean;
};

export const CustomListItem = ({
  primarText,
  secondaryText,
  onClick,
}: ListItemProps) => {
  return (
    <ListItem button key={primarText} onClick={onClick} id={primarText}>
      <ListItemText primary={primarText} secondary={secondaryText} />
    </ListItem>
  );
};
