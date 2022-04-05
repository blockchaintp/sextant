import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const listItems = [
  'Uncatetgorized',
];

export default function MultipleSelectCheckmarks() {
  const [checkedItem, setCheckedItem] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCheckedItem(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="filter-label">Filter</InputLabel>
        <Select
          labelId="filter-label"
          id="filter-select"
          multiple
          value={checkedItem}
          onChange={handleChange}
          input={<OutlinedInput label="Filter" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {listItems.map((listItem) => (
            <MenuItem key={listItem} value={listItem}>
              <Checkbox checked={checkedItem.indexOf(listItem) > -1} />
              <ListItemText primary={listItem} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
