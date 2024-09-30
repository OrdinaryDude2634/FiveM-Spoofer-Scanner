function howLongSinceDateInMonths(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    return (currentDate.getFullYear() - givenDate.getFullYear()) * 12 + (currentDate.getMonth() - givenDate.getMonth());
}

export async function getAccountAge(steamHex, timeout) {
    let response = await fetch('https://steamid.pro/', {
        cache: 'no-store',
        method: 'POST',
        signal: AbortSignal.timeout(timeout),
        body: `url=steam%3A${steamHex.slice(6)}`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    });    
    
    const match = (await response.text()).match(/was created\s*on ([\w\s,]+)/);
    return howLongSinceDateInMonths(match[1]);
}

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
