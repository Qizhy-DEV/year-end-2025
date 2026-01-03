import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

/**
 * Debounce a value using lodash.debounce.
 *
 * @param value The value to debounce
 * @param delay Delay in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    const debouncedSetter = useMemo(
        () =>
            debounce((val: T) => {
                setDebouncedValue(val);
            }, delay),
        [delay]
    );

    useEffect(() => {
        debouncedSetter(value);
        return () => debouncedSetter.cancel();
    }, [value, debouncedSetter]);

    return debouncedValue;
}
