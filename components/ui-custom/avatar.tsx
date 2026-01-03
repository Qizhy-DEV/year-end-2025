import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface Props {
    src: string;
    className?: string;
    fallback?: string;
}

const AvatarCustom = ({ src, className, fallback }: Props) => {
    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={src} />
            <AvatarFallback>{fallback ?? 'A'}</AvatarFallback>
        </Avatar>
    );
};

export default AvatarCustom;
