import type {
  RadioGroupProps,
  CheckboxGroupProps,
  InputProps,
  AutocompleteProps,
  InputNumberProps,
  SelectProps,
  CascaderProps,
  SwitchProps,
  SliderProps,
  DatePickerProps,
  RateProps,
  ColorPickerProps,
  TransferProps,
  DividerProps,
  TimeSelectProps,
  SelectV2Props,
  UploadProps,
} from 'element-plus'

export type Recordable<K extends string | number | symbol = string, T = any> = Record<
  K extends null | undefined ? string : K,
  T
>

export enum ComponentNameEnum {
  RADIO_GROUP = 'RadioGroup',
  RADIO_BUTTON = 'RadioButton',
  CHECKBOX_GROUP = 'CheckboxGroup',
  CHECKBOX_BUTTON = 'CheckboxButton',
  INPUT = 'Input',
  AUTOCOMPLETE = 'Autocomplete',
  INPUT_NUMBER = 'InputNumber',
  SELECT = 'Select',
  CASCADER = 'Cascader',
  SWITCH = 'Switch',
  SLIDER = 'Slider',
  TIME_PICKER = 'TimePicker',
  DATE_PICKER = 'DatePicker',
  RATE = 'Rate',
  COLOR_PICKER = 'ColorPicker',
  TRANSFER = 'Transfer',
  DIVIDER = 'Divider',
  TIME_SELECT = 'TimeSelect',
  SELECT_V2 = 'SelectV2',

  TREE_SELECT = 'TreeSelect',
  UPLOAD = 'Upload',
}

export type ComponentName = keyof typeof ComponentNameEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}`
      : `${Capitalize<Lowercase<K>>}`
    : never
  : never

export type FormSchema = {
  fields: string
  component: ComponentName
  componentProp:
    | RadioGroupProps
    | CheckboxGroupProps
    | InputProps
    | AutocompleteProps
    | InputNumberProps
    | SelectProps
    | CascaderProps
    | SwitchProps
    | SliderProps
    | DatePickerProps
    | RateProps
    | ColorPickerProps
    | TransferProps
    | DividerProps
    | TimeSelectProps
    | SelectV2Props
    | UploadProps
}
