import { API_BASE } from "../config";

class UserData {
    user = $state<{
        username: string,
        email: string,
        is_admin: boolean,
        hackatime_api_key: string,
        hackclub_id: string,
        hackclub_verification_status: string,
        vscode_extensions: string
    }>()

    async refresh() {
        const response = await fetch(`${API_BASE}/users/me`, {
            credentials: "include",
        });
        const json = await response.json()
        if (json.success == false) {
            return false
        } else {
            this.user = json.data
            return true
        }
    }
}


export const userData = new UserData()