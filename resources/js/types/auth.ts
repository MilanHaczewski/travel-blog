export type User = {
    id: number;
    name: string;
    email: string;
    role: 'master' | 'admin';
    status: 'active' | 'deactivated' | 'archived';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
};

export type Auth = {
    user: User | null;
};

export type Flash = {
    success: string | null;
    error: string | null;
};
