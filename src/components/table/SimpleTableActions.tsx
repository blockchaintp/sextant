import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@mui/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const styles = createStyles({
  root: {
    whiteSpace: 'nowrap',
  },
});

type Action = {
  shouldDisplay?: (item: boolean) => boolean;
  getIcon?: (item: string) => React.ElementType;
  icon?: React.ElementType;
  getTitle?: (item: string) => string;
  title?: string;
  disabled?: boolean;
  handler?: Function;
  style?: React.CSSProperties;
  wrapButton?: (button: React.ReactNode, item: any) => React.ReactNode;
}

interface Props extends WithStyles<typeof styles> {
  item: any;
  actions: Action[];
}

interface CIIconButtonProps extends IconButtonProps {
  _ci?: string
}

const CIIconButton = ({ _ci, ...rest }: CIIconButtonProps) => {
  return <IconButton {...rest} />;
}

const SimpleTableActions: React.FC<Props> = ({ classes, item, actions }) => {
  return (
    <div className={classes.root}>
      {actions
        .filter((action) => {
          if (action.shouldDisplay) return action.shouldDisplay(item);
          return true;
        })
        .map((action, i) => {
          const IconClass = action.getIcon ? action.getIcon(item) : action.icon;
          const title = action.getTitle ? action.getTitle(item) : action.title;
          const visibility = action.disabled ? action.disabled : false;

          const button = (
            <CIIconButton
              _ci={`${item.username || item.name}${title}`}
              id={`action_${item.username || item.name}${title}`}
              onClick={(event) => {
                event.stopPropagation();
                if (action.handler) {
                  action.handler(item);
                }
              }}
              disabled={visibility}
              style={action.style}
              size="large"
            >
              <IconClass />
            </CIIconButton>
          );

          const renderButton = (
            <>
              {action.wrapButton ? action.wrapButton(button, item) : button}
            </>
          );
          return (
            <Tooltip disableFocusListener key={`${title}-${i}`} title={title}>
              {renderButton}
            </Tooltip>
          );
        })}
    </div>
  );
};

export default withStyles(styles)(SimpleTableActions);
