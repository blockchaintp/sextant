import * as React from 'react'
import { makeStyles, withStyles } from '@mui/styles';

import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'

import { OverridableStringUnion } from "@mui/types";
import { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import { Variant } from "@mui/material/styles/createTypography";

type TitleVariant = OverridableStringUnion<"inherit" | Variant, TypographyPropsVariantOverrides>;

const useStyles = makeStyles((theme: Theme) => ({
  toolbarRoot: {
    paddingRight: theme.spacing(1),
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'flex-end',
  },
  title: {
    // flex: '0 0 auto',
  },
}))

type SimpleTableHeaderProps = {
  className: string,
  title: string,
  getTitle: Function,
  getActions: () => React.ReactNode,
  titleVariant: TitleVariant,
  titleClassname: string,
}

const SimpleTableHeader: React.FC<SimpleTableHeaderProps> = (props) => {
  const classes = useStyles()
  const { className, titleClassname, titleVariant, title, getTitle, getActions } = props
  const useClassname = `${classes.toolbarRoot} ${className || ''}`

  return (
    <Toolbar
      className={useClassname}
    >
      <div className={classes.title}>
        {
          getTitle ? (
            getTitle()
          ) : (
            <Typography noWrap className={titleClassname} variant={titleVariant || 'h6'}>{ title }</Typography>
          )
        }
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {
          getActions ? getActions() : null
        }
      </div>
    </Toolbar>
  )
}

export default SimpleTableHeader
