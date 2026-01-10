import React from 'react';
import { TableDropDown } from './TableDropDown';

type ShipDropDownProps = {
  value?: string;
  onSelect?: (code: string, name: string) => void;
};

export const ShipPortsDropDown: React.FC<ShipDropDownProps> = ({ value, onSelect }) => (
  <TableDropDown
    csvPath="/csv/CNIA_SHIP_PORTS.txt"
    columns={2}
    value={value}
    onSelect={onSelect}
  />
);

export const ShipTypesDropDown: React.FC<ShipDropDownProps> = ({ value, onSelect }) => (
  <TableDropDown
    csvPath="/csv/CNIA_SHIP_TYPES.txt"
    columns={2}
    value={value}
    onSelect={onSelect}
  />
);

export const ShipLocationsDropDown: React.FC<ShipDropDownProps> = ({ value, onSelect }) => (
  <TableDropDown
    csvPath="/csv/CNIA_SHIP_LOCATIONS.txt"
    columns={2}
    value={value}
    onSelect={onSelect}
  />
);
