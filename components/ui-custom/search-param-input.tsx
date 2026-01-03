'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import SearchInput from './search-input';
import { useDebounce } from '@/hooks/use-debounce';

interface Props {
    paramKey?: string;
    placeholder?: string;
    delay?: number;
    className?: string;
}

const SearchParamsInput = ({
    paramKey = 'q',
    placeholder = 'Search...',
    delay = 500,
    className = '',
}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(searchParams.get(paramKey) || '');
    const debouncedValue = useDebounce(value, delay);

    useEffect(() => {
        setValue(searchParams.get(paramKey) || '');
    }, [searchParams, paramKey]);

    useEffect(() => {
        const currentParamValue = searchParams.get(paramKey) || '';

        // Only update if the debounced value is different from the current param
        if (debouncedValue === currentParamValue) {
            return;
        }

        const params = new URLSearchParams(searchParams.toString());

        if (debouncedValue) {
            params.set(paramKey, debouncedValue);
        } else {
            params.delete(paramKey);
        }

        router.replace(`${pathname}?${params.toString()}`);
    }, [debouncedValue, paramKey, pathname, router, searchParams]);

    return (
        <SearchInput
            className={className}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
        />
    );
};

export default SearchParamsInput;
