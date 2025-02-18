/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const utilitiesData = [
  {
    label: 'Internet',
    value: 'wifi',
  },
  {
    label: <FormattedMessage {...messages.washingDrying} />,
    value: 'giat_ui',
  },
  {
    label: <FormattedMessage {...messages.parkingLot} />,
    value: 'giu_xe',
  },
  {
    label: <FormattedMessage {...messages.television} />,
    value: 'truyen_hinh',
  },
  {
    label: <FormattedMessage {...messages.AirConditioner} />,
    value: 'dieu_hoa',
  },
  {
    label: <FormattedMessage {...messages.toiletBowl} />,
    value: 'bon_cau',
  },
  {
    label: <FormattedMessage {...messages.Mezzanine} />,
    value: 'gac_lung',
  },
  {
    label: <FormattedMessage {...messages.washstand} />,
    value: 'bon_rua_mat',
  },
  {
    label: <FormattedMessage {...messages.clearTheRoom} />,
    value: 'don_phong',
  },
  {
    label: <FormattedMessage {...messages.WoodFloor} />,
    value: 'san_go',
  },
  {
    label: <FormattedMessage {...messages.Wardrobe} />,
    value: 'tu_quan_ao',
  },
  {
    label: <FormattedMessage {...messages.shower} />,
    value: 'voi_hoa_sen',
  },
  {
    label: <FormattedMessage {...messages.FreeTime} />,
    value: 'gio_giac_tu_do',
  },
  {
    label: <FormattedMessage {...messages.PrivateEntrance} />,
    value: 'loi_di_rieng',
  },
];
