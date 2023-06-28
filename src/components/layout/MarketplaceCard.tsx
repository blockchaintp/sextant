import * as React from 'react'
import { styled } from '@mui/system'
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Typography,
} from '@mui/material'
import { CardActionAreaProps } from '@mui/material/CardActionArea'

type MarketplaceCardProps = {
  optionIcon: string
  optionTitle: string
  optionVersion: string
  versionSummary: string
  onClick: (version: string) => void
}

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  width: '100%',
  alignItems: 'flex-start',
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
}))

const StyledCardActionArea = styled(CardActionArea)({
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
})

interface CICardActionAreaProps extends CardActionAreaProps {
  _ci?: string
}

const CICardActionArea = ({ _ci, ...rest }: CICardActionAreaProps) => {
  return <StyledCardActionArea {...rest} />;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  optionIcon,
  optionTitle,
  optionVersion,
  versionSummary,
  onClick,
}) => {

  return (
    <Card variant="outlined">
      <CICardActionArea
        id={optionTitle.replace(/\s+/g, '')}
        onClick={() => onClick(optionVersion)}
      >
        <StyledCardHeader
          avatar={(
            <Avatar
              alt={optionTitle}
              src={optionIcon}
              aria-label="logo"
              variant="square"
              imgProps={{
                sx: {
                  objectFit: 'contain',
                },
              }}
            />
          )}
          title={optionTitle}
          subheader={optionVersion}
        />
        <CardContent>
          <Typography align="left" variant="body2" sx={{ color: 'text.secondary' }}>
            {versionSummary}
          </Typography>
        </CardContent>
      </CICardActionArea>
    </Card>
  );
}

export default MarketplaceCard
