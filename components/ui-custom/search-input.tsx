import React from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Props extends React.ComponentProps<'input'> {
    placeholder?: string;
}

const SearchInput = ({ placeholder, ...props }: Props) => {
    return (
        <div className="relative">
            <Input
                {...props}
                placeholder={placeholder}
                className={cn(
                    'pl-9 text-sm min-w-56 bg-gray-50',
                    props.className
                )}
            />
            <MagnifyingGlassIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
    );
};

export default SearchInput;
