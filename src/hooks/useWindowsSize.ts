import { useState, useEffect } from 'react';

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<{ [key: string]: any }>({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        let resizeTimer: any;
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }, 250);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}
