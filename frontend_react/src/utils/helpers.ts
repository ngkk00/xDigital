export const getErrorMessage = (error: unknown): string => {
    if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object'
    ) {
        const res = (error as any).response

        if (res?.data?.message) return res.data.message;
        if (typeof res?.data === 'string') return res.data;
        if (typeof res?.statusText === 'string') return res.statusText
    }
    if (typeof error === 'string') {
        return error;
    }
    // Placed at the back as the error is from error.response.data.message
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
};