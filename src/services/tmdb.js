const API_KEY = '255227246862979880faf00116fac593';
const BASE_URL = 'https://api.themoviedb.org/3';
export async function getSeriesDetails(id) {
    const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=ar`);
    if (!res.ok) {
        throw new Error('Failed to fetch series details');
    }
    return res.json();
}
