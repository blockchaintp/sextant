import * as React from 'react';
import { styled } from '@mui/system';
import ButtonBase from '@mui/material/ButtonBase'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface HorizontalCardProps {
  optionIcon: string,
  optionTitle: string,
  optionVersion: string,
  versionSummary: string,
  onClick: (version: string) => void,
}

const StyledCard = styled(Card)({
  display: 'flex',
})

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flex: '1 0 auto',
  alignItems: 'flex-start',
  flexDirection: 'column',
})

const StyledIconImg = styled('img')({
  width: 100,
})

const HorizontalCard: React.FC<HorizontalCardProps> = ({
  optionIcon,
  optionTitle,
  optionVersion,
  versionSummary,
  onClick,
}) => {

  return (
    <StyledCard>
      <ButtonBase
        onClick={() => onClick(optionVersion)}
      >
        <CardContent>
          <StyledIconImg src={optionIcon} alt="" />
        </CardContent>
        <div>
          <StyledCardContent>
            <Typography component="h5" variant="h5">
              {optionTitle}
            </Typography>
            <Typography variant="subtitle1" align="left" color="textSecondary">
              {optionVersion}
            </Typography>
            <Typography align="left">
              {versionSummary}
            </Typography>
          </StyledCardContent>
        </div>
      </ButtonBase>
    </StyledCard>
  );
}

export default HorizontalCard
