import axios, { AxiosResponse } from 'axios';
import { SafeKeyLocalStorage } from './Ultils/safeKeyLocalStorage';

interface LoginRequest {
    TaiKhoan: string;
    MatKhau: string;
}

interface DataUserResponse {
    IDUser?: string;
    UserName?: string;
    RoleUsers?: string[] | string;
    Role?: string[] | string;
    Roles?: string[] | string;
    UserRoles?: string[] | string;
    RoleUse?: string[] | string;
    [key: string]: any; // Allow for any additional properties
}

interface AuthTokens {
    token: string;
    refreshToken: string;
}

interface LoginResponse extends AuthTokens {
    idUser?: string;
    nameUser?: string;
}

export interface AuthError {
    message: string;
    code?: string;
    status?: number;
}

export class AuthController {
    private readonly baseUrl: string;
    private token: string | null;
    private refreshToken: string | null;
    private _isAuthenticated: boolean = false;
    private _userData: DataUserResponse | null = null;
    private refreshPromise: Promise<boolean> | null = null;

    // Singleton instance
    private static instance: AuthController;

    private constructor(baseUrl: string = 'https://192.168.11.1:5001/api') {
        this.baseUrl = baseUrl;
        // Only access localStorage if we're in the browser
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem(SafeKeyLocalStorage.Token);
            this.refreshToken = localStorage.getItem(SafeKeyLocalStorage.RefreshToken);
        } else {
            this.token = null;
            this.refreshToken = null;
        }
        this._isAuthenticated = Boolean(this.token);
    }

    public static getInstance(baseUrl: string = 'https://192.168.11.1:5001/api'): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController(baseUrl);
        }
        return AuthController.instance;
    }

    public get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    public get userData(): DataUserResponse | null {
        return this._userData;
    }

    public async authenticate(username: string, password: string): Promise<{success: boolean, error?: AuthError}> {
        try {
            const loginData: LoginRequest = {
                TaiKhoan: username,
                MatKhau: password
            };
            const response: AxiosResponse<LoginResponse> = await axios.post(
                `${this.baseUrl}/Authentication/login`,
                loginData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                }
            );
          
            if (response.data.token && response.data.refreshToken) {
                this.token = response.data.token;
                this.refreshToken = response.data.refreshToken;
                this.saveTokensToStorage();
                this._isAuthenticated = true;
                await this.fetchUserData();
                return { success: true };
            }
            return { 
                success: false, 
                error: { message: 'Invalid response from server. Missing token.' } 
            };
        } catch (error: any) {
            this._isAuthenticated = false;
            const status = error.response?.status;
            let errorMessage = 'Authentication failed. Please try again.';
            
            if (status === 401) {
                errorMessage = 'Invalid username or password.';
            } else if (status === 403) {
                errorMessage = 'Your account does not have permission to access the system.';
            } else if (status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            return { 
                success: false, 
                error: { 
                    message: errorMessage, 
                    status, 
                    code: error.code 
                } 
            };
        }
    }

    public async fetchUserData(): Promise<DataUserResponse | null> {
        try {
            if (!this.token) {
                console.log("fetchUserData: No token available");
                this._userData = null;
                return null;
            }
            
            const response: AxiosResponse<DataUserResponse> = await axios.get(
                `${this.baseUrl}/NguoiDung/getInforUser`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            if (!response.data) {
                console.log("fetchUserData: No data in response");
                this._userData = null;
                return null;
            }
            
            // Log entire response to see what fields are available
            console.log("API Response data:", JSON.stringify(response.data));
 
            // Check for different possible role field names in the API response
            const roleData = response.data.RoleUsers || 
                             response.data.Role || 
                             response.data.Roles || 
                             response.data.UserRoles ||
                             response.data.RoleUse;
                             
            console.log("Role data found:", roleData);
                             
            // Ensure roles is an array if it exists
            let roles: string[] = [];
            if (roleData) {
                // Handle if roles is a string or array
                if (typeof roleData === 'string') {
                    // Split by comma if it's a comma-separated string
                    roles = (roleData as string).split(',').map((r: string) => r.trim());
                } else if (Array.isArray(roleData)) {
                    roles = roleData as string[];
                }
            }
            
            this._userData = {
                IDUser: response.data.IDUser,
                UserName: response.data.UserName,
                RoleUsers: roles
            };
            
            console.log("fetchUserData: User data processed:", this._userData);
            return this._userData;
        } catch (error) {
            console.error("fetchUserData error:", error);
            this._userData = null;
            return null;
        }
    }

    public async refreshAuthToken(): Promise<boolean> {
        // Prevent multiple simultaneous refresh attempts
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this._refreshAuthToken();
        const result = await this.refreshPromise;
        this.refreshPromise = null;
        return result;
    }

    private async _refreshAuthToken(): Promise<boolean> {
        const storedRefreshToken = this.refreshToken || 
            (typeof window !== 'undefined' ? localStorage.getItem(SafeKeyLocalStorage.RefreshToken) : null);
        if (!storedRefreshToken) return false;

        try {
            const response: AxiosResponse<AuthTokens> = await axios.post(
                `${this.baseUrl}/Authentication/refresh-token`,
                { refreshToken: storedRefreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                }
            );

            if (response.data.token && response.data.refreshToken) {
                this.token = response.data.token;
                this.refreshToken = response.data.refreshToken;
                this.saveTokensToStorage();
                this._isAuthenticated = true;
                return true;
            }
            
            // If we didn't get valid tokens, clear the auth state
            this.logout();
            return false;
        } catch (error) {
            // If refresh fails, clear the auth state
            this.logout();
            return false;
        }
    }

    private saveTokensToStorage(): void {
        // Only save to localStorage if we're in the browser
        if (typeof window !== 'undefined') {
            if (this.refreshToken) {
                localStorage.setItem(SafeKeyLocalStorage.RefreshToken, this.refreshToken);
            }
            if (this.token) {
                localStorage.setItem(SafeKeyLocalStorage.Token, this.token);
            }
        }
    }

    public async checkAuthStatus(): Promise<boolean> {
        // If we already have userData, we're authenticated
        if (this._userData?.IDUser) {
            return true;
        }
        
        // Try to get user data with current token
        const userData = await this.fetchUserData();
        if (userData?.IDUser) {
            return true;
        }
        
        // If that fails, try to refresh the token
        return await this.refreshAuthToken();
    }

    public hasRole(role: string): boolean {
        console.log(`Checking role ${role} against:`, this._userData?.RoleUsers);
        
        // If no roles data, return false
        if (!this._userData?.RoleUsers || !Array.isArray(this._userData.RoleUsers)) {
            return false;
        }
        
        // Case-insensitive check for the role
        const normalizedRole = role.toLowerCase();
        return this._userData.RoleUsers.some(userRole => 
            typeof userRole === 'string' && userRole.toLowerCase() === normalizedRole
        );
    }

    public getToken(): string | null {
        return this.token;
    }

    public logout(): void {
        this.token = null;
        this.refreshToken = null;
        this._isAuthenticated = false;
        this._userData = null;
        // Only remove from localStorage if we're in the browser
        if (typeof window !== 'undefined') {
            localStorage.removeItem(SafeKeyLocalStorage.Token);
            localStorage.removeItem(SafeKeyLocalStorage.RefreshToken);
        }
    }
} 