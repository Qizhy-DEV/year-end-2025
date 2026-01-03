import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DivideIcon } from 'lucide-react';
import React, { SetStateAction } from 'react';

export interface OptionDropdown {
    name: string;
    icon?: any;
    route?: string;
    fn?: () => void;
    color?: string;
}

interface Props {
    children: React.ReactNode;
    options: OptionDropdown[];
    className?: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
    align?: 'start' | 'center' | 'end';
}

const DropdownCustom = ({
    children,
    options,
    className,
    align,
    side,
}: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={cn('outline-none', className)}>{children}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} side={side} className="w-56">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.name}
                        onClick={() => {
                            if (option.route) {
                                window.location.href = option.route;
                            }
                            if (option.fn) {
                                option.fn();
                            }
                        }}
                        className="cursor-pointer"
                    >
                        {option.icon && (
                            <option.icon className="mr-2 h-4 w-4" />
                        )}
                        <span>{option.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropdownCustom;
