import { SafeKeyLocalStorage } from './Ultils/safeKeyLocalStorage';
import { BaseHttpClient } from './baseHttpClient';

interface LoginRequest {
    TaiKhoan: string;
    MatKhau: string;
}

interface UserData {
    maNguoiDung: string;
    taiKhoan: string;
    email: string;
    ten: string;
    phuongThucDangNhap: string;
}

interface DataUserResponse {
    maNguoiDung?: string;
    taiKhoan?: string;
    email?: string;
    ten?: string;
    phuongThucDangNhap?: string;
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
    user: UserData;
}

export interface AuthError {
    message: string;
    code?: string;
    status?: number;
}

export class AuthController extends BaseHttpClient {
    private token: string | null;
    private refreshToken: string | null;
    private _isAuthenticated: boolean = false;
    private _userData: DataUserResponse | null = null;
    private refreshPromise: Promise<boolean> | null = null;

    // Singleton instance
    private static instance: AuthController;

    private constructor(baseUrl: string = 'https://weevil-proud-definitely.ngrok-free.app/api') {
        super(baseUrl);
        // Initialize with null values for SSR safety
        this.token = null;
        this.refreshToken = null;
        this._isAuthenticated = false;
        
        // Only access localStorage after ensuring we're in the browser
        this.initializeFromStorage();
    }

    private initializeFromStorage(): void {
        // Only access localStorage if we're in the browser
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                this.token = localStorage.getItem(SafeKeyLocalStorage.Token);
                this.refreshToken = localStorage.getItem(SafeKeyLocalStorage.RefreshToken);
                this._isAuthenticated = Boolean(this.token);
            } catch (error) {
                console.warn('Failed to access localStorage:', error);
                // Fallback to default values
                this.token = null;
                this.refreshToken = null;
                this._isAuthenticated = false;
            }
        }
    }

    public static getInstance(baseUrl: string = 'https://weevil-proud-definitely.ngrok-free.app/api'): AuthController {
        // Only create instance if we don't have one or if we're in the browser
        if (!AuthController.instance || (typeof window !== 'undefined' && !AuthController.instance.token && !AuthController.instance.refreshToken)) {
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
            const response = await this.post<LoginResponse>('/Authentication/login', loginData);
          
            if (response.token && response.refreshToken && response.user) {
                this.token = response.token;
                this.refreshToken = response.refreshToken;
                this.saveTokensToStorage();
                this._isAuthenticated = true;
                
                this._userData = {
                    maNguoiDung: response.user.maNguoiDung,
                    taiKhoan: response.user.taiKhoan,
                    email: response.user.email,
                    ten: response.user.ten,
                    phuongThucDangNhap: response.user.phuongThucDangNhap,
                    RoleUsers: this.extractRolesFromToken(this.token)
                };
                
                console.log("Login successful. User data:", this._userData);
                return { success: true };
            }
            return { 
                success: false, 
                error: { message: 'Invalid response from server. Missing token or user data.' } 
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
            
            const response = await this.get<DataUserResponse>('/NguoiDung/getInforUser', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response) {
                console.log("fetchUserData: No data in response");
                this._userData = null;
                return null;
            }
            
            // Log entire response to see what fields are available
            console.log("API Response data:", JSON.stringify(response));
 
            // Extract roles from token if not present in response
            let roles: string[] = [];
            const roleData = response.RoleUsers || 
                             response.Role || 
                             response.Roles || 
                             response.UserRoles ||
                             response.RoleUse;
                             
            if (roleData) {
                // Handle if roles is a string or array
                if (typeof roleData === 'string') {
                    // Split by comma if it's a comma-separated string
                    roles = (roleData as string).split(',').map((r: string) => r.trim());
                } else if (Array.isArray(roleData)) {
                    roles = roleData as string[];
                }
            } else {
                // If no roles in API response, extract from token
                roles = this.extractRolesFromToken(this.token);
            }
            
            console.log("Role data found:", roles);
            
            this._userData = {
                maNguoiDung: response.maNguoiDung,
                taiKhoan: response.taiKhoan,
                email: response.email,
                ten: response.ten,
                phuongThucDangNhap: response.phuongThucDangNhap,
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
            (typeof window !== 'undefined' && window.localStorage ? 
                (() => {
                    try {
                        return localStorage.getItem(SafeKeyLocalStorage.RefreshToken);
                    } catch (error) {
                        console.warn('Failed to access localStorage for refresh token:', error);
                        return null;
                    }
                })() : null);
        if (!storedRefreshToken) return false;

        try {
            // Send as query parameter since API expects string parameter
            const response = await this.post<AuthTokens>(
                `/Authentication/refreshToken?refreshToken=${encodeURIComponent(storedRefreshToken)}`, 
                null
            );

            if (response.token && response.refreshToken) {
                this.token = response.token;
                this.refreshToken = response.refreshToken;
                this.saveTokensToStorage();
                this._isAuthenticated = true;
                return true;
            }
            this.logout();
            return false;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    private saveTokensToStorage(): void {
        // Only save to localStorage if we're in the browser
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                if (this.refreshToken) {
                    localStorage.setItem(SafeKeyLocalStorage.RefreshToken, this.refreshToken);
                }
                if (this.token) {
                    localStorage.setItem(SafeKeyLocalStorage.Token, this.token);
                }
            } catch (error) {
                console.warn('Failed to save tokens to localStorage:', error);
                // Continue without saving to localStorage
            }
        }
    }

    public async checkAuthStatus(): Promise<boolean> {
        // If we already have userData, we're authenticated
        if (this._userData?.maNguoiDung) {
            return true;
        }
        
        // Try to get user data with current token
        const userData = await this.fetchUserData();
        if (userData?.maNguoiDung) {
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

    private extractRolesFromToken(token: string): string[] {
        try {
            // JWT tokens have 3 parts separated by dots: header.payload.signature
            const payload = token.split('.')[1];
            if (!payload) return [];
            
            // Decode base64 payload
            const decodedPayload = JSON.parse(atob(payload));
            
            // Extract role claim from token
            const roleData = decodedPayload.role;
            
            if (Array.isArray(roleData)) {
                return roleData;
            } else if (typeof roleData === 'string') {
                return [roleData];
            }
            
            return [];
        } catch (error) {
            console.warn('Failed to extract roles from token:', error);
            return [];
        }
    }

    public logout(): void {
        this.token = null;
        this.refreshToken = null;
        this._isAuthenticated = false;
        this._userData = null;
        // Only remove from localStorage if we're in the browser
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                localStorage.removeItem(SafeKeyLocalStorage.Token);
                localStorage.removeItem(SafeKeyLocalStorage.RefreshToken);
            } catch (error) {
                console.warn('Failed to remove tokens from localStorage:', error);
                // Continue without clearing localStorage
            }
        }
    }
} 