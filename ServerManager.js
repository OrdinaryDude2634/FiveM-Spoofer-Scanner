export class ServerManager {
    static async getPlayers(serverID) {
        let response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${serverID}`, {
            cache: 'no-store',
            method: 'GET'
        });

        if (response.status == 404) {
            return 404;
        }
        
        if (!response.ok) {
            return false;
        }

        return (await response.json()).Data.players;
    }
}
