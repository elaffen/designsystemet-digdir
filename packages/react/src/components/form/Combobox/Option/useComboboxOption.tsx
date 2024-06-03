import { useContext, useEffect, useId, useMemo } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { ComboboxContext } from '../ComboboxContext';
import useDebounce from '../../../../utilities/useDebounce';
import { useComboboxId, useComboboxIdDispatch } from '../ComboboxIdContext';
import { INTERNAL_OPT_PREFIX } from '../useCombobox';

type UseComboboxOptionProps = {
  id?: string;
  ref: React.Ref<HTMLButtonElement>;
  value: string;
};

export default function useComboboxOption({
  id,
  ref,
  value,
}: UseComboboxOptionProps) {
  const generatedId = useId();
  const newId = id || generatedId;

  const context = useContext(ComboboxContext);
  const { activeIndex } = useComboboxId();
  const dispatch = useComboboxIdDispatch();
  if (!context) {
    throw new Error('ComboboxOption must be used within a Combobox');
  }
  const {
    selectedOptions,
    onOptionClick,
    listRef,
    customIds,
    filteredOptions,
  } = context;

  const index = useMemo(
    () =>
      filteredOptions.indexOf(INTERNAL_OPT_PREFIX + String(value)) +
      customIds.length,
    [customIds.length, filteredOptions, value],
  );

  const combinedRef = useMergeRefs([
    (node: HTMLElement | null) => {
      listRef.current[index] = node;
    },
    ref,
  ]);

  if (index === -1) {
    throw new Error('Internal error: ComboboxOption did not find index');
  }

  const selected = selectedOptions[INTERNAL_OPT_PREFIX + value];
  const active = activeIndex === index;

  useEffect(() => {
    if (active) {
      dispatch?.({ type: 'SET_ACTIVE_INDEX', payload: index });
    }
  }, [generatedId, id, dispatch, active, index]);

  const onOptionClickDebounced = useDebounce(() => onOptionClick(value), 50);

  return {
    id: newId,
    ref: combinedRef,
    selected,
    active,
    onOptionClick: onOptionClickDebounced,
  };
}
