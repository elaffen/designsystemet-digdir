import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { createContext, forwardRef, useId, useState } from 'react';

import type { Size } from '../../types';
import { RovingFocusRoot } from '../../utilities/RovingFocus';

export type ToggleGroupContextProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
};

export const ToggleGroupContext = createContext<ToggleGroupContextProps>({});

export type ToggleGroupProps = {
  /** Controlled state for `ToggleGroup` component. */
  value?: string;
  /** Default value. */
  defaultValue?: string;
  /** Callback with selected `ToggleGroupItem` `value` */
  onChange?: (value: string) => void;
  /** Form element name */
  name?: string;
  /**
   * Size
   */
  size?: Size;
} & Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'>;

/**
 * Display a group of buttons that can be toggled between.
 * @example
 * <ToggleGroup onChange={(value) => console.log(value)}>
 *   <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 *   <ToggleGroup.Item value='2'>Toggle 2</ToggleGroup.Item>
 *   <ToggleGroup.Item value='3'>Toggle 3</ToggleGroup.Item>
 * </ToggleGroup>
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(
    { size, children, value, defaultValue, onChange, name, className, ...rest },
    ref,
  ) {
    const nameId = useId();
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | undefined
    >(defaultValue);

    let onValueChange = onChange;
    if (!isControlled) {
      onValueChange = (newValue: string) => {
        setUncontrolledValue(newValue);
        onChange?.(newValue);
      };
      value = uncontrolledValue;
    }

    return (
      <ToggleGroupContext.Provider
        value={{
          value,
          defaultValue,
          name: name ?? `togglegroup-name-${nameId}`,
          onChange: onValueChange,
        }}
      >
        <RovingFocusRoot asChild activeValue={value} orientation='ambiguous'>
          <div
            className={cl('ds-togglegroup', className)}
            data-size={size}
            role='radiogroup'
            ref={ref}
            {...rest}
          >
            {name && <input type='hidden' name={name} value={value} />}
            {children}
          </div>
        </RovingFocusRoot>
      </ToggleGroupContext.Provider>
    );
  },
);
