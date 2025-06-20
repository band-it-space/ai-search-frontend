import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function Loader() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4, 'flexDirection': 'column', 'gap': '20px' }}>
            <CircularProgress />
            <p>ШІ думає над відповіддю 🤖 Це може зайняти ще кілька секунд. Дякуємо, за очікування!</p>
        </Box>
    );
}
