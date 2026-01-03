import * as React from 'react';

const ScreenWidthContext = React.createContext({
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2xl: false,
});

const BREAKPOINTS = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export function ScreenWidthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [screenSizes, setScreenSizes] = React.useState({
        isXs: true,
        isSm: false,
        isMd: false,
        isLg: false,
        isXl: false,
        is2xl: false,
    });

    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSizes({
                isXs: width >= BREAKPOINTS.xs && width < BREAKPOINTS.sm,
                isSm: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
                isMd: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
                isLg: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
                isXl: width >= BREAKPOINTS.xl && width < BREAKPOINTS['2xl'],
                is2xl: width >= BREAKPOINTS['2xl'],
            });
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <ScreenWidthContext.Provider value={screenSizes}>
            {children}
        </ScreenWidthContext.Provider>
    );
}

export function useScreenWidth() {
    const context = React.useContext(ScreenWidthContext);
    if (context === undefined) {
        throw new Error(
            'useScreenWidth must be used within a ScreenWidthProvider'
        );
    }
    return context;
}
