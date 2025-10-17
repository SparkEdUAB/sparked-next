import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatar?: string;
      role?: string;
      institution_id?: string;
    };
    role?: string;
    institution_id?: string;
  }

  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    role?: string;
    institution_id?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    sub?: string;
    institution_id?: string;
  }
}
