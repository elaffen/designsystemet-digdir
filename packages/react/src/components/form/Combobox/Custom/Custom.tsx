import { forwardRef, useContext, useId, useMemo } from 'react';
import type * as React from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import { useMergeRefs } from '@floating-ui/react';

import { ComboboxContext } from '../ComboboxContext';
import { omit } from '../../../../utilities';
import { useComboboxId } from '../ComboboxIdContext';

import classes from './Custom.module.css';

type InteractiveProps = {
  interactive: true;
  id: string;
};

type NonInteractiveProps = {
  interactive?: false;
  id?: string;
};

export type ComboboxCustomProps = {
  /**
   * Adds the item to the navigation flow at the start of the list.
   * @default false
   */
  interactive?: boolean;
  /**
   * Required if the element is interactive.
   */
  id?: string;
  /**
   * Event handler for select event.
   * Only called if the element is interactive.
   */
  onSelect?: () => void;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
  (InteractiveProps | NonInteractiveProps);

export const ComboboxCustom = forwardRef<HTMLDivElement, ComboboxCustomProps>(
  ({ asChild, interactive, id, className, ...rest }, ref) => {
    if (interactive && !id) {
      throw new Error('If ComboboxCustom is interactive, it must have an id');
    }

    const Component = asChild ? Slot : 'div';

    const randomId = useId();

    const { activeIndex } = useComboboxId();
    const context = useContext(ComboboxContext);

    if (!context) {
      throw new Error('ComboboxCustom must be used within a Combobox');
    }

    const { size, customIds, listRef, getItemProps } = context;

    const index = useMemo(
      () => (id && customIds.indexOf(id)) || 0,
      [id, customIds],
    );

    const combinedRef = useMergeRefs([
      (node: HTMLElement | null) => {
        listRef.current[index] = node;
      },
      ref,
    ]);

    return (
      <Component
        ref={combinedRef}
        tabIndex={-1}
        className={cl(classes.custom, classes[size], className)}
        id={id || randomId}
        role='option'
        aria-selected={activeIndex === index}
        data-active={activeIndex === index}
        {...omit(['interactive'], rest)}
        {...omit(['onClick', 'onPointerLeave'], getItemProps())}
      />
    );
  },
);

export default ComboboxCustom;
