// APIクライアント設定
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'employee' | 'admin';
  department?: string;
  employee_id?: string;
  is_active: boolean;
  full_name: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: 'employee' | 'admin';
  department?: string;
  employee_id?: string;
}

// 勤怠関連のインターフェース
export interface BreakRecord {
  id: number;
  attendance_record_id: number;
  break_start: string;
  break_end: string | null;
  duration_minutes: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  break_minutes: number;
  total_hours: number;
  overtime_hours: number;
  status: 'present' | 'absent' | 'late' | 'early_leave' | 'half_day';
  break_status: 'working' | 'on_break';
  notes: string | null;
  created_at: string;
  updated_at: string;
  is_clocked_in: boolean;
  is_clocked_out: boolean;
  is_working: boolean;
  is_on_break: boolean;
  total_break_minutes: number;
  break_records: BreakRecord[];
}

export interface AttendanceCreate {
  break_minutes: number;
}

export interface AttendanceUpdate {
  clock_out: string;
  break_minutes: number;
}

export interface AttendanceSummary {
  date: string;
  total_working_hours: number;
  total_break_minutes: number;
  status: 'normal' | 'late' | 'early' | 'absent';
}

// APIクライアントクラス
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // 認証関連API
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async getAuth0Me(authToken: string): Promise<{ user: unknown }> {
    return this.request<{ user: unknown }>('/auth/me/auth0', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  async register(data: RegisterRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async logout(token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ユーザー関連API
  async getCurrentUser(token: string): Promise<UserResponse> {
    return this.request<UserResponse>('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getCurrentUserProfile(token: string): Promise<UserResponse> {
    return this.request<UserResponse>('/users/me/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 勤怠関連API
  async getTodayAttendance(token: string): Promise<AttendanceRecord | null> {
    try {
      return await this.request<AttendanceRecord | null>('/attendance/today', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('404')) {
        return null; // 今日の記録がない場合はnullを返す
      }
      throw error;
    }
  }

  async clockIn(
    token: string,
    data: AttendanceCreate
  ): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>('/attendance/clock-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async clockOut(
    token: string,
    data: AttendanceUpdate
  ): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>('/attendance/clock-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async cancelClockOut(token: string): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>('/attendance/cancel-clock-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async startBreak(token: string, notes?: string): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>('/attendance/break/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    });
  }

  async endBreak(token: string, notes?: string): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>('/attendance/break/end', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    });
  }

  async getAttendanceHistory(
    token: string,
    year?: number,
    month?: number
  ): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    return this.request<AttendanceRecord[]>(`/attendance/history?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAttendanceSummary(
    token: string,
    year?: number,
    month?: number
  ): Promise<AttendanceSummary[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    return this.request<AttendanceSummary[]>(`/attendance/summary?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ヘルスチェック
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient(API_BASE_URL);
