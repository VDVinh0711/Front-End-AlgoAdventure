    import axios, { AxiosResponse } from 'axios';
    import { SafeKeyLocalStorage } from './Ultils/safeKeyLocalStorage';

    interface LoginRequest {
        TaiKhoan: string;
        MatKhau: string;
    }

    interface DataUserResponse {
        IDUser?: string;
        UserName?: string;
        RoleUse?: string[];
    }

    interface AuthTokens {
        token: string;
        refreshToken: string;
    }

    interface LoginResponse extends AuthTokens {
        idUser?: string;
        nameUser?: string;
    }

    export class AuthController {
        private readonly baseUrl: string;
        private token: string | null;
        private refreshToken: string | null;
        private _isAuthenticated: boolean = false;

        constructor(baseUrl: string = 'https://192.168.11.1:5001/api') {
            this.baseUrl = baseUrl;
            this.token = null;
            this.refreshToken = null;
        }

        public get isAuthenticated(): boolean {
            return this._isAuthenticated;
        }

        public async authenticate(username: string, password: string): Promise<boolean> {
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
                    await this.getDataUser();
                    return true;
                }
                return false;
            } catch (error) {
                this._isAuthenticated = false;
                console.error('Authentication error:', error);
                return false;
            }
        }

        public async getDataUser(): Promise<DataUserResponse> {
            try {
              
                const token = localStorage.getItem(SafeKeyLocalStorage.Token);
                if(!token)
                {
                    return {};
                }
                this.token = token;
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
                    return {};
                }
                return {
                    IDUser: response.data.IDUser,
                    UserName: response.data.UserName,
                    RoleUse: response.data.RoleUse
                };
            } catch (error) {
                console.error('Error getting user data:', error);
                return {};
            }
        }

        public async refreshAuthToken(): Promise<boolean> {
            const storedRefreshToken = localStorage.getItem(SafeKeyLocalStorage.RefreshToken);
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
                return false;
            } catch (error) {
                console.error('Error refreshing token:', error);
                this._isAuthenticated = false;
                return false;
            }
        }

        private saveTokensToStorage(): void {
            if (this.refreshToken) {
                localStorage.setItem(SafeKeyLocalStorage.RefreshToken, this.refreshToken);
            }
            if (this.token) {
                localStorage.setItem(SafeKeyLocalStorage.Token, this.token);
            }
        }

        public async checkAuthStatus(): Promise<boolean> {
            const token = localStorage.getItem(SafeKeyLocalStorage.Token);
            if (!token) return false;
            this.token = token;
            const userData = await this.getDataUser();
            if (userData.IDUser) {
                return true;
            }
            return await this.refreshAuthToken();
        }

        public logout(): void {
            this.token = null;
            this.refreshToken = null;
            this._isAuthenticated = false;
            localStorage.removeItem(SafeKeyLocalStorage.Token);
            localStorage.removeItem(SafeKeyLocalStorage.RefreshToken);
        }
    } 